import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
  PermissionFlagsBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { getGuildConfig, setGuildConfig } from "../utils/store.js";

export const data = {
  name: "config",
  description: "Configure les paramètres d'AiGuild pour ce serveur",
  default_member_permissions: String(PermissionFlagsBits.ManageGuild),
};

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
    await interaction.reply({
      content: "❌ Tu as besoin de la permission **Gérer le serveur**.",
      ephemeral: true,
    });
    return;
  }

  const guildId = interaction.guildId!;
  const config = getGuildConfig(guildId);

  const langLabel =
    config.language === "fr" ? "🇫🇷 Français" : config.language === "es" ? "🇪🇸 Español" : "🇬🇧 English";

  const embed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle("⚙️ Configuration d'AiGuild")
    .setDescription(`Paramètres actuels pour **${interaction.guild?.name}** :`)
    .addFields({ name: "🌐 Langue", value: langLabel, inline: true });

  const select = new StringSelectMenuBuilder()
    .setCustomId("config_language")
    .setPlaceholder("Changer la langue")
    .addOptions([
      { label: "Français", value: "fr", emoji: "🇫🇷" },
      { label: "English", value: "en", emoji: "🇬🇧" },
      { label: "Español", value: "es", emoji: "🇪🇸" },
    ]);

  await interaction.reply({
    embeds: [embed],
    components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select)],
    ephemeral: true,
  });
}

export async function handleConfigLanguage(interaction: any) {
  const guildId = interaction.guildId!;
  const language = interaction.values[0];

  setGuildConfig(guildId, { language });

  const langLabel =
    language === "fr" ? "🇫🇷 Français" : language === "es" ? "🇪🇸 Español" : "🇬🇧 English";

  const embed = new EmbedBuilder()
    .setColor(Colors.Green)
    .setTitle("✅ Configuration mise à jour")
    .addFields({ name: "🌐 Langue", value: langLabel, inline: true })
    .setDescription("Les paramètres ont été sauvegardés.");

  await interaction.update({ embeds: [embed], components: [] });
}
