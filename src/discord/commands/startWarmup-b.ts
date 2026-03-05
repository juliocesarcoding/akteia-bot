import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { config } from "../../config";
import { rconExec } from "../../rcon/rconClient";

export const startCompBCommand = {
 data: new SlashCommandBuilder()
  .setName("aquecimento")
  .setDescription("Inicia o modo aquecimento para o mix"),
 async execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  try {
   await rconExec(
    {
     host: config.cs.host_b,
     port: config.cs.port_b,
     password: config.cs.rconPassword_b,
    },
    `say [AKTEIA] Iniciando aquecimento. Separe os times e prepare-se para o mix!`
   );
   await rconExec(
    {
     host: config.cs.host_b,
     port: config.cs.port_b,
     password: config.cs.rconPassword_b,
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
    content: `🔥 Aquecimento iniciado`,
   });
  } catch (err: any) {
   await interaction.editReply({
    content: `❌ Erro ao iniciar aquecimento: ${err.message}`,
   });
  }
 },
};
