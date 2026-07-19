import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
  PermissionFlagsBits,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
} from "discord.js";
import { setGuildConfig, getGuildConfig } from "../utils/store.js";
import { logger } from "../../lib/logger.js";

export const data = {
  name: "setup-statsvoc",
  description: "Crée des salons vocaux affichant les statistiques du serveur",
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

  const embed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle("📊 Salons de statistiques vocaux")
    .setDescription(
      "Je vais créer une catégorie **📊 Statistiques** avec des salons vocaux qui affichent en temps réel :\n\n" +
        "👥 Nombre de membres\n🤖 Nombre de bots\n🚀 Niveau de boost\n\n" +
        "Ces salons se mettent à jour automatiquement. Veux-tu continuer ?",
    );

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("statsvoc_confirm")
      .setLabel("Créer les salons stats")
      .setEmoji("📊")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("statsvoc_cancel")
      .setLabel("Annuler")
      .setStyle(ButtonStyle.Danger),
  );

  await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
}

export async function handleStatsVocConfirm(interaction: ButtonInteraction) {
  const guild = interaction.guild!;

  const loadingEmbed = new EmbedBuilder()
    .setColor(Colors.Yellow)
    .setTitle("⏳ Création des salons…");

  await interaction.update({ embeds: [loadingEmbed], components: [] });

  try {
    // Create stats category
    const category = await guild.channels.create({
      name: "📊 Statistiques",
      type: ChannelType.GuildCategory,
    });

    const memberCount = guild.memberCount;
    const botCount = guild.members.cache.filter((m) => m.user.bot).size;
    const boostCount = guild.premiumSubscriptionCount ?? 0;

    // Create stat voice channels
    const memberChannel = await guild.channels.create({
      name: `👥 Membres : ${memberCount}`,
      type: ChannelType.GuildVoice,
      parent: category.id,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: ["Connect"],
        },
      ],
    });

    const botChannel = await guild.channels.create({
      name: `🤖 Bots : ${botCount}`,
      type: ChannelType.GuildVoice,
      parent: category.id,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: ["Connect"],
        },
      ],
    });

    const boostChannel = await guild.channels.create({
      name: `🚀 Boosts : ${boostCount}`,
      type: ChannelType.GuildVoice,
      parent: category.id,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: ["Connect"],
        },
      ],
    });

    // Save channel IDs to config for auto-update
    setGuildConfig(guild.id, {
      statsChannelIds: {
        members: memberChannel.id,
        bots: botChannel.id,
        boosts: boostChannel.id,
      },
    });

    const doneEmbed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle("✅ Salons de statistiques créés !")
      .setDescription(
        `Les salons ont été créés dans la catégorie **📊 Statistiques** :\n\n` +
          `👥 <#${memberChannel.id}>\n🤖 <#${botChannel.id}>\n🚀 <#${boostChannel.id}>\n\n` +
          `Ils se mettent à jour automatiquement quand des membres rejoignent ou quittent le serveur.`,
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [doneEmbed] });
  } catch (err) {
    logger.error({ err }, "Error creating stats channels");
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Red)
          .setTitle("❌ Erreur")
          .setDescription("Impossible de créer les salons. Vérifie mes permissions."),
      ],
    });
  }
}

export async function handleStatsVocCancel(interaction: ButtonInteraction) {
  await interaction.update({
    embeds: [
      new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle("❌ Annulé")
        .setDescription("Création des salons de statistiques annulée."),
    ],
    components: [],
  });
}

export async function updateStatsChannels(guild: any) {
  const config = getGuildConfig(guild.id);
  if (!config.statsChannelIds) return;

  try {
    await guild.members.fetch();
    const memberCount = guild.memberCount;
    const botCount = guild.members.cache.filter((m: any) => m.user.bot).size;
    const boostCount = guild.premiumSubscriptionCount ?? 0;

    if (config.statsChannelIds.members) {
      const ch = guild.channels.cache.get(config.statsChannelIds.members);
      if (ch) await ch.setName(`👥 Membres : ${memberCount}`).catch(() => {});
    }
    if (config.statsChannelIds.bots) {
      const ch = guild.channels.cache.get(config.statsChannelIds.bots);
      if (ch) await ch.setName(`🤖 Bots : ${botCount}`).catch(() => {});
    }
    if (config.statsChannelIds.boosts) {
      const ch = guild.channels.cache.get(config.statsChannelIds.boosts);
      if (ch) await ch.setName(`🚀 Boosts : ${boostCount}`).catch(() => {});
    }
  } catch (err) {
    logger.warn({ err, guildId: guild.id }, "Failed to update stats channels");
  }
}
