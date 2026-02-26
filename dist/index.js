"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const client_1 = require("./discord/client");
const ping_1 = require("./discord/commands/ping");
const rcon_1 = require("./discord/commands/rcon");
const maps_1 = require("./discord/commands/maps");
const client = (0, client_1.createDiscordClient)();
const commandMap = new Map();
commandMap.set(ping_1.pingCommand.data.name, ping_1.pingCommand);
commandMap.set(rcon_1.rconCommand.data.name, rcon_1.rconCommand);
commandMap.set(maps_1.mapCommand.data.name, maps_1.mapCommand);
client.once("ready", () => {
    console.log(`✅ Logado como ${client.user?.tag}`);
});
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    const cmd = commandMap.get(interaction.commandName);
    if (!cmd)
        return;
    try {
        await cmd.execute(interaction);
    }
    catch (err) {
        console.error(err);
        if (interaction.deferred || interaction.replied) {
            await interaction.editReply({ content: "❌ Erro ao executar comando." });
        }
        else {
            await interaction.reply({
                content: "❌ Erro ao executar comando.",
                ephemeral: true,
            });
        }
    }
});
client.login(config_1.config.discord.token);
