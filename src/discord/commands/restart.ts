import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { config } from "../../config";
import { rconExec } from "../../rcon/rconClient";

export const restartCommand = {
 data: new SlashCommandBuilder()
  .setName("restart")
  .setDescription("Reinicia a partida atual"),

 async execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  try {
   await rconExec(
    {
     host: config.cs.host,
     port: config.cs.port,
     password: config.cs.rconPassword,
    },
    `say [AKTEIA] Reiniciando partida...`
   );
   await rconExec(
    {
     host: config.cs.host,
     port: config.cs.port,
     password: config.cs.rconPassword,
    },
    `mp_restartgame 1`
   );

   await interaction.editReply({
    content: `🔄 Partida reiniciada com sucesso.`,
   });
  } catch (err: any) {
   await interaction.editReply({
    content: `❌ Erro ao reiniciar: ${err.message}`,
   });
  }
 },
};
