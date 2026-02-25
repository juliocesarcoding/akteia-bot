import { REST, Routes } from "discord.js";
import { config } from "../config";
import { pingCommand } from "./commands/ping";
import { rconCommand } from "./commands/rcon";
import { mapCommand } from "./commands/maps";

async function main() {
 const commands = [
  pingCommand.data.toJSON(),
  rconCommand.data.toJSON(),
  mapCommand.data.toJSON(),
 ];

 const rest = new REST({ version: "10" }).setToken(config.discord.token);

 await rest.put(
  Routes.applicationGuildCommands(
   config.discord.clientId,
   config.discord.guildId
  ),
  { body: commands }
 );

 console.log("✅ Slash commands publicados na guild.");
}

main().catch((err) => {
 console.error(err);
 process.exit(1);
});
