import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { config } from "../../config";
import { rconExec } from "../../rcon/rconClient";

export const startRetakeCommand = {
 data: new SlashCommandBuilder()
  .setName("startretake")
  .setDescription("Inicia o modo de retake"),
 async execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  try {
   await rconExec(
    {
     host: config.cs.host,
     port: config.cs.port,
     password: config.cs.rconPassword,
    },
    `say [AKTEIA] Iniciando retake ..`
   );
   await rconExec(
    {
     host: config.cs.host,
     port: config.cs.port,
     password: config.cs.rconPassword,
    },
    `exec retake.cfg`
   );

   await interaction.editReply({
    content: `🔥 RETAKE iniciado `,
   });
  } catch (err: any) {
   await interaction.editReply({
    content: `❌ Erro ao iniciar retake: ${err.message}`,
   });
  }
 },
};
