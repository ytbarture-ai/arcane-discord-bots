// In-memory store for bot data (guild configs, invite tracking, etc.)

export interface GuildConfig {
  language: string; // "fr" | "en" | "es"
  welcomeChannelId?: string;
  welcomeMessage?: string;
  statsChannelIds?: {
    members?: string;
    bots?: string;
    boosts?: string;
  };
}

export interface InviteData {
  inviterId: string;
  inviterTag: string;
  uses: number;
  invitees: string[]; // user IDs who joined with this invite
}

// Guild configs
const guildConfigs = new Map<string, GuildConfig>();

// Invite cache: guildId -> Map<inviteCode, InviteData>
const inviteCache = new Map<string, Map<string, InviteData>>();

// Invite usage: guildId -> Map<userId, inviteCode>
const inviteUsage = new Map<string, Map<string, string>>();

export function getGuildConfig(guildId: string): GuildConfig {
  if (!guildConfigs.has(guildId)) {
    guildConfigs.set(guildId, { language: "fr" });
  }
  return guildConfigs.get(guildId)!;
}

export function setGuildConfig(guildId: string, config: Partial<GuildConfig>): void {
  const existing = getGuildConfig(guildId);
  guildConfigs.set(guildId, { ...existing, ...config });
}

export function getInviteCache(guildId: string): Map<string, InviteData> {
  if (!inviteCache.has(guildId)) {
    inviteCache.set(guildId, new Map());
  }
  return inviteCache.get(guildId)!;
}

export function setInviteCache(guildId: string, cache: Map<string, InviteData>): void {
  inviteCache.set(guildId, cache);
}

export function getInviteUsage(guildId: string): Map<string, string> {
  if (!inviteUsage.has(guildId)) {
    inviteUsage.set(guildId, new Map());
  }
  return inviteUsage.get(guildId)!;
}

export function setInviteUsage(guildId: string, userId: string, code: string): void {
  getInviteUsage(guildId).set(userId, code);
}
