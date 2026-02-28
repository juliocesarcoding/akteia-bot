import {
 SlashCommandBuilder,
 ChatInputCommandInteraction,
 MessageFlags,
 TextChannel,
 PollLayoutType,
 Routes,
} from "discord.js";
import { config } from "../../config"; // ajuste o caminho se necessário

const MAPAS = [
 "de_mirage",
 "de_inferno",
 "de_nuke",
 "de_ancient",
 "de_anubis",
 "de_overpass",
 "de_vertigo",
 "de_dust2",
 "de_cache",
];

const EXPIRE_MS = 2 * 60 * 1000; // 2 minutos

export const enqueteCommand = {
 data: new SlashCommandBuilder()
  .setName("enquete")
  .setDescription(
   "Cria uma enquete (Poll) de mapas no canal #geral por 2 minutos"
  ),

 async execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply({
   content: "Enquete (Poll) enviada no #geral ✅ (expira em 2 min)",
   flags: MessageFlags.Ephemeral,
  });

  const guild = interaction.guild;
  if (!guild) return;

  const geralChannelId = process.env.GERAL_CHANNEL_ID; // <-- coloca no config
  if (!geralChannelId) {
   await interaction.followUp({
    content: "Config faltando: discord.geralChannelId",
    flags: MessageFlags.Ephemeral,
   });
   return;
  }

  const ch = guild.channels.cache.get(geralChannelId);
  if (!ch || !(ch instanceof TextChannel)) {
   await interaction.followUp({
    content:
     "Não consegui acessar o canal #geral (ID inválido ou sem permissão).",
    flags: MessageFlags.Ephemeral,
   });
   return;
  }

  // ⚠️ Duração do poll é em HORAS (Discord), então a gente cria com 1h e expira manualmente em 2 min
  const msg = await ch.send({
   content: "🎮 **VOTAÇÃO DE MAPA - AKTÉIA MIX** (2 minutos)",
   poll: {
    question: { text: "Qual mapa vamos jogar?" },
    answers: MAPAS.map((m) => ({ text: m })),
    allowMultiselect: false,
    layoutType: PollLayoutType.Default,
    duration: 1, // horas
   },
  });

  // Expira em 2 minutos
  setTimeout(async () => {
   try {
    // 1) re-fetch da mensagem (garante que o poll vem carregado)
    const fresh = await ch.messages.fetch(msg.id);

    // 2) tenta encerrar via discord.js
    if (fresh.poll) {
     await fresh.poll.end(); // Poll.end() existe no discord.js :contentReference[oaicite:2]{index=2}
     return;
    }

    // 3) fallback REST (mais “baixo nível”, bem confiável)
    await interaction.client.rest.post(Routes.expirePoll(ch.id, msg.id));
   } catch (err) {
    console.error("Falha ao expirar poll:", err);
   }
  }, EXPIRE_MS);
 },
};
