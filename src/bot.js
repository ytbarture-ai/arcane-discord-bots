import {
  ChannelType,
  Client,
  Events,
  GatewayIntentBits,
  PermissionFlagsBits
} from 'discord.js';
import { buildCommandPayloads, PERMISSION_MAP } from './commands.js';
import {
  COMMAND_COOLDOWN_MS,
  FREE_MAX_REWARDS,
  PREFIX,
  SUPPORT_EMAIL,
  TOP_GG_URL,
  VOICE_XP_MAX,
  VOICE_XP_MIN,
  XP_COOLDOWN_MS,
  XP_PER_MESSAGE_MAX,
  XP_PER_MESSAGE_MIN
} from './config.js';
import { levelFromTotalXp, totalXpForLevel, xpProgress } from './store.js';
import {
  cleanReason,
  embed,
  errorEmbed,
  formatDuration,
  hasPermission,
  isManageable,
  parseDuration,
  progressBar,
  successEmbed,
  truncate
} from './utils.js';

const INVITE_PERMISSIONS = (
  PermissionFlagsBits.ViewChannel
  | PermissionFlagsBits.SendMessages
  | PermissionFlagsBits.EmbedLinks
  | PermissionFlagsBits.AttachFiles
  | PermissionFlagsBits.ReadMessageHistory
  | PermissionFlagsBits.ManageMessages
  | PermissionFlagsBits.KickMembers
  | PermissionFlagsBits.BanMembers
  | PermissionFlagsBits.ModerateMembers
  | PermissionFlagsBits.ManageChannels
  | PermissionFlagsBits.ManageRoles
  | PermissionFlagsBits.ViewAuditLog
).toString();

class UserFacingError extends Error {}

function requireGuild(ctx) {
  if (!ctx.guild) throw new UserFacingError('Cette commande doit être utilisée dans un serveur Discord.');
  return ctx.guild;
}

function requirePermission(ctx, command) {
  const permission = PERMISSION_MAP[command];
  if (permission && (!ctx.member || !hasPermission(ctx.member, permission))) {
    throw new UserFacingError('Vous ne disposez pas de l\'autorisation nécessaire pour cette commande.');
  }
}

function userName(user) {
  if (!user) return 'Utilisateur inconnu';
  return user.globalName || user.username || user.id;
}

function asUserId(userOrId) {
  return typeof userOrId === 'string' ? userOrId : userOrId.id;
}

function formatDate(value) {
  const timestamp = Math.floor(new Date(value).getTime() / 1000);
  return Number.isFinite(timestamp) ? `<t:${timestamp}:F>` : 'Date inconnue';
}

function ensureTextChannel(channel) {
  if (!channel || !channel.isTextBased() || channel.type === ChannelType.DM) {
    throw new UserFacingError('Cette commande nécessite un salon textuel de serveur.');
  }
  return channel;
}

function memberMention(memberOrUser) {
  return memberOrUser ? `<@${memberOrUser.id}>` : 'Membre inconnu';
}

function displayAvatar(user, size = 1024) {
  return user.displayAvatarURL({ size, extension: 'png', forceStatic: false });
}

function makeContext({ bot, client, store, interaction = null, message = null, command = '' }) {
  const guild = interaction?.guild || message?.guild || null;
  const user = interaction?.user || message?.author || null;
  const member = interaction?.member || message?.member || null;
  const channel = interaction?.channel || message?.channel || null;

  return {
    bot,
    client,
    store,
    interaction,
    message,
    command,
    guild,
    user,
    member,
    channel,
    async reply(payload) {
      if (interaction) {
        if (interaction.deferred || interaction.replied) return interaction.editReply(payload);
        return interaction.reply(payload);
      }
      return message.reply(payload);
    }
  };
}

async function resolveMember(guild, user) {
  if (!guild || !user) return null;
  try {
    return await guild.members.fetch(asUserId(user));
  } catch {
    return null;
  }
}

async function resolvePrefixMember(ctx, token) {
  const mention = ctx.message?.mentions.members.first();
  if (mention) return mention;
  const id = String(token || '').replace(/[<@!>]/g, '');
  return /^\d{15,22}$/.test(id) ? resolveMember(ctx.guild, id) : null;
}

function serialiseOverwrite(overwrite) {
  const restored = {};
  if (!overwrite) return restored;
  for (const [name, flag] of Object.entries(PermissionFlagsBits)) {
    if (overwrite.allow.has(flag)) restored[name] = true;
    if (overwrite.deny.has(flag)) restored[name] = false;
  }
  return restored;
}

async function recordCase(ctx, action, target, reason) {
  const guild = requireGuild(ctx);
  const targetId = asUserId(target);
  const record = await ctx.store.mutate(ctx.bot.key, guild.id, (state) => {
    const entry = {
      number: state.nextCaseNumber,
      action,
      targetId,
      targetName: typeof target === 'string' ? target : userName(target.user || target),
      moderatorId: ctx.user.id,
      moderatorName: userName(ctx.user),
      reason: cleanReason(reason),
      createdAt: new Date().toISOString()
    };
    state.nextCaseNumber += 1;
    state.cases.push(entry);
    state.stats.moderations += 1;
    return entry;
  });
  return record;
}

function findCase(state, number) {
  return state.cases.find((entry) => entry.number === number) || null;
}

function levelInfo(profile) {
  const level = levelFromTotalXp(profile.xp);
  const progress = xpProgress(profile.xp, level);
  return { level, progress };
}

async function grantRewardRoles(ctx, member, level) {
  if (!member || !ctx.guild) return [];
  const state = ctx.store.getGuild(ctx.bot.key, ctx.guild.id);
  const rewards = Object.entries(state.rewards || {})
    .filter(([requiredLevel]) => Number(requiredLevel) <= level)
    .map(([, roleId]) => roleId);
  const added = [];
  for (const roleId of rewards) {
    const role = ctx.guild.roles.cache.get(roleId);
    if (role && role.editable && !member.roles.cache.has(role.id)) {
      try {
        await member.roles.add(role, `Récompense de niveau ${level}`);
        added.push(role);
      } catch (error) {
        console.warn(`[${ctx.bot.displayName}] impossible d'attribuer le rôle ${roleId}: ${error.message}`);
      }
    }
  }
  return added;
}

async function setMemberXp(ctx, member, nextXp) {
  const guild = requireGuild(ctx);
  const safeXp = Math.max(0, Math.floor(nextXp));
  const result = await ctx.store.mutate(ctx.bot.key, guild.id, (state) => {
    const profile = state.members[member.id] || {
      xp: 0, level: 0, messages: 0, lastXpAt: 0, updatedAt: new Date().toISOString()
    };
    const previousLevel = levelFromTotalXp(profile.xp);
    profile.xp = safeXp;
    profile.level = levelFromTotalXp(safeXp);
    profile.updatedAt = new Date().toISOString();
    state.members[member.id] = profile;
    return { profile, previousLevel, level: profile.level };
  });
  if (result.level > result.previousLevel) await grantRewardRoles(ctx, member, result.level);
  return result;
}

async function sendLevelUp(ctx, member, oldLevel, newLevel) {
  if (newLevel <= oldLevel || !ctx.channel?.isTextBased()) return;
  const roles = await grantRewardRoles(ctx, member, newLevel);
  const rewardText = roles.length ? ` Récompense obtenue : ${roles.map((role) => role.toString()).join(', ')}.` : '';
  await ctx.channel.send({
    embeds: [successEmbed(ctx.bot, 'Niveau supérieur', `${memberMention(member)}, vous passez au **niveau ${newLevel}**.${rewardText}`)]
  });
}

async function awardMessageXp(ctx) {
  const guild = ctx.guild;
  const member = ctx.member;
  if (!guild || !member || ctx.user.bot) return;
  const state = ctx.store.getGuild(ctx.bot.key, guild.id);
  if (!state.levelingEnabled) return;
  const profile = state.members[member.id] || {
    xp: 0, level: 0, messages: 0, lastXpAt: 0, updatedAt: new Date().toISOString()
  };
  const now = Date.now();
  if (now - Number(profile.lastXpAt || 0) < XP_COOLDOWN_MS) return;

  const xpMin = state.xpMin ?? XP_PER_MESSAGE_MIN;
  const xpMax = state.xpMax ?? XP_PER_MESSAGE_MAX;
  const amount = Math.floor(Math.random() * (xpMax - xpMin + 1)) + xpMin;
  const result = await ctx.store.mutate(ctx.bot.key, guild.id, (current) => {
    const target = current.members[member.id] || {
      xp: 0, level: 0, messages: 0, lastXpAt: 0, updatedAt: new Date().toISOString()
    };
    const previousLevel = levelFromTotalXp(target.xp);
    const gained = amount * Number(current.xpMultiplier || 1);
    target.xp += gained;
    target.monthlyXp = (target.monthlyXp || 0) + gained;
    target.messages += 1;
    target.lastXpAt = now;
    target.level = levelFromTotalXp(target.xp);
    target.updatedAt = new Date().toISOString();
    current.members[member.id] = target;
    current.stats.messages += 1;
    return { previousLevel, level: target.level };
  });
  await sendLevelUp(ctx, member, result.previousLevel, result.level);
}

async function awardVoiceXp(bot, store, guild, member, minutes) {
  if (!guild || !member || member.user.bot) return;
  const state = store.getGuild(bot.key, guild.id);
  if (!state.levelingEnabled || !state.voiceXpEnabled) return;
  const xpMin = state.voiceXpMin ?? VOICE_XP_MIN;
  const xpMax = state.voiceXpMax ?? VOICE_XP_MAX;
  const amount = (Math.floor(Math.random() * (xpMax - xpMin + 1)) + xpMin) * minutes;
  const result = await store.mutate(bot.key, guild.id, (current) => {
    const target = current.members[member.id] || { xp: 0, level: 0, messages: 0, voiceMinutes: 0, lastXpAt: 0, monthlyXp: 0, updatedAt: new Date().toISOString() };
    const previousLevel = levelFromTotalXp(target.xp);
    target.xp += amount;
    target.monthlyXp = (target.monthlyXp || 0) + amount;
    target.voiceMinutes = (target.voiceMinutes || 0) + minutes;
    target.level = levelFromTotalXp(target.xp);
    target.updatedAt = new Date().toISOString();
    current.members[member.id] = target;
    return { previousLevel, level: target.level, amount };
  });
  // Level-up notification — we need a text channel; skip silently if none
  if (result.level > result.previousLevel) {
    const channel = guild.channels.cache.find((c) => c.isTextBased() && c.permissionsFor(guild.members.me)?.has('SendMessages'));
    if (channel) {
      const granted = await grantRewardRoles({ bot, store, guild, user: member.user, member, channel, client: null }, member, result.level);
      const reward = granted.length ? ` Récompense obtenue : ${granted.map((r) => r.toString()).join(', ')}.` : '';
      await channel.send({ embeds: [successEmbed(bot, 'Niveau supérieur', `${memberMention(member)}, vous passez au **niveau ${result.level}** grâce au XP vocal.${reward}`)] }).catch(() => {});
    }
  }
}

async function awardReactionXp(bot, store, guild, member) {
  if (!guild || !member || member.user.bot) return;
  const state = store.getGuild(bot.key, guild.id);
  if (!state.levelingEnabled || !state.reactionXpEnabled) return;
  const xpMin = state.reactionXpMin ?? 5;
  const xpMax = state.reactionXpMax ?? 10;
  const amount = Math.floor(Math.random() * (xpMax - xpMin + 1)) + xpMin;
  await store.mutate(bot.key, guild.id, (current) => {
    const target = current.members[member.id] || { xp: 0, level: 0, messages: 0, voiceMinutes: 0, lastXpAt: 0, monthlyXp: 0, updatedAt: new Date().toISOString() };
    target.xp += amount;
    target.monthlyXp = (target.monthlyXp || 0) + amount;
    target.level = levelFromTotalXp(target.xp);
    target.updatedAt = new Date().toISOString();
    current.members[member.id] = target;
  });
}

async function commandAvatar(ctx, targetUser = ctx.user) {
  await ctx.reply({
    embeds: [embed(ctx.bot, `Avatar de ${userName(targetUser)}`, null)
      .setImage(displayAvatar(targetUser))
      .setURL(displayAvatar(targetUser))]
  });
}

async function commandHelp(ctx) {
  const description = `Utilisez les commandes **/** ou le préfixe **${PREFIX}**. Les commandes de modération exigent les permissions Discord correspondantes.`;
  await ctx.reply({
    embeds: [embed(ctx.bot, 'Centre d\'aide', description, [
      { name: 'Modération', value: '`/ban`, `/kick`, `/mute`, `/unmute`, `/clear`, `/lock`, `/unlock`, `/slowmode`, `/case`', inline: false },
      { name: 'Niveaux & XP', value: '`/level`, `/rank`, `/leaderboard`, `/card`, `/rewards`, `/xp`', inline: false },
      { name: 'Informations', value: '`/avatar`, `/userinfo`, `/server-info`, `/role-info`, `/boosters`, `/stats`, `/invite`, `/vote`', inline: false },
      { name: 'Configuration', value: '`/dashboard`, `/prefix`, `/premium`, `/support`', inline: false }
    ])]
  });
}

async function commandInvite(ctx) {
  const appId = ctx.client.user.id;
  const url = `https://discord.com/oauth2/authorize?client_id=${appId}&permissions=${INVITE_PERMISSIONS}&scope=bot%20applications.commands`;
  await ctx.reply({
    embeds: [embed(ctx.bot, `Inviter ${ctx.bot.displayName}`, `[Cliquez ici pour inviter le bot](${url}).\n\nLe serveur choisira les permissions définitives lors de l'installation.`)]
  });
}

async function commandBan(ctx, target, reason, deleteDays = 0) {
  requireGuild(ctx);
  requirePermission(ctx, 'ban');
  if (!target || !target.bannable || !isManageable(ctx.member, target, ctx.guild)) {
    throw new UserFacingError('Je ne peux pas bannir ce membre. Vérifiez la hiérarchie des rôles et mes permissions.');
  }
  const clean = cleanReason(reason);
  await target.ban({ deleteMessageSeconds: Math.min(7, deleteDays) * 86_400, reason: `${clean} • par ${userName(ctx.user)}` });
  const entry = await recordCase(ctx, 'BAN', target, clean);
  await ctx.reply({ embeds: [successEmbed(ctx.bot, 'Membre banni', `${memberMention(target)} a été banni.\nCas **#${entry.number}** — ${clean}`)] });
}

async function commandKick(ctx, target, reason) {
  requireGuild(ctx);
  requirePermission(ctx, 'kick');
  if (!target || !target.kickable || !isManageable(ctx.member, target, ctx.guild)) {
    throw new UserFacingError('Je ne peux pas expulser ce membre. Vérifiez la hiérarchie des rôles et mes permissions.');
  }
  const clean = cleanReason(reason);
  await target.kick(`${clean} • par ${userName(ctx.user)}`);
  const entry = await recordCase(ctx, 'KICK', target, clean);
  await ctx.reply({ embeds: [successEmbed(ctx.bot, 'Membre expulsé', `${memberMention(target)} a été expulsé.\nCas **#${entry.number}** — ${clean}`)] });
}

async function commandMute(ctx, target, durationText, reason) {
  requireGuild(ctx);
  requirePermission(ctx, 'mute');
  const duration = parseDuration(durationText);
  if (!duration) throw new UserFacingError('Durée invalide. Utilisez par exemple `10m`, `2h`, `3d` ou `1w` (maximum 28 jours).');
  if (!target || !target.moderatable || !isManageable(ctx.member, target, ctx.guild)) {
    throw new UserFacingError('Je ne peux pas mettre ce membre à l\'expiration. Vérifiez la hiérarchie des rôles et mes permissions.');
  }
  const clean = cleanReason(reason);
  await target.timeout(duration, `${clean} • par ${userName(ctx.user)}`);
  const entry = await recordCase(ctx, 'MUTE', target, clean);
  await ctx.reply({ embeds: [successEmbed(ctx.bot, 'Membre mis à l\'expiration', `${memberMention(target)} est limité pendant **${formatDuration(duration)}**.\nCas **#${entry.number}** — ${clean}`)] });
}

async function commandUnmute(ctx, target, reason) {
  requireGuild(ctx);
  requirePermission(ctx, 'unmute');
  if (!target || !target.moderatable || !isManageable(ctx.member, target, ctx.guild)) {
    throw new UserFacingError('Je ne peux pas retirer l\'expiration de ce membre.');
  }
  const clean = cleanReason(reason);
  await target.timeout(null, `${clean} • par ${userName(ctx.user)}`);
  const entry = await recordCase(ctx, 'UNMUTE', target, clean);
  await ctx.reply({ embeds: [successEmbed(ctx.bot, 'Expiration retirée', `${memberMention(target)} peut de nouveau communiquer.\nCas **#${entry.number}** — ${clean}`)] });
}

async function commandUnban(ctx, userId, reason) {
  const guild = requireGuild(ctx);
  requirePermission(ctx, 'unban');
  if (!/^\d{15,22}$/.test(String(userId))) throw new UserFacingError('Veuillez fournir un identifiant Discord valide.');
  const clean = cleanReason(reason);
  await guild.members.unban(String(userId), `${clean} • par ${userName(ctx.user)}`);
  const entry = await recordCase(ctx, 'UNBAN', String(userId), clean);
  await ctx.reply({ embeds: [successEmbed(ctx.bot, 'Utilisateur débanni', `L'utilisateur \`${userId}\` a été débanni.\nCas **#${entry.number}** — ${clean}`)] });
}

async function commandClear(ctx, amount) {
  const channel = ensureTextChannel(ctx.channel);
  requirePermission(ctx, 'clear');
  if (typeof channel.bulkDelete !== 'function') throw new UserFacingError('Ce salon ne permet pas la suppression groupée de messages.');
  const deleted = await channel.bulkDelete(Number(amount), true);
  await ctx.reply({ embeds: [successEmbed(ctx.bot, 'Messages supprimés', `**${deleted.size}** message(s) ont été supprimés. Les messages de plus de 14 jours sont ignorés par Discord.`)] });
}

async function commandLock(ctx, channel = ctx.channel) {
  const guild = requireGuild(ctx);
  requirePermission(ctx, 'lock');
  const target = ensureTextChannel(channel);
  const everyone = guild.roles.everyone;
  const existing = target.permissionOverwrites.cache.get(everyone.id);
  await ctx.store.mutate(ctx.bot.key, guild.id, (state) => {
    state.channelLocks ||= {};
    if (!(target.id in state.channelLocks)) state.channelLocks[target.id] = existing ? serialiseOverwrite(existing) : null;
  });
  await target.permissionOverwrites.edit(everyone, { SendMessages: false }, `Salon verrouillé par ${userName(ctx.user)}`);
  await ctx.reply({ embeds: [successEmbed(ctx.bot, 'Salon verrouillé', `${target} est désormais verrouillé.`)] });
}

async function commandUnlock(ctx, channel = ctx.channel) {
  const guild = requireGuild(ctx);
  requirePermission(ctx, 'unlock');
  const target = ensureTextChannel(channel);
  const state = ctx.store.getGuild(ctx.bot.key, guild.id);
  const locks = state.channelLocks || {};
  if (!(target.id in locks)) throw new UserFacingError('Ce salon n\'a pas été verrouillé par ce bot, afin de préserver ses permissions existantes.');
  const backup = locks[target.id];
  const everyone = guild.roles.everyone;
  if (backup === null) {
    await target.permissionOverwrites.delete(everyone, `Salon déverrouillé par ${userName(ctx.user)}`);
  } else {
    await target.permissionOverwrites.edit(everyone, backup, `Salon déverrouillé par ${userName(ctx.user)}`);
  }
  await ctx.store.mutate(ctx.bot.key, guild.id, (current) => {
    delete current.channelLocks?.[target.id];
  });
  await ctx.reply({ embeds: [successEmbed(ctx.bot, 'Salon déverrouillé', `${target} a retrouvé ses permissions précédentes.`)] });
}

async function commandSlowmode(ctx, seconds, channel = ctx.channel) {
  requirePermission(ctx, 'slowmode');
  const target = ensureTextChannel(channel);
  if (typeof target.setRateLimitPerUser !== 'function') throw new UserFacingError('Le mode lent ne peut pas être réglé dans ce salon.');
  await target.setRateLimitPerUser(Number(seconds), `Mode lent réglé par ${userName(ctx.user)}`);
  const label = Number(seconds) === 0 ? 'désactivé' : `réglé à **${formatDuration(Number(seconds) * 1_000)}**`;
  await ctx.reply({ embeds: [successEmbed(ctx.bot, 'Mode lent mis à jour', `Le mode lent de ${target} est ${label}.`)] });
}

async function commandCase(ctx, action, values) {
  const guild = requireGuild(ctx);
  requirePermission(ctx, 'case');
  const state = ctx.store.getGuild(ctx.bot.key, guild.id);
  if (action === 'view') {
    const entry = findCase(state, Number(values.number));
    if (!entry) throw new UserFacingError('Aucun cas ne correspond à ce numéro.');
    await ctx.reply({ embeds: [embed(ctx.bot, `Cas #${entry.number}`, `**Action :** ${entry.action}\n**Membre :** <@${entry.targetId}>\n**Modérateur :** <@${entry.moderatorId}>\n**Raison :** ${truncate(entry.reason, 900)}\n**Créé :** ${formatDate(entry.createdAt)}`)] });
    return;
  }
  if (action === 'view-user') {
    const entries = state.cases.filter((entry) => entry.targetId === values.user.id).slice(-15).reverse();
    if (!entries.length) throw new UserFacingError('Ce membre ne possède aucun cas enregistré.');
    const description = entries.map((entry) => `**#${entry.number}** • ${entry.action} • ${formatDate(entry.createdAt)}\n${truncate(entry.reason, 150)}`).join('\n\n');
    await ctx.reply({ embeds: [embed(ctx.bot, `Cas de ${userName(values.user)}`, description)] });
    return;
  }
  if (action === 'modify') {
    const entry = findCase(state, Number(values.number));
    if (!entry) throw new UserFacingError('Aucun cas ne correspond à ce numéro.');
    const clean = cleanReason(values.reason);
    await ctx.store.mutate(ctx.bot.key, guild.id, (current) => {
      const target = findCase(current, Number(values.number));
      target.reason = clean;
      target.modifiedAt = new Date().toISOString();
      target.modifiedBy = ctx.user.id;
    });
    await ctx.reply({ embeds: [successEmbed(ctx.bot, 'Cas modifié', `Le cas **#${values.number}** a été mis à jour.`)] });
    return;
  }
  if (action === 'remove') {
    const number = Number(values.number);
    if (!findCase(state, number)) throw new UserFacingError('Aucun cas ne correspond à ce numéro.');
    await ctx.store.mutate(ctx.bot.key, guild.id, (current) => {
      current.cases = current.cases.filter((entry) => entry.number !== number);
    });
    await ctx.reply({ embeds: [successEmbed(ctx.bot, 'Cas supprimé', `Le cas **#${number}** a été supprimé.`)] });
  }
}

async function commandLevel(ctx, targetUser = ctx.user, card = false) {
  const guild = requireGuild(ctx);
  const member = await resolveMember(guild, targetUser);
  const state = ctx.store.getGuild(ctx.bot.key, guild.id);
  const profile = state.members[targetUser.id] || { xp: 0, messages: 0, cardColor: null };
  const { level, progress } = levelInfo(profile);
  const ranking = Object.entries(state.members)
    .sort(([, a], [, b]) => b.xp - a.xp)
    .findIndex(([id]) => id === targetUser.id) + 1;
  const cardEmbed = embed(ctx.bot, card ? `Carte de ${userName(targetUser)}` : `Niveau de ${userName(targetUser)}`, null, [
    { name: 'Niveau', value: `**${level}**`, inline: true },
    { name: 'XP totale', value: `**${Math.floor(profile.xp)}**`, inline: true },
    { name: 'Rang', value: `**#${ranking || '—'}**`, inline: true },
    { name: 'Progression', value: `${progressBar(progress.percentage)} **${progress.current}/${progress.required} XP**`, inline: false },
    { name: 'Messages comptabilisés', value: `${profile.messages || 0}`, inline: true }
  ]).setThumbnail(displayAvatar(targetUser));
  if (profile.cardColor && /^#[0-9a-f]{6}$/i.test(profile.cardColor)) cardEmbed.setColor(profile.cardColor);
  if (member?.displayName) cardEmbed.setDescription(`Profil de ${memberMention(member)}.`);
  await ctx.reply({ embeds: [cardEmbed] });
}

async function commandLeaderboard(ctx, page = 1, type = 'all') {
  const guild = requireGuild(ctx);
  const isMonthly = type === 'monthly';
  if (isMonthly && !ctx.bot.isPremium) throw new UserFacingError('Le classement mensuel est réservé à Arcane Premium.');
  if (isMonthly) ctx.store.checkMonthlyReset(ctx.bot.key, guild.id);
  const state = ctx.store.getGuild(ctx.bot.key, guild.id);
  const rows = Object.entries(state.members)
    .map(([id, p]) => [id, p])
    .sort(([, a], [, b]) => (isMonthly ? (b.monthlyXp || 0) - (a.monthlyXp || 0) : b.xp - a.xp))
    .filter(([, p]) => isMonthly ? (p.monthlyXp || 0) > 0 : p.xp > 0);
  if (!rows.length) throw new UserFacingError('Aucune donnée XP n\'est encore disponible sur ce serveur.');
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(Math.max(1, Number(page)), pageCount);
  const entries = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const xpLabel = isMonthly ? 'XP ce mois' : 'XP';
  const description = entries.map(([id, profile], index) => {
    const position = (currentPage - 1) * pageSize + index + 1;
    const xp = isMonthly ? Math.floor(profile.monthlyXp || 0) : Math.floor(profile.xp);
    return `**${position}.** <@${id}> — niveau **${levelFromTotalXp(profile.xp)}** • **${xp} ${xpLabel}**`;
  }).join('\n');
  const title = isMonthly ? 'Classement XP — Ce mois-ci' : 'Classement XP';
  await ctx.reply({ embeds: [embed(ctx.bot, title, description, [{ name: 'Page', value: `${currentPage}/${pageCount}`, inline: true }])] });
}

async function commandRank(ctx, targetUser = ctx.user) {
  const guild = requireGuild(ctx);
  const state = ctx.store.getGuild(ctx.bot.key, guild.id);
  const rows = Object.entries(state.members).sort(([, a], [, b]) => b.xp - a.xp);
  const index = rows.findIndex(([id]) => id === targetUser.id);
  if (index < 0) throw new UserFacingError('Ce membre n\'a pas encore gagné d\'XP.');
  const profile = rows[index][1];
  await ctx.reply({ embeds: [embed(ctx.bot, `Rang de ${userName(targetUser)}`, `**#${index + 1}** sur ${rows.length} membre(s) classé(s).\nNiveau **${levelFromTotalXp(profile.xp)}** • **${Math.floor(profile.xp)} XP**`)] });
}

async function commandCardColor(ctx, value) {
  const guild = requireGuild(ctx);
  if (!/^#[0-9a-f]{6}$/i.test(value)) throw new UserFacingError('Utilisez une couleur hexadécimale : par exemple `#8b5cf6`.');
  await ctx.store.mutate(ctx.bot.key, guild.id, (state) => {
    const profile = state.members[ctx.user.id] || { xp: 0, level: 0, messages: 0, lastXpAt: 0 };
    profile.cardColor = value.toUpperCase();
    state.members[ctx.user.id] = profile;
  });
  await ctx.reply({ embeds: [successEmbed(ctx.bot, 'Carte personnalisée', `Votre couleur de carte est désormais **${value.toUpperCase()}**.`)] });
}

async function commandRewards(ctx, action, values) {
  const guild = requireGuild(ctx);
  requirePermission(ctx, 'rewards');
  const state = ctx.store.getGuild(ctx.bot.key, guild.id);
  if (action === 'list') {
    const entries = Object.entries(state.rewards || {}).sort(([a], [b]) => Number(a) - Number(b));
    if (!entries.length) throw new UserFacingError('Aucune récompense de niveau n\'est configurée.');
    await ctx.reply({ embeds: [embed(ctx.bot, 'Récompenses de niveau', entries.map(([level, roleId]) => `Niveau **${level}** → <@&${roleId}>`).join('\n'))] });
    return;
  }
  if (action === 'add') {
    const role = values.role;
    if (!role.editable) throw new UserFacingError('Je ne peux pas attribuer ce rôle. Placez mon rôle au-dessus de celui-ci.');
    const maxRewards = ctx.bot.isPremium ? Infinity : FREE_MAX_REWARDS;
    const currentCount = Object.keys(state.rewards || {}).length;
    if (currentCount >= maxRewards) throw new UserFacingError(`Limite atteinte (${FREE_MAX_REWARDS} récompenses max). Passez à Arcane Premium pour des récompenses illimitées.`);
    await ctx.store.mutate(ctx.bot.key, guild.id, (current) => {
      current.rewards ||= {};
      current.rewards[String(values.level)] = role.id;
    });
    await ctx.reply({ embeds: [successEmbed(ctx.bot, 'Récompense ajoutée', `Au niveau **${values.level}**, les membres recevront ${role}.`)] });
    return;
  }
  if (action === 'remove') {
    if (!state.rewards?.[String(values.level)]) throw new UserFacingError('Aucune récompense n\'est configurée à ce niveau.');
    await ctx.store.mutate(ctx.bot.key, guild.id, (current) => {
      delete current.rewards[String(values.level)];
    });
    await ctx.reply({ embeds: [successEmbed(ctx.bot, 'Récompense retirée', `La récompense du niveau **${values.level}** a été retirée.`)] });
  }
}

async function commandXp(ctx, action, values) {
  const guild = requireGuild(ctx);
  requirePermission(ctx, 'xp');
  if (action === 'reset-server') {
    await ctx.store.mutate(ctx.bot.key, guild.id, (state) => {
      state.members = {};
    });
    await ctx.reply({ embeds: [successEmbed(ctx.bot, 'XP réinitialisée', 'Les données XP de ce serveur ont été réinitialisées.')] });
    return;
  }
  const target = await resolveMember(guild, values.user);
  if (!target) throw new UserFacingError('Ce membre n\'est plus présent sur le serveur.');
  const state = ctx.store.getGuild(ctx.bot.key, guild.id);
  const currentXp = state.members[target.id]?.xp || 0;
  let nextXp = currentXp;
  let label = '';
  if (action === 'add') {
    nextXp = currentXp + Number(values.amount);
    label = `**${values.amount} XP** ont été ajoutés à ${memberMention(target)}.`;
  } else if (action === 'remove') {
    nextXp = Math.max(0, currentXp - Number(values.amount));
    label = `**${values.amount} XP** ont été retirés à ${memberMention(target)}.`;
  } else if (action === 'reset-member') {
    nextXp = 0;
    label = `L'XP de ${memberMention(target)} a été réinitialisée.`;
  } else if (action === 'set-level') {
    nextXp = totalXpForLevel(Number(values.level));
    label = `${memberMention(target)} est désormais au **niveau ${values.level}**.`;
  } else if (action === 'set-xp') {
    nextXp = Number(values.amount);
    label = `${memberMention(target)} possède désormais **${values.amount} XP**.`;
  }
  await setMemberXp(ctx, target, nextXp);
  await ctx.reply({ embeds: [successEmbed(ctx.bot, 'XP mise à jour', label)] });
}

async function commandPrefix(ctx, action, value) {
  const guild = requireGuild(ctx);
  if (action === 'view') {
    const state = ctx.store.getGuild(ctx.bot.key, guild.id);
    await ctx.reply({ embeds: [embed(ctx.bot, 'Préfixe actuel', `Le préfixe textuel est **${state.prefix || PREFIX}**. Les commandes slash restent toujours disponibles.`)] });
    return;
  }
  requirePermission(ctx, 'prefix');
  if (!value || value.length > 3 || /\s/.test(value)) throw new UserFacingError('Le préfixe doit contenir de 1 à 3 caractères sans espace.');
  await ctx.store.mutate(ctx.bot.key, guild.id, (state) => {
    state.prefix = value;
  });
  await ctx.reply({ embeds: [successEmbed(ctx.bot, 'Préfixe modifié', `Le nouveau préfixe est **${value}**.`)] });
}

async function commandDashboard(ctx) {
  const guild = requireGuild(ctx);
  requirePermission(ctx, 'dashboard');
  const state = ctx.store.getGuild(ctx.bot.key, guild.id);
  await ctx.reply({ embeds: [embed(ctx.bot, 'Tableau de bord', `Configuration de **${guild.name}**`, [
    { name: 'Préfixe', value: `\`${state.prefix || PREFIX}\``, inline: true },
    { name: 'Niveaux', value: state.levelingEnabled ? 'Activés' : 'Désactivés', inline: true },
    { name: 'Multiplicateur XP', value: `x${state.xpMultiplier || 1}`, inline: true },
    { name: 'Membres classés', value: `${Object.keys(state.members).length}`, inline: true },
    { name: 'Cas enregistrés', value: `${state.cases.length}`, inline: true },
    { name: 'Récompenses', value: `${Object.keys(state.rewards || {}).length}`, inline: true }
  ])] });
}

async function commandBoosters(ctx) {
  const guild = requireGuild(ctx);
  const role = guild.roles.premiumSubscriberRole;
  const boosters = role ? [...role.members.values()] : [];
  const listed = boosters.slice(0, 30).map((member) => memberMention(member)).join(', ') || 'Aucun booster visible.';
  await ctx.reply({ embeds: [embed(ctx.bot, 'Boosters du serveur', `Boosts actifs : **${guild.premiumSubscriptionCount || 0}**\n\n${listed}`)] });
}

async function commandRoleInfo(ctx, role) {
  const guild = requireGuild(ctx);
  await ctx.reply({ embeds: [embed(ctx.bot, `Rôle : ${role.name}`, null, [
    { name: 'Identifiant', value: `\`${role.id}\``, inline: true },
    { name: 'Membres (cache)', value: `${role.members.size}`, inline: true },
    { name: 'Position', value: `${role.position}`, inline: true },
    { name: 'Mentionnable', value: role.mentionable ? 'Oui' : 'Non', inline: true },
    { name: 'Créé', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:F>`, inline: false }
  ]).setColor(role.color || ctx.bot.color)] });
}

async function commandServerInfo(ctx) {
  const guild = requireGuild(ctx);
  const owner = await guild.fetchOwner().catch(() => null);
  await ctx.reply({ embeds: [embed(ctx.bot, `Serveur : ${guild.name}`, null, [
    { name: 'Propriétaire', value: owner ? memberMention(owner) : `\`${guild.ownerId}\``, inline: true },
    { name: 'Membres', value: `${guild.memberCount}`, inline: true },
    { name: 'Salons', value: `${guild.channels.cache.size}`, inline: true },
    { name: 'Rôles', value: `${guild.roles.cache.size}`, inline: true },
    { name: 'Boosts', value: `${guild.premiumSubscriptionCount || 0}`, inline: true },
    { name: 'Créé', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true }
  ]).setThumbnail(guild.iconURL({ size: 512 }) || ctx.bot.avatarFallback)] });
}

async function commandUserInfo(ctx, targetUser = ctx.user) {
  const guild = requireGuild(ctx);
  const member = await resolveMember(guild, targetUser);
  const fields = [
    { name: 'Identifiant', value: `\`${targetUser.id}\``, inline: true },
    { name: 'Compte créé', value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:F>`, inline: true }
  ];
  if (member) {
    fields.push({ name: 'Arrivée sur le serveur', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: false });
    fields.push({ name: 'Rôles', value: `${Math.max(0, member.roles.cache.size - 1)}`, inline: true });
  }
  await ctx.reply({ embeds: [embed(ctx.bot, `Utilisateur : ${userName(targetUser)}`, member ? memberMention(member) : 'Utilisateur externe', fields).setThumbnail(displayAvatar(targetUser))] });
}

async function commandStats(ctx) {
  const guild = requireGuild(ctx);
  const state = ctx.store.getGuild(ctx.bot.key, guild.id);
  await ctx.reply({ embeds: [embed(ctx.bot, `Statistiques de ${ctx.bot.displayName}`, null, [
    { name: 'Messages XP', value: `${state.stats.messages || 0}`, inline: true },
    { name: 'Actions modération', value: `${state.stats.moderations || 0}`, inline: true },
    { name: 'Commandes consignées', value: `${state.stats.commands || 0}`, inline: true },
    { name: 'Membres classés', value: `${Object.keys(state.members).length}`, inline: true },
    { name: 'Cas enregistrés', value: `${state.cases.length}`, inline: true },
    { name: 'Données créées', value: formatDate(state.stats.createdAt), inline: true }
  ])] });
}

async function commandPremium(ctx) {
  const isPremium = ctx.bot.isPremium;
  const inviteUrl = ctx.client.user
    ? `https://discord.com/oauth2/authorize?client_id=${ctx.client.user.id}&permissions=8&scope=bot%20applications.commands`
    : 'https://discord.com/developers/applications';
  const check = (free, prem) => isPremium ? `✅ ${prem}` : `${free} → ✅ ${prem} (Premium)`;
  const fields = [
    {
      name: 'Nivellement',
      value: [
        check('XP messages : défaut', 'valeurs personnalisables'),
        check('Récompenses : 15', 'illimitées'),
        check('Récompenses/niveau : 1', '3'),
        check('Classement : hebdo', 'hebdo + mensuel')
      ].join('\n'),
      inline: false
    },
    {
      name: 'XP vocal & réactions',
      value: isPremium
        ? '✅ XP vocal activable via `/config voice-xp`\n✅ XP de réaction activable via `/config reaction-xp`'
        : '❌ XP vocal (Premium)\n❌ XP de réaction (Premium)',
      inline: false
    },
    {
      name: 'Carte de rang',
      value: isPremium ? '✅ Couleur + arrière-plan personnalisés (`/card background`)' : '✅ Couleur • ❌ Arrière-plan (Premium)',
      inline: false
    },
    {
      name: 'Configuration avancée',
      value: isPremium ? '✅ `/config xp`, `/config voice-xp`, `/config reaction-xp`' : '❌ Commande `/config` (Premium)',
      inline: false
    },
    {
      name: 'Statut',
      value: isPremium ? '🟢 **Arcane Premium est actif sur ce serveur.**' : `🔴 Non installé — [Inviter Arcane Premium](${inviteUrl})`,
      inline: false
    }
  ];
  await ctx.reply({ embeds: [embed(ctx.bot, '✨ Arcane Premium', 'Comparaison des fonctionnalités entre Arcane et Arcane Premium.', fields)] });
}

async function commandConfig(ctx, subcommand, values) {
  if (!ctx.bot.isPremium) throw new UserFacingError('La commande `/config` est réservée à Arcane Premium.');
  requirePermission(ctx, 'config');
  const guild = requireGuild(ctx);
  if (subcommand === 'view') {
    const state = ctx.store.getGuild(ctx.bot.key, guild.id);
    const fields = [
      { name: 'XP message', value: `Min: **${state.xpMin ?? 15}** — Max: **${state.xpMax ?? 25}**`, inline: true },
      { name: 'XP vocal', value: state.voiceXpEnabled ? `Min: **${state.voiceXpMin ?? 10}**/min — Max: **${state.voiceXpMax ?? 20}**/min` : '❌ Désactivé', inline: true },
      { name: 'XP réaction', value: state.reactionXpEnabled ? `Min: **${state.reactionXpMin ?? 5}** — Max: **${state.reactionXpMax ?? 10}**` : '❌ Désactivé', inline: true }
    ];
    await ctx.reply({ embeds: [embed(ctx.bot, 'Configuration Premium', null, fields)] });
    return;
  }
  if (subcommand === 'xp') {
    const min = values.min;
    const max = values.max;
    if (min !== null && max !== null && min > max) throw new UserFacingError('Le minimum doit être inférieur ou égal au maximum.');
    await ctx.store.mutate(ctx.bot.key, guild.id, (state) => {
      if (min !== null) state.xpMin = min;
      if (max !== null) state.xpMax = max;
    });
    await ctx.reply({ embeds: [successEmbed(ctx.bot, 'XP mis à jour', `XP par message : **${min ?? '(inchangé)'}** – **${max ?? '(inchangé)'}**.`)] });
    return;
  }
  if (subcommand === 'voice-xp') {
    await ctx.store.mutate(ctx.bot.key, guild.id, (state) => {
      state.voiceXpEnabled = values.actif;
      if (values.min !== null) state.voiceXpMin = values.min;
      if (values.max !== null) state.voiceXpMax = values.max;
    });
    await ctx.reply({ embeds: [successEmbed(ctx.bot, 'XP vocal', values.actif ? 'XP vocal **activé**. Les membres gagnent de l\'XP chaque minute en vocal.' : 'XP vocal **désactivé**.')] });
    return;
  }
  if (subcommand === 'reaction-xp') {
    await ctx.store.mutate(ctx.bot.key, guild.id, (state) => {
      state.reactionXpEnabled = values.actif;
      if (values.min !== null) state.reactionXpMin = values.min;
      if (values.max !== null) state.reactionXpMax = values.max;
    });
    await ctx.reply({ embeds: [successEmbed(ctx.bot, 'XP de réaction', values.actif ? 'XP de réaction **activé**. Les membres gagnent de l\'XP en ajoutant des réactions.' : 'XP de réaction **désactivé**.')] });
  }
}

async function commandSupport(ctx) {
  const body = SUPPORT_EMAIL
    ? `📧 **Contactez le support** : ${SUPPORT_EMAIL}\n\n💡 Consultez également \`/help\` et vérifiez que le bot a les bonnes permissions sur votre serveur.`
    : 'Aucune adresse e-mail de support n\'est encore configurée. Un administrateur peut renseigner la variable `SUPPORT_EMAIL` dans Railway.\n\n💡 En attendant, consultez `/help`.';
  await ctx.reply({ embeds: [embed(ctx.bot, '🛟 Support', body)] });
}

async function commandVote(ctx) {
  const url = `${TOP_GG_URL}bot/${ctx.client.user.id}/vote`;
  await ctx.reply({ embeds: [embed(ctx.bot, 'Voter pour Arcane', `[Cliquez ici pour voter sur top.gg](${url}).\n\nLe lien devient opérationnel dès que ce bot est publié et validé sur top.gg.`)] });
}

async function executeSlash(ctx) {
  const { interaction } = ctx;
  const command = interaction.commandName;
  if (ctx.guild) {
    await ctx.store.mutate(ctx.bot.key, ctx.guild.id, (state) => {
      state.stats.commands += 1;
    });
  }

  switch (command) {
    case 'avatar': return commandAvatar(ctx, interaction.options.getUser('membre') || ctx.user);
    case 'help': return commandHelp(ctx);
    case 'invite': return commandInvite(ctx);
    case 'premium': return commandPremium(ctx);
    case 'support': return commandSupport(ctx);
    case 'vote': return commandVote(ctx);
    case 'ban': return commandBan(ctx, await resolveMember(ctx.guild, interaction.options.getUser('membre')), interaction.options.getString('raison'), interaction.options.getInteger('jours_messages') || 0);
    case 'kick': return commandKick(ctx, await resolveMember(ctx.guild, interaction.options.getUser('membre')), interaction.options.getString('raison'));
    case 'mute': return commandMute(ctx, await resolveMember(ctx.guild, interaction.options.getUser('membre')), interaction.options.getString('duree'), interaction.options.getString('raison'));
    case 'unmute': return commandUnmute(ctx, await resolveMember(ctx.guild, interaction.options.getUser('membre')), interaction.options.getString('raison'));
    case 'unban': return commandUnban(ctx, interaction.options.getString('utilisateur_id'), interaction.options.getString('raison'));
    case 'clear':
    case 'purge': return commandClear(ctx, interaction.options.getInteger('nombre'));
    case 'lock': return commandLock(ctx, interaction.options.getChannel('salon') || ctx.channel);
    case 'unlock': return commandUnlock(ctx, interaction.options.getChannel('salon') || ctx.channel);
    case 'slowmode': return commandSlowmode(ctx, interaction.options.getInteger('secondes'), interaction.options.getChannel('salon') || ctx.channel);
    case 'boosters': return commandBoosters(ctx);
    case 'dashboard': return commandDashboard(ctx);
    case 'leaderboard': return commandLeaderboard(ctx, interaction.options.getInteger('page') || 1, interaction.options.getString('type') || 'all');
    case 'lb': return commandLeaderboard(ctx, 1);
    case 'level': return commandLevel(ctx, interaction.options.getUser('membre') || ctx.user);
    case 'rank': return commandRank(ctx, interaction.options.getUser('membre') || ctx.user);
    case 'server-info': return commandServerInfo(ctx);
    case 'role-info': return commandRoleInfo(ctx, interaction.options.getRole('role'));
    case 'userinfo': return commandUserInfo(ctx, interaction.options.getUser('membre') || ctx.user);
    case 'stats': return commandStats(ctx);
    case 'case': return commandCase(ctx, interaction.options.getSubcommand(), {
      number: interaction.options.getInteger('numero'),
      user: interaction.options.getUser('membre'),
      reason: interaction.options.getString('raison')
    });
    case 'card': {
      const action = interaction.options.getSubcommand();
      if (action === 'color') return commandCardColor(ctx, interaction.options.getString('hex'));
      if (action === 'background') {
        if (!ctx.bot.isPremium) throw new UserFacingError('L\'arrière-plan de carte est réservé à Arcane Premium.');
        const url = interaction.options.getString('url');
        const guild2 = requireGuild(ctx);
        await ctx.store.mutate(ctx.bot.key, guild2.id, (state) => {
          const profile = state.members[ctx.user.id] || { xp: 0, level: 0, messages: 0, lastXpAt: 0 };
          if (url) profile.cardBackground = url; else delete profile.cardBackground;
          state.members[ctx.user.id] = profile;
        });
        await ctx.reply({ embeds: [successEmbed(ctx.bot, 'Arrière-plan mis à jour', url ? `Votre arrière-plan de carte est désormais [cette image](${url}).` : 'Arrière-plan réinitialisé.')] });
        return;
      }
      return commandLevel(ctx, interaction.options.getUser('membre') || ctx.user, true);
    }
    case 'rewards': return commandRewards(ctx, interaction.options.getSubcommand(), {
      level: interaction.options.getInteger('niveau'),
      role: interaction.options.getRole('role')
    });
    case 'xp': return commandXp(ctx, interaction.options.getSubcommand(), {
      user: interaction.options.getUser('membre'),
      amount: interaction.options.getInteger('quantite'),
      level: interaction.options.getInteger('niveau')
    });
    case 'prefix': return commandPrefix(ctx, interaction.options.getSubcommand(), interaction.options.getString('valeur'));
    case 'config': return commandConfig(ctx, interaction.options.getSubcommand(), {
      min: interaction.options.getInteger('min'),
      max: interaction.options.getInteger('max'),
      actif: interaction.options.getBoolean('actif')
    });
    default: throw new UserFacingError('Cette commande n\'est pas encore disponible.');
  }
}

function extractReason(args, start) {
  return args.slice(start).join(' ') || undefined;
}

async function executePrefix(ctx, command, args) {
  const alias = {
    serverinfo: 'server-info',
    roleinfo: 'role-info',
    user: 'userinfo',
    lb: 'leaderboard'
  };
  const normalized = alias[command] || command;
  if (ctx.guild) {
    await ctx.store.mutate(ctx.bot.key, ctx.guild.id, (state) => {
      state.stats.commands += 1;
    });
  }

  if (['help', 'aide'].includes(normalized)) return commandHelp(ctx);
  if (normalized === 'avatar') return commandAvatar(ctx, ctx.message.mentions.users.first() || ctx.user);
  if (normalized === 'invite') return commandInvite(ctx);
  if (normalized === 'premium') return commandPremium(ctx);
  if (normalized === 'support') return commandSupport(ctx);
  if (normalized === 'vote') return commandVote(ctx);
  if (normalized === 'boosters') return commandBoosters(ctx);
  if (normalized === 'dashboard') return commandDashboard(ctx);
  if (normalized === 'stats') return commandStats(ctx);
  if (normalized === 'server-info') return commandServerInfo(ctx);
  if (normalized === 'role-info') {
    const role = ctx.message.mentions.roles.first();
    if (!role) throw new UserFacingError('Utilisez `!roleinfo @Rôle`.');
    return commandRoleInfo(ctx, role);
  }
  if (normalized === 'userinfo') return commandUserInfo(ctx, ctx.message.mentions.users.first() || ctx.user);
  if (normalized === 'level') return commandLevel(ctx, ctx.message.mentions.users.first() || ctx.user);
  if (normalized === 'card') {
    if (args[0] === 'color') return commandCardColor(ctx, args[1]);
    return commandLevel(ctx, ctx.message.mentions.users.first() || ctx.user, true);
  }
  if (normalized === 'rank') return commandRank(ctx, ctx.message.mentions.users.first() || ctx.user);
  if (normalized === 'leaderboard') return commandLeaderboard(ctx, Number(args[0]) || 1, args[1] === 'monthly' ? 'monthly' : 'all');
  if (normalized === 'clear' || normalized === 'purge') return commandClear(ctx, Number(args[0]));
  if (normalized === 'lock') return commandLock(ctx, ctx.message.mentions.channels.first() || ctx.channel);
  if (normalized === 'unlock') return commandUnlock(ctx, ctx.message.mentions.channels.first() || ctx.channel);
  if (normalized === 'slowmode') return commandSlowmode(ctx, Number(args[0]), ctx.message.mentions.channels.first() || ctx.channel);
  if (normalized === 'ban' || normalized === 'kick' || normalized === 'mute' || normalized === 'unmute') {
    const target = await resolvePrefixMember(ctx, args[0]);
    if (!target) throw new UserFacingError('Mentionnez un membre ou fournissez son identifiant.');
    if (normalized === 'ban') return commandBan(ctx, target, extractReason(args, 1), 0);
    if (normalized === 'kick') return commandKick(ctx, target, extractReason(args, 1));
    if (normalized === 'mute') return commandMute(ctx, target, args[1], extractReason(args, 2));
    return commandUnmute(ctx, target, extractReason(args, 1));
  }
  if (normalized === 'unban') return commandUnban(ctx, args[0], extractReason(args, 1));
  if (normalized === 'case') {
    const action = args[0];
    if (action === 'view') return commandCase(ctx, 'view', { number: args[1] });
    if (action === 'user') {
      const target = ctx.message.mentions.users.first();
      if (!target) throw new UserFacingError('Utilisez `!case user @membre`.');
      return commandCase(ctx, 'view-user', { user: target });
    }
    if (action === 'modify') return commandCase(ctx, 'modify', { number: args[1], reason: extractReason(args, 2) });
    if (action === 'remove') return commandCase(ctx, 'remove', { number: args[1] });
    throw new UserFacingError('Utilisation : `!case view <numéro>`, `!case user @membre`, `!case modify <numéro> <raison>` ou `!case remove <numéro>`.');
  }
  if (normalized === 'rewards') {
    if (args[0] === 'list') return commandRewards(ctx, 'list', {});
    if (args[0] === 'add') {
      const role = ctx.message.mentions.roles.first();
      if (!role) throw new UserFacingError('Utilisez `!rewards add <niveau> @rôle`.');
      return commandRewards(ctx, 'add', { level: Number(args[1]), role });
    }
    if (args[0] === 'remove') return commandRewards(ctx, 'remove', { level: Number(args[1]) });
    throw new UserFacingError('Utilisation : `!rewards list`, `!rewards add <niveau> @rôle` ou `!rewards remove <niveau>`.');
  }
  if (normalized === 'xp') {
    const action = args[0];
    if (action === 'reset' && args[1] === 'server') return commandXp(ctx, 'reset-server', {});
    const target = await resolvePrefixMember(ctx, args[action === 'reset' ? 2 : 1]);
    if (!target) throw new UserFacingError('Mentionnez le membre concerné.');
    if (action === 'add') return commandXp(ctx, 'add', { user: target.user, amount: Number(args[2]) });
    if (action === 'remove') return commandXp(ctx, 'remove', { user: target.user, amount: Number(args[2]) });
    if (action === 'reset' && args[1] === 'member') return commandXp(ctx, 'reset-member', { user: target.user });
    if (action === 'set' && args[1] === 'level') return commandXp(ctx, 'set-level', { user: target.user, level: Number(args[3]) });
    if (action === 'set' && args[1] === 'xp') return commandXp(ctx, 'set-xp', { user: target.user, amount: Number(args[3]) });
    throw new UserFacingError('Utilisation : `!xp add @membre <xp>`, `!xp remove @membre <xp>`, `!xp reset member @membre`, `!xp reset server`, `!xp set level @membre <niveau>` ou `!xp set xp @membre <xp>`.');
  }
  if (normalized === 'prefix') {
    return args[0] ? commandPrefix(ctx, 'set', args[0]) : commandPrefix(ctx, 'view');
  }
  throw new UserFacingError(`Commande inconnue. Utilisez \`${PREFIX}help\` ou \`/help\`.`);
}

function shouldThrottle(client, userId) {
  client.commandCooldowns ||= new Map();
  const previous = client.commandCooldowns.get(userId) || 0;
  const now = Date.now();
  if (now - previous < COMMAND_COOLDOWN_MS) return true;
  client.commandCooldowns.set(userId, now);
  return false;
}

export function createBot(bot, store) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildModeration,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent
    ]
  });

  client.once(Events.ClientReady, async (readyClient) => {
    console.log(`[${bot.displayName}] connecté en tant que ${readyClient.user.tag}.`);
    try {
      await readyClient.application.commands.set(buildCommandPayloads());
      console.log(`[${bot.displayName}] commandes slash synchronisées.`);
    } catch (error) {
      console.error(`[${bot.displayName}] synchronisation des commandes échouée :`, error.message);
    }
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (shouldThrottle(client, interaction.user.id)) {
      await interaction.reply({ content: 'Veuillez attendre quelques secondes avant de relancer une commande.', ephemeral: true }).catch(() => {});
      return;
    }
    const ctx = makeContext({ bot, client, store, interaction, command: interaction.commandName });
    try {
      await interaction.deferReply();
      await executeSlash(ctx);
    } catch (error) {
      const message = error instanceof UserFacingError ? error.message : 'Une erreur interne est survenue. Vérifiez les permissions du bot puis réessayez.';
      if (!(error instanceof UserFacingError)) console.error(`[${bot.displayName}] ${interaction.commandName}:`, error);
      await ctx.reply({ embeds: [errorEmbed(bot, message)] }).catch(() => {});
    }
  });

  // ── Voice XP (premium) ───────────────────────────────────────
  const voiceSessions = new Map(); // key: guildId:userId → { joinedAt }
  client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    if (!bot.isPremium) return;
    const member = newState.member || oldState.member;
    if (!member || member.user.bot) return;
    const guildId = newState.guild?.id || oldState.guild?.id;
    const key = `${guildId}:${member.id}`;
    const afkId = newState.guild?.afkChannelId || oldState.guild?.afkChannelId;
    const leftVoice = !newState.channelId || newState.channelId === afkId;
    const joinedVoice = newState.channelId && newState.channelId !== afkId;
    if (oldState.channelId && leftVoice) {
      const session = voiceSessions.get(key);
      if (session) {
        voiceSessions.delete(key);
        const minutes = Math.floor((Date.now() - session.joinedAt) / 60_000);
        if (minutes > 0) await awardVoiceXp(bot, store, newState.guild || oldState.guild, member, minutes).catch(() => {});
      }
    }
    if (joinedVoice) voiceSessions.set(key, { joinedAt: Date.now() });
  });

  // ── Reaction XP (premium) ─────────────────────────────────────
  client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (!bot.isPremium) return;
    if (user.bot) return;
    try {
      if (reaction.partial) await reaction.fetch();
      if (!reaction.message.guild) return;
      const member = await reaction.message.guild.members.fetch(user.id).catch(() => null);
      if (!member) return;
      await awardReactionXp(bot, store, reaction.message.guild, member);
    } catch { /* ignore */ }
  });

    client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot || !message.guild) return;
    const state = store.getGuild(bot.key, message.guild.id);
    const prefix = state.prefix || PREFIX;
    const ctx = makeContext({ bot, client, store, message });
    try {
      await awardMessageXp(ctx);
      if (!message.content.startsWith(prefix)) return;
      const raw = message.content.slice(prefix.length).trim();
      if (!raw) return;
      const [command, ...args] = raw.split(/\s+/);
      if (shouldThrottle(client, message.author.id)) return;
      await executePrefix(ctx, command.toLowerCase(), args);
    } catch (error) {
      const output = error instanceof UserFacingError ? error.message : 'Une erreur interne est survenue. Vérifiez les permissions du bot puis réessayez.';
      if (!(error instanceof UserFacingError)) console.error(`[${bot.displayName}] commande textuelle:`, error);
      await message.reply({ embeds: [errorEmbed(bot, output)] }).catch(() => {});
    }
  });

  client.on(Events.Error, (error) => console.error(`[${bot.displayName}] erreur Discord:`, error));
  return client;
}
