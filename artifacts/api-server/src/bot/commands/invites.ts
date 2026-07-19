import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
  PermissionFlagsBits,
} from "discord.js";
import { getInviteCache } from "../utils/store.js";

export const data = {
  name: "invites",
  description: "Affiche les statistiques d'invitations du serveur",
  default_member_permissions: String(PermissionFlagsBits.ManageGuild),
};

export async function execute(interaction: ChatInputCommandInteraction) {
  const guild = interaction.guild!;

  try {
    // Fetch current invites from Discord
    const guildInvites = await guild.invites.fetch();
    const cache = getInviteCache(guild.id);

    // Merge with cache to get invitees counts
    const stats = new Map<
      string,
      { tag: string; uses: number; invitees: string[] }
    >();

    for (const [code, invite] of guildInvites) {
      if (!invite.inviter) continue;
      const existing = stats.get(invite.inviter.id) ?? {
        tag: invite.inviter.tag,
        uses: 0,
        invitees: [],
      };
      existing.uses += invite.uses ?? 0;
      stats.set(invite.inviter.id, existing);
    }

    // Add cached invitees info
    for (const [code, data] of cache) {
      const inviterId = data.inviterId;
      if (stats.has(inviterId)) {
        const s = stats.get(inviterId)!;
        s.invitees = data.invitees;
        stats.set(inviterId, s);
      }
    }

    if (stats.size === 0) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle("📊 Statistiques d'invitations")
            .setDescription("Aucune invitation active sur ce serveur."),
        ],
        ephemeral: true,
      });
      return;
    }

    // Sort by uses
    const sorted = [...stats.entries()].sort(([, a], [, b]) => b.uses - a.uses);

    let description = "";
    let rank = 1;
    for (const [userId, data] of sorted.slice(0, 10)) {
      description += `**${rank}.** <@${userId}> — **${data.uses}** invitation${data.uses > 1 ? "s" : ""}\n`;
      rank++;
    }

    const embed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle(`📊 Top invitations — ${guild.name}`)
      .setDescription(description || "Aucune donnée disponible.")
      .setFooter({ text: `${guildInvites.size} invitation(s) active(s) au total` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  } catch {
    await interaction.reply({
      content:
        "❌ Je n'ai pas pu récupérer les invitations. Vérifie que j'ai la permission **Gérer les invitations**.",
      ephemeral: true,
    });
  }
}
