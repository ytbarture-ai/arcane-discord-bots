import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

const user = (option, description = 'Le membre concerné.') => option
  .setName('membre')
  .setDescription(description)
  .setRequired(true);

const reason = (option) => option
  .setName('raison')
  .setDescription('La raison de cette action.')
  .setRequired(false);

export function buildCommandPayloads() {
  return [
    new SlashCommandBuilder().setName('avatar').setDescription('Affiche l’avatar d’un membre.')
      .addUserOption((option) => option.setName('membre').setDescription('Membre ciblé.').setRequired(false)),
    new SlashCommandBuilder().setName('ban').setDescription('Bannit un membre du serveur.')
      .addUserOption(user)
      .addIntegerOption((option) => option.setName('jours_messages').setDescription('Jours de messages à supprimer (0–7).').setMinValue(0).setMaxValue(7).setRequired(false))
      .addStringOption(reason),
    new SlashCommandBuilder().setName('boosters').setDescription('Affiche les boosters du serveur.'),
    new SlashCommandBuilder().setName('card').setDescription('Affiche ou personnalise une carte de niveau.')
      .addSubcommand((sub) => sub.setName('view').setDescription('Affiche une carte de niveau.')
        .addUserOption((option) => option.setName('membre').setDescription('Membre ciblé.').setRequired(false)))
      .addSubcommand((sub) => sub.setName('color').setDescription('Définit la couleur de votre carte.')
        .addStringOption((option) => option.setName('hex').setDescription('Exemple : #8b5cf6.').setRequired(true))),
    new SlashCommandBuilder().setName('case').setDescription('Gère les cas de modération.')
      .addSubcommand((sub) => sub.setName('view').setDescription('Consulte un cas.')
        .addIntegerOption((option) => option.setName('numero').setDescription('Numéro du cas.').setRequired(true).setMinValue(1)))
      .addSubcommand((sub) => sub.setName('view-user').setDescription('Consulte les cas d’un membre.')
        .addUserOption(user))
      .addSubcommand((sub) => sub.setName('modify').setDescription('Modifie la raison d’un cas.')
        .addIntegerOption((option) => option.setName('numero').setDescription('Numéro du cas.').setRequired(true).setMinValue(1))
        .addStringOption((option) => option.setName('raison').setDescription('Nouvelle raison.').setRequired(true)))
      .addSubcommand((sub) => sub.setName('remove').setDescription('Supprime un cas.')
        .addIntegerOption((option) => option.setName('numero').setDescription('Numéro du cas.').setRequired(true).setMinValue(1))),
    new SlashCommandBuilder().setName('clear').setDescription('Supprime plusieurs messages.')
      .addIntegerOption((option) => option.setName('nombre').setDescription('Entre 1 et 100 messages.').setRequired(true).setMinValue(1).setMaxValue(100)),
    new SlashCommandBuilder().setName('dashboard').setDescription('Affiche le tableau de bord du serveur.'),
    new SlashCommandBuilder().setName('help').setDescription('Affiche l’aide et les commandes disponibles.'),
    new SlashCommandBuilder().setName('invite').setDescription('Donne le lien d’invitation de ce bot.'),
    new SlashCommandBuilder().setName('kick').setDescription('Expulse un membre du serveur.')
      .addUserOption(user).addStringOption(reason),
    new SlashCommandBuilder().setName('lb').setDescription('Alias de /leaderboard.'),
    new SlashCommandBuilder().setName('leaderboard').setDescription('Affiche le classement XP du serveur.')
      .addIntegerOption((option) => option.setName('page').setDescription('Page à afficher.').setMinValue(1).setRequired(false)),
    new SlashCommandBuilder().setName('level').setDescription('Affiche le niveau et l’XP d’un membre.')
      .addUserOption((option) => option.setName('membre').setDescription('Membre ciblé.').setRequired(false)),
    new SlashCommandBuilder().setName('lock').setDescription('Verrouille le salon courant.')
      .addChannelOption((option) => option.setName('salon').setDescription('Salon à verrouiller.').setRequired(false)),
    new SlashCommandBuilder().setName('mute').setDescription('Met un membre à l’expiration.')
      .addUserOption(user)
      .addStringOption((option) => option.setName('duree').setDescription('Exemples : 10m, 2h, 3d, maximum 28j.').setRequired(true))
      .addStringOption(reason),
    new SlashCommandBuilder().setName('premium').setDescription('Informations sur Arcane Premium.'),
    new SlashCommandBuilder().setName('purge').setDescription('Alias de /clear.')
      .addIntegerOption((option) => option.setName('nombre').setDescription('Entre 1 et 100 messages.').setRequired(true).setMinValue(1).setMaxValue(100)),
    new SlashCommandBuilder().setName('rank').setDescription('Affiche le rang XP d’un membre.')
      .addUserOption((option) => option.setName('membre').setDescription('Membre ciblé.').setRequired(false)),
    new SlashCommandBuilder().setName('rewards').setDescription('Gère les récompenses de niveau.')
      .addSubcommand((sub) => sub.setName('list').setDescription('Liste les récompenses actives.'))
      .addSubcommand((sub) => sub.setName('add').setDescription('Ajoute une récompense de niveau.')
        .addIntegerOption((option) => option.setName('niveau').setDescription('Niveau requis.').setRequired(true).setMinValue(1))
        .addRoleOption((option) => option.setName('role').setDescription('Rôle à attribuer.').setRequired(true)))
      .addSubcommand((sub) => sub.setName('remove').setDescription('Retire une récompense de niveau.')
        .addIntegerOption((option) => option.setName('niveau').setDescription('Niveau à retirer.').setRequired(true).setMinValue(1))),
    new SlashCommandBuilder().setName('role-info').setDescription('Affiche les informations d’un rôle.')
      .addRoleOption((option) => option.setName('role').setDescription('Rôle ciblé.').setRequired(true)),
    new SlashCommandBuilder().setName('server-info').setDescription('Affiche les informations du serveur.'),
    new SlashCommandBuilder().setName('slowmode').setDescription('Règle le mode lent du salon.')
      .addIntegerOption((option) => option.setName('secondes').setDescription('Entre 0 et 21600 secondes.').setRequired(true).setMinValue(0).setMaxValue(21600))
      .addChannelOption((option) => option.setName('salon').setDescription('Salon à régler.').setRequired(false)),
    new SlashCommandBuilder().setName('stats').setDescription('Affiche les statistiques du bot sur ce serveur.'),
    new SlashCommandBuilder().setName('support').setDescription('Explique comment obtenir de l’aide.'),
    new SlashCommandBuilder().setName('unban').setDescription('Débannit un utilisateur par son identifiant.')
      .addStringOption((option) => option.setName('utilisateur_id').setDescription('Identifiant Discord de l’utilisateur.').setRequired(true))
      .addStringOption(reason),
    new SlashCommandBuilder().setName('unlock').setDescription('Déverrouille le salon courant.')
      .addChannelOption((option) => option.setName('salon').setDescription('Salon à déverrouiller.').setRequired(false)),
    new SlashCommandBuilder().setName('unmute').setDescription('Retire l’expiration d’un membre.')
      .addUserOption(user).addStringOption(reason),
    new SlashCommandBuilder().setName('userinfo').setDescription('Affiche les informations d’un membre.')
      .addUserOption((option) => option.setName('membre').setDescription('Membre ciblé.').setRequired(false)),
    new SlashCommandBuilder().setName('vote').setDescription('Affiche le lien pour voter pour Arcane sur top.gg.'),
    new SlashCommandBuilder().setName('xp').setDescription('Gère l’XP et les niveaux.')
      .addSubcommand((sub) => sub.setName('add').setDescription('Ajoute de l’XP à un membre.')
        .addUserOption(user).addIntegerOption((option) => option.setName('quantite').setDescription('XP à ajouter.').setRequired(true).setMinValue(1)))
      .addSubcommand((sub) => sub.setName('remove').setDescription('Retire de l’XP à un membre.')
        .addUserOption(user).addIntegerOption((option) => option.setName('quantite').setDescription('XP à retirer.').setRequired(true).setMinValue(1)))
      .addSubcommand((sub) => sub.setName('reset-member').setDescription('Réinitialise l’XP d’un membre.')
        .addUserOption(user))
      .addSubcommand((sub) => sub.setName('reset-server').setDescription('Réinitialise l’XP de tout le serveur.'))
      .addSubcommand((sub) => sub.setName('set-level').setDescription('Définit le niveau d’un membre.')
        .addUserOption(user).addIntegerOption((option) => option.setName('niveau').setDescription('Niveau visé.').setRequired(true).setMinValue(0).setMaxValue(10_000)))
      .addSubcommand((sub) => sub.setName('set-xp').setDescription('Définit l’XP totale d’un membre.')
        .addUserOption(user).addIntegerOption((option) => option.setName('quantite').setDescription('XP totale.').setRequired(true).setMinValue(0).setMaxValue(2_000_000_000))),
    new SlashCommandBuilder().setName('prefix').setDescription('Affiche ou règle le préfixe textuel.')
      .addSubcommand((sub) => sub.setName('view').setDescription('Affiche le préfixe actif.'))
      .addSubcommand((sub) => sub.setName('set').setDescription('Définit le préfixe textuel.')
        .addStringOption((option) => option.setName('valeur').setDescription('Un à trois caractères.').setRequired(true).setMinLength(1).setMaxLength(3)))
  ].map((command) => command.toJSON());
}

export const MOD_COMMANDS = new Set([
  'ban', 'case', 'clear', 'dashboard', 'kick', 'lock', 'mute', 'purge', 'rewards',
  'slowmode', 'unban', 'unlock', 'unmute', 'xp', 'prefix'
]);

export const MANAGE_GUILD_COMMANDS = new Set(['dashboard', 'rewards', 'xp', 'prefix']);

export const PERMISSION_MAP = {
  ban: PermissionFlagsBits.BanMembers,
  kick: PermissionFlagsBits.KickMembers,
  clear: PermissionFlagsBits.ManageMessages,
  purge: PermissionFlagsBits.ManageMessages,
  lock: PermissionFlagsBits.ManageChannels,
  unlock: PermissionFlagsBits.ManageChannels,
  slowmode: PermissionFlagsBits.ManageChannels,
  mute: PermissionFlagsBits.ModerateMembers,
  unmute: PermissionFlagsBits.ModerateMembers,
  unban: PermissionFlagsBits.BanMembers,
  case: PermissionFlagsBits.ModerateMembers,
  dashboard: PermissionFlagsBits.ManageGuild,
  rewards: PermissionFlagsBits.ManageGuild,
  xp: PermissionFlagsBits.ManageGuild,
  prefix: PermissionFlagsBits.ManageGuild
};
