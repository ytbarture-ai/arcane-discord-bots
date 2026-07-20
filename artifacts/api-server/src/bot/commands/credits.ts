import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

export const data = {
  name: "credits",
  description: "Informations et crédits du bot AiGuild",
};

export async function execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle("✨ AiGuild Bot")
    .setDescription(
      "Bot Discord alimenté par l'IA qui génère des structures de serveurs complètes à partir d'une simple description.",
    )
    .addFields(
      {
        name: "🤖 Technologie",
        value: "Propulsé par **GPT-4o mini** (OpenAI) + **discord.js v14**",
        inline: true,
      },
      {
        name: "⚡ Version",
        value: "2.0.0",
        inline: true,
      },
      {
        name: "🌐 Fonctionnalités",
        value:
          "• Génération IA de serveurs\n• Suivi des invitations\n• Messages de bienvenue\n• Salons statistiques vocaux\n• Support multilingue",
      },
    )
    .setFooter({ text: "AiGuild • Made with ❤️" })
    .setTimestamp();

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel("Site web")
      .setURL("https://aiguild.me")
      .setStyle(ButtonStyle.Link),
    new ButtonBuilder()
      .setLabel("Documentation")
      .setURL("https://aiguild.me/documentation")
      .setStyle(ButtonStyle.Link),
  );

  await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
}
