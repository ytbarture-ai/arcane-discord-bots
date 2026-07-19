import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export const MODERATION_PERMISSIONS = [
  PermissionFlagsBits.ModerateMembers,
  PermissionFlagsBits.KickMembers,
  PermissionFlagsBits.BanMembers,
  PermissionFlagsBits.ManageMessages,
  PermissionFlagsBits.ManageChannels,
  PermissionFlagsBits.ManageGuild
];

export function embed(bot, title, description, fields = []) {
  return new EmbedBuilder()
    .setColor(bot.color)
    .setTitle(title)
    .setDescription(description)
    .addFields(fields)
    .setTimestamp()
    .setFooter({ text: `${bot.displayName} • Modération & niveaux` });
}

export function errorEmbed(bot, message) {
  return embed(bot, 'Action impossible', `> ${message}`);
}

export function successEmbed(bot, title, message) {
  return embed(bot, title, `> ${message}`);
}

export function truncate(text, length = 950) {
  const value = String(text || '').trim();
  return value.length > length ? `${value.slice(0, length - 1)}…` : value || 'Aucune information.';
}

export function formatDuration(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [];
  if (days) parts.push(`${days}j`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds || !parts.length) parts.push(`${seconds}s`);
  return parts.join(' ');
}

export function parseDuration(input) {
  if (!input) return null;
  const match = String(input).trim().toLowerCase().match(/^(\d+)(s|m|h|d|w)$/);
  if (!match) return null;
  const amount = Number(match[1]);
  const factor = { s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000, w: 604_800_000 }[match[2]];
  const value = amount * factor;
  return value > 0 && value <= 2_419_200_000 ? value : null; // 28 jours maximum Discord
}

export function canModerate(member) {
  return MODERATION_PERMISSIONS.some((permission) => member.permissions.has(permission));
}

export function hasPermission(member, permission) {
  return member.permissions.has(permission) || member.permissions.has(PermissionFlagsBits.Administrator);
}

export function isManageable(actor, target, guild) {
  if (!target || target.id === guild.ownerId) return false;
  if (actor.id === guild.ownerId) return true;
  return actor.roles.highest.comparePositionTo(target.roles.highest) > 0;
}

export function isBotManageable(clientMember, target) {
  return Boolean(clientMember && target && target.manageable && clientMember.roles.highest.comparePositionTo(target.roles.highest) > 0);
}

export function progressBar(percent, width = 12) {
  const filled = Math.round((Math.max(0, Math.min(100, percent)) / 100) * width);
  return `${'█'.repeat(filled)}${'░'.repeat(width - filled)}`;
}

export function cleanReason(reason) {
  return truncate(reason || 'Aucune raison précisée.', 450);
}
