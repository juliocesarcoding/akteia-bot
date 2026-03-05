import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { config } from "../../config";
import { rconExec } from "../../rcon/rconClient";

export const startRetakeBCommand = {
 data: new SlashCommandBuilder()
  .setName("startretake-b")
  .setDescription("Inicia o modo de retake"),
 async execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  try {
   await rconExec(
    {
     host: config.cs.host_b,
     port: config.cs.port_b,
     password: config.cs.rconPassword_b,
    },
    `say [AKTEIA] Iniciando retake ..`
   );
   await rconExec(
    {
     host: config.cs.host_b,
     port: config.cs.port_b,
     password: config.cs.rconPassword_b,
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
