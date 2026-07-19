import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
  PermissionFlagsBits,
  ChannelType,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { setGuildConfig, getGuildConfig } from "../utils/store.js";

export const data = {
  name: "setup-bienvenue",
  description: "Configure le message de bienvenue pour les nouveaux membres",
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

  const guild = interaction.guild!;
  const textChannels = guild.channels.cache
    .filter((c) => c.type === ChannelType.GuildText)
    .first(25);

  if (textChannels.length === 0) {
    await interaction.reply({
      content: "❌ Aucun salon texte trouvé sur ce serveur.",
      ephemeral: true,
    });
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle("👋 Configuration des messages de bienvenue")
    .setDescription("Choisis le salon où envoyer les messages de bienvenue :");

  const select = new StringSelectMenuBuilder()
    .setCustomId("bienvenue_channel")
    .setPlaceholder("Sélectionne un salon")
    .addOptions(
      textChannels.map((c) => ({
        label: `#${c.name}`,
        value: c.id,
      })),
    );

  await interaction.reply({
    embeds: [embed],
    components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select)],
    ephemeral: true,
  });
}

export async function handleBienvenueChannel(interaction: StringSelectMenuInteraction) {
  const channelId = interaction.values[0];

  const modal = new ModalBuilder()
    .setCustomId(`bienvenue_message:${channelId}`)
    .setTitle("Message de bienvenue");

  const messageInput = new TextInputBuilder()
    .setCustomId("welcome_message")
    .setLabel("Message de bienvenue")
    .setStyle(TextInputStyle.Paragraph)
    .setValue(
      "Bienvenue sur le serveur, {user} ! 🎉\n\nNous sommes ravis de t'accueillir. N'hésite pas à te présenter !",
    )
    .setPlaceholder("Utilise {user} pour mentionner le membre, {server} pour le nom du serveur")
    .setRequired(true)
    .setMaxLength(1000);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput),
  );

  await interaction.showModal(modal);
}

export async function handleBienvenueMessage(interaction: any) {
  const [, channelId] = interaction.customId.split(":");
  const message = interaction.fields.getTextInputValue("welcome_message");
  const guildId = interaction.guildId!;

  setGuildConfig(guildId, {
    welcomeChannelId: channelId,
    welcomeMessage: message,
  });

  const embed = new EmbedBuilder()
    .setColor(Colors.Green)
    .setTitle("✅ Message de bienvenue configuré !")
    .addFields(
      { name: "📢 Salon", value: `<#${channelId}>`, inline: true },
      { name: "📝 Message", value: message },
    )
    .setFooter({ text: "Utilise {user} et {server} dans ton message" })
    .setTimestamp();

  // Test the welcome message
  const testRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`bienvenue_test:${channelId}`)
      .setLabel("Tester le message")
      .setEmoji("🧪")
      .setStyle(ButtonStyle.Secondary),
  );

  await interaction.reply({ embeds: [embed], components: [testRow], ephemeral: true });
}

export async function handleBienvenueTest(interaction: ButtonInteraction) {
  const [, channelId] = interaction.customId.split(":");
  const guildId = interaction.guildId!;
  const config = getGuildConfig(guildId);

  if (!config.welcomeMessage) {
    await interaction.reply({ content: "❌ Aucun message configuré.", ephemeral: true });
    return;
  }

  const channel = interaction.guild?.channels.cache.get(channelId);
  if (!channel || channel.type !== ChannelType.GuildText) {
    await interaction.reply({ content: "❌ Salon introuvable.", ephemeral: true });
    return;
  }

  const testMessage = config.welcomeMessage
    .replace("{user}", `<@${interaction.user.id}>`)
    .replace("{server}", interaction.guild?.name ?? "");

  const embed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle("👋 Bienvenue !")
    .setDescription(testMessage)
    .setFooter({ text: "Ceci est un test — AiGuild" });

  await (channel as any).send({ embeds: [embed] });
  await interaction.reply({ content: "✅ Message de test envoyé !", ephemeral: true });
}
