import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { logger } from "../lib/logger.js";
import * as setup from "./commands/setup.js";
import * as help from "./commands/help.js";
import * as credits from "./commands/credits.js";
import * as config from "./commands/config.js";
import * as invites from "./commands/invites.js";
import * as invitesTree from "./commands/invites-tree.js";
import * as setupBienvenue from "./commands/setup-bienvenue.js";
import * as setupStatsvoc from "./commands/setup-statsvoc.js";

const commandDefs = [
  setup.data,
  help.data,
  credits.data,
  config.data,
  invites.data,
  invitesTree.data,
  setupBienvenue.data,
  setupStatsvoc.data,
];

export async function deployCommands(clientId: string, token: string) {
  const rest = new REST({ version: "10" }).setToken(token);

  logger.info("Deploying slash commands globally...");

  try {
    await rest.put(Routes.applicationCommands(clientId), {
      body: commandDefs,
    });
    logger.info({ count: commandDefs.length }, "Slash commands deployed successfully");
  } catch (err) {
    logger.error({ err }, "Failed to deploy slash commands");
    throw err;
  }
}
