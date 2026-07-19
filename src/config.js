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
    avatarFallback: 'https://cdn.discordapp.com/embed/avatars/0.png'
  },
  {
    key: 'arcane-chan',
    displayName: 'Arcane Chan',
    token: process.env.ARCANE_CHAN_TOKEN || '',
    color: 0xec4899,
    avatarFallback: 'https://cdn.discordapp.com/embed/avatars/1.png'
  }
];

export const COMMAND_COOLDOWN_MS = 4_000;
export const XP_COOLDOWN_MS = 60_000;
export const XP_PER_MESSAGE_MIN = 15;
export const XP_PER_MESSAGE_MAX = 25;
export const DEFAULT_PREFIX = '!';
export const TOP_GG_URL = 'https://top.gg/';

export function configuredBots() {
  return BOTS.filter((bot) => Boolean(bot.token));
}
