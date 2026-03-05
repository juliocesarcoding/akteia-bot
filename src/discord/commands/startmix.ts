import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { config } from "../../config";
import { rconExec } from "../../rcon/rconClient";

export const startMixCommand = {
 data: new SlashCommandBuilder()
  .setName("startmix")
  .setDescription("Inicia o modo competitivo (mix)"),
 async execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  try {
   await rconExec(
    {
     host: config.cs.host,
     port: config.cs.port,
     password: config.cs.rconPassword,
    },
    `say [AKTEIA] Iniciando mix em ..`
   );
   await rconExec(
    {
     host: config.cs.host,
     port: config.cs.port,
     password: config.cs.rconPassword,
    },
    `exec comp.cfg`
   );
   await rconExec(
    {
     host: config.cs.host,
     port: config.cs.port,
     password: config.cs.rconPassword,
    },
    `say .start`
   );

   await interaction.editReply({
    content: `🔥 MIX iniciado `,
   });
  } catch (err: any) {
   await interaction.editReply({
    content: `❌ Erro ao iniciar mix: ${err.message}`,
   });
  }
 },
};
