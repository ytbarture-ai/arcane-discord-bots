import fs from 'node:fs/promises';
import path from 'node:path';
import { STORE_PATH, DEFAULT_PREFIX } from './config.js';

function createGuildState() {
  return {
    prefix: DEFAULT_PREFIX,
    levelingEnabled: true,
    xpMultiplier: 1,
    members: {},
    cases: [],
    nextCaseNumber: 1,
    rewards: {},
    stats: {
      messages: 0,
      moderations: 0,
      commands: 0,
      createdAt: new Date().toISOString()
    }
  };
}

export class JsonStore {
  constructor(filePath = STORE_PATH) {
    this.filePath = filePath;
    this.data = { version: 1, guilds: {} };
    this.writeQueue = Promise.resolve();
  }

  async init() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    try {
      const raw = await fs.readFile(this.filePath, 'utf8');
      const parsed = JSON.parse(raw);
      this.data = {
        version: parsed.version || 1,
        guilds: parsed.guilds || {}
      };
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw new Error(`Impossible de lire le stockage : ${error.message}`);
      }
      await this.save();
    }
  }

  scope(botKey, guildId) {
    return `${botKey}:${guildId}`;
  }

  getGuild(botKey, guildId) {
    const key = this.scope(botKey, guildId);
    if (!this.data.guilds[key]) {
      this.data.guilds[key] = createGuildState();
    }
    return this.data.guilds[key];
  }

  getMember(botKey, guildId, userId) {
    const guild = this.getGuild(botKey, guildId);
    if (!guild.members[userId]) {
      guild.members[userId] = {
        xp: 0,
        level: 0,
        messages: 0,
        lastXpAt: 0,
        updatedAt: new Date().toISOString()
      };
    }
    return guild.members[userId];
  }

  async mutate(botKey, guildId, callback) {
    const result = callback(this.getGuild(botKey, guildId));
    await this.save();
    return result;
  }

  async save() {
    const snapshot = JSON.stringify(this.data, null, 2);
    this.writeQueue = this.writeQueue.then(async () => {
      const temporaryPath = `${this.filePath}.tmp`;
      await fs.writeFile(temporaryPath, snapshot, 'utf8');
      await fs.rename(temporaryPath, this.filePath);
    });
    return this.writeQueue;
  }
}

export function xpForLevel(level) {
  return 5 * level * level + 50 * level + 100;
}

export function totalXpForLevel(level) {
  let total = 0;
  for (let current = 0; current < level; current += 1) {
    total += xpForLevel(current);
  }
  return total;
}

export function levelFromTotalXp(xp) {
  let level = 0;
  let spent = 0;
  while (xp >= spent + xpForLevel(level)) {
    spent += xpForLevel(level);
    level += 1;
  }
  return level;
}

export function xpProgress(xp, level) {
  const previous = totalXpForLevel(level);
  const required = xpForLevel(level);
  return {
    current: Math.max(0, xp - previous),
    required,
    percentage: Math.min(100, Math.max(0, Math.round(((xp - previous) / required) * 100)))
  };
}
