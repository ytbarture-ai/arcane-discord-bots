import { GuildMember, PartialGuildMember } from "discord.js";
import { updateStatsChannels } from "../commands/setup-statsvoc.js";

export async function handleGuildMemberRemove(member: GuildMember | PartialGuildMember) {
  // Update stats channels when a member leaves
  await updateStatsChannels(member.guild);
}
