import { Interaction } from "discord.js";
import { logger } from "../../lib/logger.js";
import * as setup from "../commands/setup.js";
import * as help from "../commands/help.js";
import * as credits from "../commands/credits.js";
import * as config from "../commands/config.js";
import * as invites from "../commands/invites.js";
import * as invitesTree from "../commands/invites-tree.js";
import * as setupBienvenue from "../commands/setup-bienvenue.js";
import * as setupStatsvoc from "../commands/setup-statsvoc.js";

const commands: Record<string, { execute: (i: any) => Promise<void> }> = {
  setup,
  help,
  credits,
  config,
  invites,
  "invites-tree": invitesTree,
  "setup-bienvenue": setupBienvenue,
  "setup-statsvoc": setupStatsvoc,
};

export async function handleInteraction(interaction: Interaction) {
  try {
    // Slash commands
    if (interaction.isChatInputCommand()) {
      const command = commands[interaction.commandName];
      if (!command) {
        logger.warn({ commandName: interaction.commandName }, "Unknown command");
        return;
      }
      await command.execute(interaction);
      return;
    }

    // Modals
    if (interaction.isModalSubmit()) {
      if (interaction.customId === "setup_modal") {
        await setup.handleSetupModal(interaction);
        return;
      }
      if (interaction.customId.startsWith("bienvenue_message:")) {
        await setupBienvenue.handleBienvenueMessage(interaction);
        return;
      }
    }

    // Select menus
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId.startsWith("setup_type:")) {
        await setup.handleSetupType(interaction);
        return;
      }
      if (interaction.customId === "config_language") {
        await config.handleConfigLanguage(interaction);
        return;
      }
      if (interaction.customId === "bienvenue_channel") {
        await setupBienvenue.handleBienvenueChannel(interaction);
        return;
      }
    }

    // Buttons
    if (interaction.isButton()) {
      if (interaction.customId.startsWith("setup_lang:")) {
        await setup.handleSetupLang(interaction);
        return;
      }
      if (interaction.customId.startsWith("setup_confirm:")) {
        await setup.handleSetupConfirm(interaction);
        return;
      }
      if (interaction.customId === "setup_cancel") {
        await setup.handleSetupCancel(interaction);
        return;
      }
      if (interaction.customId === "statsvoc_confirm") {
        await setupStatsvoc.handleStatsVocConfirm(interaction);
        return;
      }
      if (interaction.customId === "statsvoc_cancel") {
        await setupStatsvoc.handleStatsVocCancel(interaction);
        return;
      }
      if (interaction.customId.startsWith("bienvenue_test:")) {
        await setupBienvenue.handleBienvenueTest(interaction);
        return;
      }
    }
  } catch (err) {
    logger.error({ err }, "Error handling interaction");
    try {
      const reply = { content: "❌ Une erreur s'est produite.", ephemeral: true };
      if (interaction.isRepliable()) {
        if ((interaction as any).replied || (interaction as any).deferred) {
          await (interaction as any).followUp(reply);
        } else {
          await (interaction as any).reply(reply);
        }
      }
    } catch {
      // ignore
    }
  }
}
