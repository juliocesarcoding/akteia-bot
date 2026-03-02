import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { config } from "../../config";
import { rconExec } from "../../rcon/rconClient";

export const startMixBCommand = {
 data: new SlashCommandBuilder()
  .setName("startmix-b")
  .setDescription("Inicia o modo competitivo (mix)"),
 async execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  try {
   await rconExec(
    {
     host: config.cs.host_b,
     port: config.cs.port_b,
     password: config.cs.rconPassword_b,
    },
    `say [AKTEIA] Iniciando mix em ..`
   );
   await rconExec(
    {
     host: config.cs.host_b,
     port: config.cs.port_b,
     password: config.cs.rconPassword_b,
    },
    `exec comp.cfg`
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
