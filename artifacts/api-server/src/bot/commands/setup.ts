import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
  ButtonInteraction,
  Colors,
} from "discord.js";
import { getTemplate, detectServerType } from "../utils/templates.js";
import { logger } from "../../lib/logger.js";
import { storeDescription, getDescription } from "../utils/session.js";

export const data = {
  name: "setup",
  description: "Génère une structure complète pour ton serveur Discord",
  default_member_permissions: String(PermissionFlagsBits.Administrator),
};

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    await interaction.reply({
      content: "❌ Tu dois avoir la permission **Administrateur** pour utiliser cette commande.",
      flags: 64,
    });
    return;
  }

  const modal = new ModalBuilder()
    .setCustomId("setup_modal")
    .setTitle("AiGuild — Créer ton serveur");

  const descInput = new TextInputBuilder()
    .setCustomId("server_description")
    .setLabel("Décris ton serveur")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder("Ex: Un serveur gaming pour jouer à Fortnite avec mes amis, avec des tournois et des clips")
    .setRequired(true)
    .setMaxLength(500);

  const langInput = new TextInputBuilder()
    .setCustomId("server_language")
    .setLabel("Langue (fr / en / es)")
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("fr")
    .setRequired(true)
    .setMaxLength(2)
    .setMinLength(2);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(descInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(langInput),
  );

  await interaction.showModal(modal);
}

export async function handleSetupModal(interaction: any) {
  const description = interaction.fields.getTextInputValue("server_description");
  const rawLang = interaction.fields.getTextInputValue("server_language").toLowerCase().trim();
  const language = ["fr", "en", "es"].includes(rawLang) ? rawLang : "fr";
  const serverType = detectServerType(description);
  const sessionId = storeDescription(`${description}||${serverType}||${language}`);

  const langLabel = language === "fr" ? "🇫🇷 Français" : language === "en" ? "🇬🇧 English" : "🇪🇸 Español";
  const typeLabel: Record<string, string> = {
    gaming: "🎮 Gaming", community: "👥 Communauté", school: "📚 École",
    friends: "🤝 Amis", roleplay: "🎭 Roleplay", creative: "🎨 Créatif",
    business: "💼 Business", support: "🛠️ Support",
  };

  const embed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle("🤖 Analyse terminée")
    .setDescription(
      `J'ai analysé ta description et voici ce que je vais créer :\n\n` +
      `📝 **Description :** ${description}\n` +
      `🏷️ **Type détecté :** ${typeLabel[serverType] ?? serverType}\n` +
      `🌐 **Langue :** ${langLabel}\n\n` +
      `⚠️ Les canaux et rôles existants **ne seront pas supprimés**. La structure sera ajoutée.\n\n` +
      `Prêt à construire ton serveur ?`
    );

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`setup_confirm:${sessionId}`)
      .setLabel("Construire le serveur")
      .setEmoji("🚀")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("setup_cancel")
      .setLabel("Annuler")
      .setStyle(ButtonStyle.Danger),
  );

  await interaction.reply({ embeds: [embed], components: [row], flags: 64 });
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateProgress(interaction: ButtonInteraction, title: string, desc: string, color: number) {
  const embed = new EmbedBuilder().setColor(color).setTitle(title).setDescription(desc);
  await interaction.editReply({ embeds: [embed], components: [] });
}

export async function handleSetupConfirm(interaction: ButtonInteraction) {
  const [, sessionId] = interaction.customId.split(":");
  const raw = getDescription(sessionId) ?? "";
  const [description, serverType, language] = raw.split("||");

  await interaction.update({
    embeds: [new EmbedBuilder().setColor(Colors.Yellow).setTitle("🔍 Analyse de ta description…").setDescription("Préparation de la structure de ton serveur…")],
    components: [],
  });

  await sleep(1500);

  const structure = getTemplate(serverType ?? "community", language ?? "fr");
  const guild = interaction.guild!;

  await updateProgress(interaction,
    "🎭 Génération des rôles…",
    "Création des rôles et permissions…",
    Colors.Yellow
  );

  await sleep(800);

  // Créer les rôles
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

  await updateProgress(interaction,
    "📁 Création des catégories…",
    `✅ **${createdRoles.length} rôles créés**\n\nConstruction de l'architecture du serveur…`,
    Colors.Yellow
  );

  await sleep(800);

  // Créer les catégories et salons
  const createdCategories: string[] = [];
  let totalChannels = 0;

  for (const catData of structure.categories) {
    try {
      const category = await guild.channels.create({
        name: catData.name,
        type: ChannelType.GuildCategory,
      });
      createdCategories.push(catData.name);

      await updateProgress(interaction,
        "💬 Configuration des salons…",
        `✅ **${createdRoles.length} rôles créés**\n📁 **Catégorie :** ${catData.name}\n\nCréation des salons en cours…`,
        Colors.Yellow
      );

      for (const chanData of catData.channels) {
        try {
          const channelType =
            chanData.type === "voice" ? ChannelType.GuildVoice
            : chanData.type === "forum" ? ChannelType.GuildForum
            : ChannelType.GuildText;

          await guild.channels.create({
            name: chanData.name,
            type: channelType,
            parent: category.id,
            topic: chanData.topic,
            rateLimitPerUser: chanData.slowmode,
          });
          totalChannels++;
        } catch (err) {
          logger.warn({ err, channel: chanData.name }, "Failed to create channel");
        }
      }
    } catch (err) {
      logger.warn({ err, category: catData.name }, "Failed to create category");
    }
  }

  await updateProgress(interaction,
    "✨ Finalisation…",
    `✅ **${createdRoles.length} rôles créés**\n✅ **${createdCategories.length} catégories créées**\n✅ **${totalChannels} salons créés**\n\nOn y est presque…`,
    Colors.Green
  );

  await sleep(1000);

  const doneEmbed = new EmbedBuilder()
    .setColor(Colors.Green)
    .setTitle("🚀 Serveur construit avec succès !")
    .setDescription(
      `Voici ce qui a été créé sur **${guild.name}** :\n\n` +
      `🎭 **${createdRoles.length} rôles** créés\n` +
      `📁 **${createdCategories.length} catégories** créées\n` +
      `💬 **${totalChannels} salons** créés\n\n` +
      `Tu peux maintenant personnaliser les permissions selon tes besoins.`
    )
    .setFooter({ text: "AiGuild • Discord Server Builder" })
    .setTimestamp();

  await interaction.editReply({ embeds: [doneEmbed] });
}

export async function handleSetupCancel(interaction: ButtonInteraction) {
  await interaction.update({
    embeds: [new EmbedBuilder().setColor(Colors.Red).setTitle("❌ Annulé").setDescription("La création du serveur a été annulée.")],
    components: [],
  });
}
