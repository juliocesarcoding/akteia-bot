import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { config } from "../../config";
import { rconExec } from "../../rcon/rconClient";

const ALLOWED_MAPS = new Set([
 "de_mirage",
 "de_inferno",
 "de_nuke",
 "de_ancient",
 "de_anubis",
 "de_overpass",
 "de_vertigo",
 // adicione outros se quiser (retake, aim etc.)
]);

function normalizeMapName(input: string) {
 return input.trim().toLowerCase();
}

export const mapCommand = {
 data: new SlashCommandBuilder()
  .setName("map")
  .setDescription("Troca o mapa do servidor (changelevel)")
  .addStringOption((opt) =>
   opt.setName("mapa").setDescription("Ex: de_mirage").setRequired(true)
  ),

 async execute(interaction: ChatInputCommandInteraction) {
  const mapRaw = interaction.options.getString("mapa", true);
  const map = normalizeMapName(mapRaw);

  if (!ALLOWED_MAPS.has(map)) {
   await interaction.reply({
    content:
     `❌ Mapa não permitido: **${map}**\n` +
     `Permitidos: ${Array.from(ALLOWED_MAPS).join(", ")}`,
    ephemeral: true,
   });
   return;
  }

  await interaction.deferReply({ ephemeral: true });

  try {
   // Mensagem no servidor (opcional)
   await rconExec(
    {
     host: config.cs.host,
     port: config.cs.port,
     password: config.cs.rconPassword,
    },
    `say [AKTEIA] Trocando mapa para ${map}...`
   );

   // Troca de mapa
   const out = await rconExec(
    {
     host: config.cs.host,
     port: config.cs.port,
     password: config.cs.rconPassword,
    },
    `changelevel ${map}`
   );

   await interaction.editReply({
    content: `✅ Mapa alterado para **${map}**.\n\n\`\`\`\n${(out || "").trim() || "(sem resposta)"}\n\`\`\``,
   });
  } catch (e: any) {
   await interaction.editReply({
    content: `❌ Falha ao trocar mapa.\nErro: ${String(e?.message ?? e)}`,
   });
  }
 },
};
