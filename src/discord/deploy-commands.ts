import { REST, Routes } from "discord.js";
import { config } from "../config";
import { pingCommand } from "./commands/ping";
import { rconCommand } from "./commands/rcon";
import { mapCommand } from "./commands/maps";
import { restartCommand } from "./commands/restart";
import { startMixCommand } from "./commands/startmix";
import { enqueteCommand } from "./commands/enquete";
import { separarTimeCommand } from "./commands/separar-time";
import { separarTimeBCommand } from "./commands/separar-time-b";
import { startMixBCommand } from "./commands/startmix-b";
import { mapCommandB } from "./commands/maps-b";

async function main() {
 const commands = [
  pingCommand.data.toJSON(),
  rconCommand.data.toJSON(),
  mapCommand.data.toJSON(),
  restartCommand.data.toJSON(),
  startMixCommand.data.toJSON(),
  enqueteCommand.data.toJSON(),
  separarTimeCommand.data.toJSON(),
  separarTimeBCommand.data.toJSON(),
  startMixBCommand.data.toJSON(),
  mapCommandB.data.toJSON(),
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
