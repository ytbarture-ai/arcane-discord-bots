import { GuildMember, EmbedBuilder, Colors, ChannelType } from "discord.js";
import {
  getInviteCache,
  setInviteCache,
  setInviteUsage,
  getGuildConfig,
  InviteData,
} from "../utils/store.js";
import { logger } from "../../lib/logger.js";

export async function handleGuildMemberAdd(member: GuildMember) {
  const guild = member.guild;

  // --- Track invitation ---
  try {
    const newInvites = await guild.invites.fetch();
    const oldCache = getInviteCache(guild.id);
    const newCache = new Map<string, InviteData>();

    let usedCode: string | null = null;

    for (const [code, invite] of newInvites) {
      const oldUses = oldCache.get(code)?.uses ?? 0;
      const newUses = invite.uses ?? 0;

      if (newUses > oldUses && invite.inviter) {
        usedCode = code;
        const existing = oldCache.get(code);
        newCache.set(code, {
          inviterId: invite.inviter.id,
          inviterTag: invite.inviter.tag,
          uses: newUses,
          invitees: [...(existing?.invitees ?? []), member.id],
        });
      } else {
        newCache.set(code, oldCache.get(code) ?? {
          inviterId: invite.inviter?.id ?? "unknown",
          inviterTag: invite.inviter?.tag ?? "unknown",
          uses: newUses,
          invitees: [],
        });
      }
    }

    setInviteCache(guild.id, newCache);

    if (usedCode) {
      const inviter = newCache.get(usedCode);
      if (inviter) {
        setInviteUsage(guild.id, member.id, usedCode);
      }
    }
  } catch (err) {
    logger.warn({ err, guildId: guild.id }, "Could not track invite on member join");
  }

  // --- Send welcome message ---
  try {
    const config = getGuildConfig(guild.id);
    if (!config.welcomeChannelId || !config.welcomeMessage) return;

    const channel = guild.channels.cache.get(config.welcomeChannelId);
    if (!channel || channel.type !== ChannelType.GuildText) return;

    const message = config.welcomeMessage
      .replace("{user}", `<@${member.id}>`)
      .replace("{server}", guild.name);

    const embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle("👋 Nouveau membre !")
      .setDescription(message)
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: `Membre #${guild.memberCount}` })
      .setTimestamp();

    await (channel as any).send({ embeds: [embed] });
  } catch (err) {
    logger.warn({ err, guildId: guild.id }, "Could not send welcome message");
  }
}
