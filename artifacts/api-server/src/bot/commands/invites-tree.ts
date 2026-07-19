import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
  PermissionFlagsBits,
} from "discord.js";
import { getInviteCache, getInviteUsage } from "../utils/store.js";

export const data = {
  name: "invites-tree",
  description: "Affiche l'arbre des invitations (qui a invité qui)",
  default_member_permissions: String(PermissionFlagsBits.ManageGuild),
};

export async function execute(interaction: ChatInputCommandInteraction) {
  const guild = interaction.guild!;
  const cache = getInviteCache(guild.id);
  const usage = getInviteUsage(guild.id);

  if (cache.size === 0 && usage.size === 0) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Blue)
          .setTitle("🌳 Arbre des invitations")
          .setDescription(
            "Aucune donnée d'invitation enregistrée.\n\n> Le bot commence à suivre les invitations dès qu'un nouveau membre rejoint le serveur.",
          ),
      ],
      ephemeral: true,
    });
    return;
  }

  // Build tree: inviterId -> list of invitee user IDs
  const tree = new Map<string, string[]>();

  for (const [, data] of cache) {
    if (data.invitees.length > 0) {
      tree.set(data.inviterId, data.invitees);
    }
  }

  if (tree.size === 0) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Blue)
          .setTitle("🌳 Arbre des invitations")
          .setDescription("Aucun membre n'a encore rejoint via une invitation trackée."),
      ],
      ephemeral: true,
    });
    return;
  }

  let description = "";
  for (const [inviterId, invitees] of tree) {
    description += `<@${inviterId}>\n`;
    for (const inviteeId of invitees.slice(0, 5)) {
      description += `  └─ <@${inviteeId}>\n`;
    }
    if (invitees.length > 5) {
      description += `  └─ *+${invitees.length - 5} autres…*\n`;
    }
    description += "\n";
    if (description.length > 3500) break;
  }

  const embed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle(`🌳 Arbre des invitations — ${guild.name}`)
    .setDescription(description)
    .setFooter({ text: "AiGuild • Suivi des invitations" })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
