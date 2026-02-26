"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
const ping_1 = require("./commands/ping");
const rcon_1 = require("./commands/rcon");
const maps_1 = require("./commands/maps");
async function main() {
    const commands = [
        ping_1.pingCommand.data.toJSON(),
        rcon_1.rconCommand.data.toJSON(),
        maps_1.mapCommand.data.toJSON(),
    ];
    const rest = new discord_js_1.REST({ version: "10" }).setToken(config_1.config.discord.token);
    await rest.put(discord_js_1.Routes.applicationGuildCommands(config_1.config.discord.clientId, config_1.config.discord.guildId), { body: commands });
    console.log("✅ Slash commands publicados na guild.");
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
