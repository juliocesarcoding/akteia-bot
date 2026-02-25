import { config } from "./config";
import { createDiscordClient } from "./discord/client";
import { pingCommand } from "./discord/commands/ping";
import { rconCommand } from "./discord/commands/rcon";
import { mapCommand } from "./discord/commands/maps";

const client = createDiscordClient();

const commandMap = new Map<string, any>();
commandMap.set(pingCommand.data.name, pingCommand);
commandMap.set(rconCommand.data.name, rconCommand);
commandMap.set(mapCommand.data.name, mapCommand);

client.once("ready", () => {
 console.log(`✅ Logado como ${client.user?.tag}`);
});

client.on("interactionCreate", async (interaction) => {
 if (!interaction.isChatInputCommand()) return;

 const cmd = commandMap.get(interaction.commandName);
 if (!cmd) return;

 try {
  await cmd.execute(interaction);
 } catch (err) {
  console.error(err);
  if (interaction.deferred || interaction.replied) {
   await interaction.editReply({ content: "❌ Erro ao executar comando." });
  } else {
   await interaction.reply({
    content: "❌ Erro ao executar comando.",
    ephemeral: true,
   });
  }
 }
});

client.login(config.discord.token);
