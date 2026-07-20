import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
  ButtonInteraction,
  Colors,
} from "discord.js";
import { generateServerStructure } from "../utils/ai.js";
import { logger } from "../../lib/logger.js";
import { storeDescription, getDescription } from "../utils/session.js";

export const data = {
  name: "setup",
  description: "Génère une structure complète pour ton serveur Discord avec l'IA",
  default_member_permissions: String(PermissionFlagsBits.Administrator),
};

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    await interaction.reply({
      content: "❌ Tu dois avoir la permission **Administrateur** pour utiliser cette commande.",
      ephemeral: true,
    });
    return;
  }

  // Show modal for server description
  const modal = new ModalBuilder()
    .setCustomId("setup_modal")
    .setTitle("Configuration du serveur — AiGuild");

  const descriptionInput = new TextInputBuilder()
    .setCustomId("server_description")
    .setLabel("Décris ton serveur en quelques mots")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder("Ex: Un serveur gaming compétitif pour joueurs de FPS, avec des tournois et une communauté active")
    .setRequired(true)
    .setMaxLength(500);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput),
  );

  await interaction.showModal(modal);
}

export async function handleSetupModal(interaction: any) {
  const description = interaction.fields.getTextInputValue("server_description");
  const sessionId = storeDescription(description);

  const embed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle("Type de serveur")
    .setDescription("Quel est le type de ton serveur ?");

  const select = new StringSelectMenuBuilder()
    .setCustomId(`setup_type:${sessionId}`)
    .setPlaceholder("Choisis le type de serveur")
    .addOptions([
      { label: "Gaming", value: "gaming", emoji: "🎮" },
      { label: "Communauté", value: "community", emoji: "👥" },
      { label: "Éducation / École", value: "school", emoji: "📚" },
      { label: "Amis", value: "friends", emoji: "🤝" },
      { label: "Roleplay", value: "roleplay", emoji: "🎭" },
      { label: "Créatif / Art", value: "creative", emoji: "🎨" },
      { label: "Business / Pro", value: "business", emoji: "💼" },
      { label: "Support / Service", value: "support", emoji: "🛠️" },
    ]);

  await interaction.reply({
    embeds: [embed],
    components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select)],
    ephemeral: true,
  });
}

export async function handleSetupType(interaction: StringSelectMenuInteraction) {
  const [, sessionId] = interaction.customId.split(":");
  const serverType = interaction.values[0];

  const embed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle("Langue du serveur")
    .setDescription("Quelle langue pour les noms de canaux et catégories ?");

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`setup_lang:fr:${serverType}:${sessionId}`)
      .setLabel("Français")
      .setEmoji("🇫🇷")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`setup_lang:en:${serverType}:${sessionId}`)
      .setLabel("English")
      .setEmoji("🇬🇧")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(`setup_lang:es:${serverType}:${sessionId}`)
      .setLabel("Español")
      .setEmoji("🇪🇸")
      .setStyle(ButtonStyle.Secondary),
  );

  await interaction.update({ embeds: [embed], components: [row] });
}

export async function handleSetupLang(interaction: ButtonInteraction) {
  const [, language, serverType, sessionId] = interaction.customId.split(":");
  const description = getDescription(sessionId) ?? "(description expirée)";

  const embed = new EmbedBuilder()
    .setColor(Colors.Orange)
    .setTitle("⚠️ Attention — Génération du serveur")
    .setDescription(
      `L'IA va générer et **appliquer** une nouvelle structure à ce serveur.\n\n` +
        `📝 **Description :** ${description}\n` +
        `🎮 **Type :** ${serverType}\n` +
        `🌐 **Langue :** ${language === "fr" ? "Français" : language === "en" ? "English" : "Español"}\n\n` +
        `⚠️ Les catégories et salons existants **ne seront pas supprimés**. La nouvelle structure sera ajoutée.\n\nVeux-tu continuer ?`,
    );

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`setup_confirm:${language}:${serverType}:${sessionId}`)
      .setLabel("Générer le serveur")
      .setEmoji("✨")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("setup_cancel")
      .setLabel("Annuler")
      .setStyle(ButtonStyle.Danger),
  );

  await interaction.update({ embeds: [embed], components: [row] });
}

export async function handleSetupConfirm(interaction: ButtonInteraction) {
  const [, language, serverType, sessionId] = interaction.customId.split(":");
  const description = getDescription(sessionId) ?? "(description expirée)";

  const loadingEmbed = new EmbedBuilder()
    .setColor(Colors.Yellow)
    .setTitle("⏳ Génération en cours…")
    .setDescription("L'IA génère la structure de ton serveur. Cela peut prendre quelques secondes…");

  await interaction.update({ embeds: [loadingEmbed], components: [] });

  try {
    const structure = await generateServerStructure(description, serverType, language);
    const guild = interaction.guild!;

    const applyEmbed = new EmbedBuilder()
      .setColor(Colors.Yellow)
      .setTitle("🔨 Application de la structure…")
      .setDescription("Création des rôles, catégories et salons…");

    await interaction.editReply({ embeds: [applyEmbed] });

    // Create roles (from lowest to highest)
    const createdRoles: string[] = [];
    for (const roleData of [...structure.roles].reverse()) {
      try {
        const role = await guild.roles.create({
          name: roleData.name,
          color: (roleData.color as any) ?? undefined,
          hoist: roleData.hoist ?? false,
          mentionable: roleData.mentionable ?? false,
        });
        createdRoles.push(role.name);
      } catch (err) {
        logger.warn({ err, role: roleData.name }, "Failed to create role");
      }
    }

    // Create categories and channels
    const createdCategories: string[] = [];
    for (const catData of structure.categories) {
      try {
        const category = await guild.channels.create({
          name: catData.name,
          type: ChannelType.GuildCategory,
        });
        createdCategories.push(category.name);

        for (const chanData of catData.channels) {
          try {
            const channelType =
              chanData.type === "voice"
                ? ChannelType.GuildVoice
                : chanData.type === "announcement"
                  ? ChannelType.GuildAnnouncement
                  : chanData.type === "forum"
                    ? ChannelType.GuildForum
                    : ChannelType.GuildText;

            await guild.channels.create({
              name: chanData.name,
              type: channelType,
              parent: category.id,
              topic: chanData.topic,
              rateLimitPerUser: chanData.slowmode,
            });
          } catch (err) {
            logger.warn({ err, channel: chanData.name }, "Failed to create channel");
          }
        }
      } catch (err) {
        logger.warn({ err, category: catData.name }, "Failed to create category");
      }
    }

    const doneEmbed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle("✅ Serveur généré avec succès !")
      .setDescription(
        `Voici ce qui a été créé sur **${guild.name}** :\n\n` +
          `📁 **${createdCategories.length} catégories** : ${createdCategories.join(", ")}\n` +
          `🎭 **${createdRoles.length} rôles** : ${createdRoles.join(", ")}\n\n` +
          `Tu peux maintenant personnaliser les permissions et les salons selon tes besoins.`,
      )
      .setFooter({ text: "AiGuild • Powered by Claude AI" })
      .setTimestamp();

    await interaction.editReply({ embeds: [doneEmbed] });
  } catch (err) {
    logger.error({ err }, "Error generating server structure");
    const errorEmbed = new EmbedBuilder()
      .setColor(Colors.Red)
      .setTitle("❌ Erreur")
      .setDescription(
        "Une erreur s'est produite lors de la génération. Vérifie ta clé API OpenAI et réessaie.",
      );
    await interaction.editReply({ embeds: [errorEmbed] });
  }
}

export async function handleSetupCancel(interaction: ButtonInteraction) {
  const embed = new EmbedBuilder()
    .setColor(Colors.Red)
    .setTitle("❌ Annulé")
    .setDescription("La génération du serveur a été annulée.");

  await interaction.update({ embeds: [embed], components: [] });
}
