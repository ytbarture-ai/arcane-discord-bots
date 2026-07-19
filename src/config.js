import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const PREFIX = process.env.PREFIX || '!';
export const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH
  || process.env.DATA_DIR
  || path.join(projectRoot, 'data');
export const STORE_PATH = path.join(DATA_DIR, 'arcane-store.json');

export const BOTS = [
  {
    key: 'arcane',
    displayName: 'Arcane',
    token: process.env.ARCANE_TOKEN || '',
    color: 0x8b5cf6,
    avatarFallback: 'https://cdn.discordapp.com/embed/avatars/0.png',
    defaultPrefix: '!',
    isPremium: false
  },
  {
    key: 'arcane-chan',
    displayName: 'Arcane Chan',
    token: process.env.ARCANE_CHAN_TOKEN || '',
    color: 0xec4899,
    avatarFallback: 'https://cdn.discordapp.com/embed/avatars/1.png',
    defaultPrefix: '!',
    isPremium: false
  },
  {
    key: 'arcane-premium',
    displayName: 'Arcane Premium',
    token: process.env.DISCORD_TOKEN || '',
    color: 0xf59e0b,
    avatarFallback: 'https://cdn.discordapp.com/embed/avatars/4.png',
    defaultPrefix: '!',
    isPremium: true
  },
  {
    key: 'probot',
    displayName: 'ProBot',
    token: process.env.PROBOT_FREE_TOKEN || '',
    color: 0x2563eb,
    avatarFallback: 'https://cdn.discordapp.com/embed/avatars/0.png',
    defaultPrefix: '+',
    isPremium: false
  },
  {
    key: 'probot-premium',
    displayName: 'ProBot Premium',
    token: process.env.PROBOT_TOKEN || '',
    color: 0x3b82f6,
    avatarFallback: 'https://cdn.discordapp.com/embed/avatars/3.png',
    defaultPrefix: '+',
    isPremium: true
  },
  {
    key: 'dyno',
    displayName: 'Dyno',
    token: process.env.DYNO_TOKEN || '',
    color: 0x1e40af,
    avatarFallback: 'https://cdn.discordapp.com/embed/avatars/1.png',
    defaultPrefix: '?',
    isPremium: false
  },
  {
    key: 'dyno-premium',
    displayName: 'Dyno Premium',
    token: process.env.DYNO_PREMIUM_TOKEN || '',
    color: 0x7c3aed,
    avatarFallback: 'https://cdn.discordapp.com/embed/avatars/4.png',
    defaultPrefix: '?',
    isPremium: true
  },
  {
    key: 'support',
    displayName: 'Support',
    token: process.env.SUPPORT_TOKEN || '',
    color: 0x22c55e,
    avatarFallback: 'https://cdn.discordapp.com/embed/avatars/2.png',
    defaultPrefix: '!',
    isPremium: false
  },
  {
    key: 'aiguild',
    displayName: 'AI Guild',
    token: process.env.AIGUILD_TOKEN || '',
    color: 0x6366f1,
    avatarFallback: 'https://cdn.discordapp.com/embed/avatars/0.png',
    defaultPrefix: '/',
    isPremium: false
  },
  {
    key: 'aiguild-premium',
    displayName: 'AI Guild Premium',
    token: process.env.AIGUILD_PREMIUM_TOKEN || '',
    color: 0xa855f7,
    avatarFallback: 'https://cdn.discordapp.com/embed/avatars/4.png',
    defaultPrefix: '/',
    isPremium: true
  }
];

// AI Guild
export const OPENAI_API_KEY          = process.env.OPENAI_API_KEY || '';
export const AIGUILD_FREE_CREDITS    = 10;   // credits par période de 2 semaines
export const AIGUILD_FREE_PERIOD_MS  = 14 * 24 * 60 * 60 * 1000; // 2 semaines en ms
export const AIGUILD_WEBSITE         = 'https://aiguild.me';

// Leveling defaults
// Support
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || '';

// Leveling defaults
export const COMMAND_COOLDOWN_MS  = 4_000;
export const XP_COOLDOWN_MS       = 60_000;
export const XP_PER_MESSAGE_MIN   = 15;
export const XP_PER_MESSAGE_MAX   = 25;
export const DEFAULT_PREFIX       = '!';
export const TOP_GG_URL           = 'https://top.gg/';

// Voice XP (premium)
export const VOICE_XP_MIN         = 10;   // XP per minute in voice
export const VOICE_XP_MAX         = 20;
export const VOICE_XP_COOLDOWN_MS = 60_000; // award every minute

// Premium limits
export const FREE_MAX_REWARDS           = 15;   // role rewards per server (free)
export const FREE_MAX_REWARDS_PER_LVL   = 1;
export const PREM_MAX_REWARDS_PER_LVL   = 3;
export const FREE_REACTION_ROLES        = 10;
export const PREM_REACTION_ROLES        = 100;
export const FREE_AUTO_ROLES            = 1;
export const PREM_AUTO_ROLES            = 10;
export const FREE_CUSTOM_COMMANDS       = 5;
export const PREM_CUSTOM_COMMANDS       = 100;

export function configuredBots() {
  return BOTS.filter((bot) => Boolean(bot.token));
}
