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
    new SlashCommandBuilder().setName('avatar').setDescription("Affiche l\'avatar d\'un membre.")
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
        .addStringOption((option) => option.setName('hex').setDescription('Exemple : #8b5cf6.').setRequired(true)))
      .addSubcommand((sub) => sub.setName('background').setDescription('(Premium) Définit l\'arrière-plan de votre carte de rang.')
        .addStringOption((option) => option.setName('url').setDescription('URL directe de l\'image (jpg/png).').setRequired(false))),
    new SlashCommandBuilder().setName('case').setDescription('Gère les cas de modération.')
      .addSubcommand((sub) => sub.setName('view').setDescription('Consulte un cas.')
        .addIntegerOption((option) => option.setName('numero').setDescription('Numéro du cas.').setRequired(true).setMinValue(1)))
      .addSubcommand((sub) => sub.setName('view-user').setDescription("Consulte les cas d\'un membre.")
        .addUserOption(user))
      .addSubcommand((sub) => sub.setName('modify').setDescription("Modifie la raison d\'un cas.")
        .addIntegerOption((option) => option.setName('numero').setDescription('Numéro du cas.').setRequired(true).setMinValue(1))
        .addStringOption((option) => option.setName('raison').setDescription('Nouvelle raison.').setRequired(true)))
      .addSubcommand((sub) => sub.setName('remove').setDescription('Supprime un cas.')
        .addIntegerOption((option) => option.setName('numero').setDescription('Numéro du cas.').setRequired(true).setMinValue(1))),
    new SlashCommandBuilder().setName('clear').setDescription('Supprime plusieurs messages.')
      .addIntegerOption((option) => option.setName('nombre').setDescription('Entre 1 et 100 messages.').setRequired(true).setMinValue(1).setMaxValue(100)),
    new SlashCommandBuilder().setName('config').setDescription('(Premium) Configure les paramètres avancés du bot.')
      .addSubcommand((sub) => sub.setName('xp')
        .setDescription('(Premium) Configure les valeurs XP par message.')
        .addIntegerOption((o) => o.setName('min').setDescription('XP minimum par message (défaut 15).').setMinValue(1).setMaxValue(100).setRequired(false))
        .addIntegerOption((o) => o.setName('max').setDescription('XP maximum par message (défaut 25).').setMinValue(1).setMaxValue(200).setRequired(false)))
      .addSubcommand((sub) => sub.setName('voice-xp')
        .setDescription('(Premium) Active/configure le XP vocal.')
        .addBooleanOption((o) => o.setName('actif').setDescription('Activer le XP vocal ?').setRequired(true))
        .addIntegerOption((o) => o.setName('min').setDescription('XP minimum par minute (défaut 10).').setMinValue(1).setMaxValue(50).setRequired(false))
        .addIntegerOption((o) => o.setName('max').setDescription('XP maximum par minute (défaut 20).').setMinValue(1).setMaxValue(100).setRequired(false)))
      .addSubcommand((sub) => sub.setName('reaction-xp')
        .setDescription('(Premium) Active/configure le XP de réaction.')
        .addBooleanOption((o) => o.setName('actif').setDescription('Activer le XP de réaction ?').setRequired(true))
        .addIntegerOption((o) => o.setName('min').setDescription('XP minimum par réaction (défaut 5).').setMinValue(1).setMaxValue(50).setRequired(false))
        .addIntegerOption((o) => o.setName('max').setDescription('XP maximum par réaction (défaut 10).').setMinValue(1).setMaxValue(100).setRequired(false)))
      .addSubcommand((sub) => sub.setName('view')
        .setDescription('Affiche la configuration premium actuelle.')),
    new SlashCommandBuilder().setName('dashboard').setDescription('Affiche le tableau de bord du serveur.'),
    new SlashCommandBuilder().setName('help').setDescription("Affiche l\'aide et les commandes disponibles."),
    new SlashCommandBuilder().setName('invite').setDescription("Donne le lien d\'invitation de ce bot."),
    new SlashCommandBuilder().setName('kick').setDescription('Expulse un membre du serveur.')
      .addUserOption(user).addStringOption(reason),
    new SlashCommandBuilder().setName('lb').setDescription('Alias de /leaderboard.')
      .addIntegerOption((option) => option.setName('page').setDescription('Page à afficher.').setMinValue(1).setRequired(false))
      .addStringOption((option) => option.setName('type').setDescription('Type de classement.').setRequired(false)
        .addChoices({ name: 'Tous les temps', value: 'all' }, { name: 'Ce mois-ci (Premium)', value: 'monthly' })),
    new SlashCommandBuilder().setName('leaderboard').setDescription('Affiche le classement XP du serveur.')
      .addIntegerOption((option) => option.setName('page').setDescription('Page à afficher.').setMinValue(1).setRequired(false))
      .addStringOption((option) => option.setName('type').setDescription('Type de classement.').setRequired(false)
        .addChoices({ name: 'Tous les temps', value: 'all' }, { name: 'Ce mois-ci (Premium)', value: 'monthly' })),
    new SlashCommandBuilder().setName('level').setDescription("Affiche le niveau et l\'XP d\'un membre.")
      .addUserOption((option) => option.setName('membre').setDescription('Membre ciblé.').setRequired(false)),
    new SlashCommandBuilder().setName('lock').setDescription('Verrouille le salon courant.')
      .addChannelOption((option) => option.setName('salon').setDescription('Salon à verrouiller.').setRequired(false)),
    new SlashCommandBuilder().setName('mute').setDescription("Met un membre à l\'expiration.")
      .addUserOption(user)
      .addStringOption((option) => option.setName('duree').setDescription('Durée : 60s, 5m, 2h, 1d, 1w (max 28j).').setRequired(true))
      .addStringOption(reason),
    new SlashCommandBuilder().setName('premium').setDescription('Informations sur Arcane Premium.'),
    new SlashCommandBuilder().setName('rank').setDescription("Affiche le rang XP d\'un membre.")
      .addUserOption((option) => option.setName('membre').setDescription('Membre ciblé.').setRequired(false)),
    new SlashCommandBuilder().setName('rewards').setDescription('Gère les récompenses de niveau (rôles).')
      .addSubcommand((sub) => sub.setName('list').setDescription('Liste les récompenses.'))
      .addSubcommand((sub) => sub.setName('add').setDescription('Ajoute une récompense.')
        .addIntegerOption((option) => option.setName('niveau').setDescription('Niveau requis.').setRequired(true).setMinValue(1))
        .addRoleOption((option) => option.setName('role').setDescription('Rôle à attribuer.').setRequired(true)))
      .addSubcommand((sub) => sub.setName('remove').setDescription('Retire une récompense.')
        .addIntegerOption((option) => option.setName('niveau').setDescription('Niveau concerné.').setRequired(true).setMinValue(1))),
    new SlashCommandBuilder().setName('role-info').setDescription("Affiche les informations d\'un rôle.")
      .addRoleOption((option) => option.setName('role').setDescription('Rôle concerné.').setRequired(true)),
    new SlashCommandBuilder().setName('server-info').setDescription('Affiche les informations du serveur.'),
    new SlashCommandBuilder().setName('slowmode').setDescription('Modifie le mode lent du salon.')
      .addIntegerOption((option) => option.setName('secondes').setDescription('Entre 0 (désactiver) et 21600.').setRequired(true).setMinValue(0).setMaxValue(21600))
      .addChannelOption((option) => option.setName('salon').setDescription('Salon concerné.').setRequired(false)),
    new SlashCommandBuilder().setName('stats').setDescription('Affiche les statistiques du bot sur ce serveur.'),
    new SlashCommandBuilder().setName('support').setDescription("Explique comment obtenir de l\'aide."),
    new SlashCommandBuilder().setName('unban').setDescription('Lève le bannissement d\'un utilisateur.')
      .addStringOption((option) => option.setName('utilisateur_id').setDescription("Identifiant Discord de l\'utilisateur.").setRequired(true))
      .addStringOption(reason),
    new SlashCommandBuilder().setName('unlock').setDescription('Déverrouille le salon courant.')
      .addChannelOption((option) => option.setName('salon').setDescription('Salon à déverrouiller.').setRequired(false)),
    new SlashCommandBuilder().setName('unmute').setDescription("Retire l\'expiration d\'un membre.")
      .addUserOption(user).addStringOption(reason),
    new SlashCommandBuilder().setName('userinfo').setDescription("Affiche les informations d\'un membre.")
      .addUserOption((option) => option.setName('membre').setDescription('Membre ciblé.').setRequired(false)),
    new SlashCommandBuilder().setName('generate').setDescription('🤖 Génère automatiquement la structure de votre serveur Discord avec l\'IA.')
      .addStringOption((o) => o.setName('description').setDescription('Décrivez votre communauté (ex: serveur gaming FPS, école de code...).').setRequired(true).setMaxLength(300))
      .addStringOption((o) => o.setName('langue').setDescription('Langue des salons et rôles.').setRequired(false)
        .addChoices(
          { name: 'Français', value: 'fr' },
          { name: 'English', value: 'en' },
          { name: 'Español', value: 'es' },
          { name: 'Deutsch', value: 'de' },
          { name: 'Português', value: 'pt' },
          { name: 'Polski', value: 'pl' }
        ))
      .addStringOption((o) => o.setName('style').setDescription('Style du serveur.').setRequired(false)
        .addChoices(
          { name: '🎮 Gaming', value: 'gaming' },
          { name: '📚 Éducation', value: 'education' },
          { name: '💼 Business', value: 'business' },
          { name: '🎭 Roleplay', value: 'roleplay' },
          { name: '🎨 Créatif', value: 'creative' },
          { name: '🌍 Communauté', value: 'community' }
        )),
    new SlashCommandBuilder().setName('credits').setDescription('🪙 Affiche vos crédits de génération IA restants.'),
    new SlashCommandBuilder().setName('vote').setDescription('Voter pour le bot.'),
    new SlashCommandBuilder().setName('xp').setDescription("Gère l\'XP et les niveaux.")
      .addSubcommand((sub) => sub.setName('add').setDescription("Ajoute de l\'XP à un membre.").addUserOption(user)
        .addIntegerOption((option) => option.setName('quantite').setDescription('Quantité XP.').setRequired(true).setMinValue(1)))
      .addSubcommand((sub) => sub.setName('remove').setDescription("Retire de l\'XP à un membre.").addUserOption(user)
        .addIntegerOption((option) => option.setName('quantite').setDescription('Quantité XP.').setRequired(true).setMinValue(1)))
      .addSubcommand((sub) => sub.setName('reset-member').setDescription("Réinitialise l\'XP d\'un membre.").addUserOption(user))
      .addSubcommand((sub) => sub.setName('reset-server').setDescription("Réinitialise l\'XP de tout le serveur."))
      .addSubcommand((sub) => sub.setName('set-level').setDescription("Définit le niveau d\'un membre.").addUserOption(user)
        .addIntegerOption((option) => option.setName('niveau').setDescription('Niveau cible.').setRequired(true).setMinValue(0)))
      .addSubcommand((sub) => sub.setName('set-xp').setDescription("Définit l\'XP totale d\'un membre.").addUserOption(user)
        .addIntegerOption((option) => option.setName('quantite').setDescription('XP totale.').setRequired(true).setMinValue(0)))
  ];
}

export const PERMISSION_MAP = {
  ban: PermissionFlagsBits.BanMembers,
  kick: PermissionFlagsBits.KickMembers,
  mute: PermissionFlagsBits.ModerateMembers,
  unmute: PermissionFlagsBits.ModerateMembers,
  unban: PermissionFlagsBits.BanMembers,
  clear: PermissionFlagsBits.ManageMessages,
  lock: PermissionFlagsBits.ManageChannels,
  unlock: PermissionFlagsBits.ManageChannels,
  slowmode: PermissionFlagsBits.ManageChannels,
  rewards: PermissionFlagsBits.ManageGuild,
  xp: PermissionFlagsBits.ManageGuild,
  prefix: PermissionFlagsBits.ManageGuild,
  config: PermissionFlagsBits.ManageGuild,
  generate: PermissionFlagsBits.ManageGuild
};
