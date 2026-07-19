import { ChatInputCommandInteraction, EmbedBuilder, Colors } from "discord.js";

export const data = {
  name: "help",
  description: "Affiche toutes les commandes disponibles d'AiGuild",
};

export async function execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle("📖 AiGuild — Aide")
    .setDescription("Bot IA qui génère et gère la structure de ton serveur Discord.")
    .addFields(
      {
        name: "🔨 Configuration serveur",
        value:
          "`/setup` — Génère une structure complète (catégories, salons, rôles) via l'IA\n" +
          "`/config` — Configure les paramètres du bot (langue, etc.)\n" +
          "`/setup-bienvenue` — Configure le message de bienvenue\n" +
          "`/setup-statsvoc` — Configure des salons vocaux de statistiques",
      },
      {
        name: "📊 Statistiques & Invitations",
        value:
          "`/invites` — Voir les statistiques d'invitations du serveur\n" +
          "`/invites-tree` — Voir l'arbre des invitations (qui a invité qui)",
      },
      {
        name: "ℹ️ Informations",
        value: "`/credits` — Informations sur le bot AiGuild\n`/help` — Affiche ce message",
      },
    )
    .setFooter({ text: "AiGuild • Powered by Claude AI" })
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
