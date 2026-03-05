import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { config } from "../../config";
import { rconExec } from "../../rcon/rconClient";

export const startCompCommand = {
 data: new SlashCommandBuilder()
  .setName("aquecimento")
  .setDescription("Inicia o modo aquecimento para o mix"),
 async execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  try {
   await rconExec(
    {
     host: config.cs.host,
     port: config.cs.port,
     password: config.cs.rconPassword,
    },
    `say [AKTEIA] Iniciando aquecimento. Separe os times e prepare-se para o mix!`
   );
   await rconExec(
    {
     host: config.cs.host,
     port: config.cs.port,
     password: config.cs.rconPassword,
    },
    `exec comp.cfg`
   );
   //  await rconExec(
   //   {
   //    host: config.cs.host,
   //    port: config.cs.port,
   //    password: config.cs.rconPassword,
   //   },
   //   `css_start`
   //  );

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
