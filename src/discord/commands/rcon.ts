import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { config } from "../../config";
import { rconExec } from "../../rcon/rconClient";
import { validateRconCommand } from "../../rcon/safe";

export const rconCommand = {
 data: new SlashCommandBuilder()
  .setName("rcon")
  .setDescription("Executa um comando RCON no servidor CS (ex: status)")
  .addStringOption((opt) =>
   opt
    .setName("cmd")
    .setDescription("Comando a executar (ex: status)")
    .setRequired(true)
  ),

 async execute(interaction: ChatInputCommandInteraction) {
  const cmd = interaction.options.getString("cmd", true);

  const valid = validateRconCommand(cmd);
  if (!valid.ok) {
   await interaction.reply({ content: `❌ ${valid.reason}`, ephemeral: true });
   return;
  }

  await interaction.deferReply({ ephemeral: true });

  try {
   const out = await rconExec(
    {
     host: config.cs.host,
     port: config.cs.port,
     password: config.cs.rconPassword,
     timeoutMs: 8000,
    },
    cmd
   );

   // Discord limita tamanho de msg; corta com segurança
   const trimmed = (out || "").toString().trim() || "(sem resposta)";
   const max = 1800;
   const safe =
    trimmed.length > max ? trimmed.slice(0, max) + "\n... (cortado)" : trimmed;

   await interaction.editReply({
    content: `✅ **RCON OK**\n\n\`\`\`\n${safe}\n\`\`\``,
   });
  } catch (e: any) {
   await interaction.editReply({
    content:
     `❌ **Falha no RCON**\n` +
     `**Host:** ${config.cs.host}:${config.cs.port}\n` +
     `**Erro:** ${String(e?.message ?? e)}`,
   });
  }
 },
};
