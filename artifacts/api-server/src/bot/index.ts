import {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
} from "discord.js";
import { logger } from "../lib/logger.js";
import { handleInteraction } from "./handlers/interaction.js";
import { handleGuildMemberAdd } from "./handlers/guildMemberAdd.js";
import { handleGuildMemberRemove } from "./handlers/guildMemberRemove.js";
import { deployCommands } from "./deploy-commands.js";
import { updateStatsChannels } from "./commands/setup-statsvoc.js";
import { getInviteCache, setInviteCache } from "./utils/store.js";

export async function startBot() {
  const token = process.env["DISCORD_BOT_TOKEN"];
  if (!token) {
    logger.warn("DISCORD_BOT_TOKEN not set — bot will not start");
    return;
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.GuildMember],
  });

  client.once(Events.ClientReady, async (readyClient) => {
    logger.info({ tag: readyClient.user.tag }, "AiGuild Bot is online");

    // Deploy slash commands
    try {
      await deployCommands(readyClient.user.id, token);
    } catch (err) {
      logger.error({ err }, "Failed to deploy commands on ready");
    }

    // Cache invites for all guilds
    for (const [, guild] of readyClient.guilds.cache) {
      try {
        const invites = await guild.invites.fetch();
        const cache = new Map();
        for (const [code, invite] of invites) {
          if (invite.inviter) {
            cache.set(code, {
              inviterId: invite.inviter.id,
              inviterTag: invite.inviter.tag,
              uses: invite.uses ?? 0,
              invitees: [],
            });
          }
        }
        setInviteCache(guild.id, cache);
      } catch {
        // Bot may not have MANAGE_GUILD permission on some guilds
      }
    }
  });

  // Handle interactions (slash commands, buttons, modals, select menus)
  client.on(Events.InteractionCreate, handleInteraction);

  // Handle member joins
  client.on(Events.GuildMemberAdd, async (member) => {
    await handleGuildMemberAdd(member);
    await updateStatsChannels(member.guild);
  });

  // Handle member leaves
  client.on(Events.GuildMemberRemove, handleGuildMemberRemove);

  // Cache new invites when created
  client.on(Events.InviteCreate, async (invite) => {
    if (!invite.guild || !invite.inviter) return;
    const cache = getInviteCache(invite.guild.id);
    cache.set(invite.code, {
      inviterId: invite.inviter.id,
      inviterTag: invite.inviter.tag,
      uses: invite.uses ?? 0,
      invitees: [],
    });
  });

  // Remove deleted invites from cache
  client.on(Events.InviteDelete, (invite) => {
    if (!invite.guild) return;
    const cache = getInviteCache(invite.guild.id);
    cache.delete(invite.code);
  });

  // Error handling
  client.on(Events.Error, (err) => {
    logger.error({ err }, "Discord client error");
  });

  await client.login(token);
}
