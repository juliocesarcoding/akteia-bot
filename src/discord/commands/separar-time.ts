import {
 SlashCommandBuilder,
 ChatInputCommandInteraction,
 GuildMember,
 ChannelType,
} from "discord.js";
import { config } from "../../config";

function sortMembersAlpha(members: GuildMember[]) {
 return members.sort((a, b) =>
  (a.displayName || a.user.username).localeCompare(
   b.displayName || b.user.username,
   "pt-BR",
   { sensitivity: "base" }
  )
 );
}

async function safeMove(member: GuildMember, channelId: string) {
 await member.voice.setChannel(channelId);
 await new Promise((r) => setTimeout(r, 250));
}

export const separarTimeCommand = {
 data: new SlashCommandBuilder()
  .setName("separar-time")
  .setDescription("Separa o canal CS em TR e CT por ordem alfabética."),

 async execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.inCachedGuild()) {
   return interaction.reply({
    content: "❌ Comando só funciona em servidor.",
    ephemeral: true,
   });
  }

  const guild = interaction.guild;

  // 🔥 BUSCA O CANAL CS POR ID FIXO
  const csChannel = await guild.channels.fetch(
   config.discord.voiceCsChannelId
  );

  if (!csChannel || csChannel.type !== ChannelType.GuildVoice) {
   return interaction.reply({
    content: "❌ Canal CS inválido no config.",
    ephemeral: true,
   });
  }

  // 🔥 PEGA TODOS DO CANAL CS
  const voiceMembers = Array.from(csChannel.members.values()).filter(
   (m) => !m.user.bot
  );

  if (voiceMembers.length < 2) {
   return interaction.reply({
    content: "⚠️ Pouca gente no canal CS para separar.",
    ephemeral: true,
   });
  }

  const sorted = sortMembersAlpha(voiceMembers);

  const half = Math.ceil(sorted.length / 2);
  const toTR = sorted.slice(0, half);
  const toCT = sorted.slice(half);

  const trChannel = guild.channels.cache.get(
   config.discord.voiceQueueTrChannelId
  );
  const ctChannel = guild.channels.cache.get(
   config.discord.voiceQueueCtChannelId
  );

  if (!trChannel || !ctChannel) {
   return interaction.reply({
    content: "❌ TR ou CT não encontrados. Verifique IDs.",
    ephemeral: true,
   });
  }

  await interaction.reply({
   content: `🔀 Separando ${sorted.length} players do canal CS...`,
   ephemeral: true,
  });

  try {
   for (const m of toTR) await safeMove(m, trChannel.id);
   for (const m of toCT) await safeMove(m, ctChannel.id);

   await interaction.followUp({
    content: `✅ Times separados!\n🟧 TR: ${toTR.length}\n🟦 CT: ${toCT.length}`,
    ephemeral: true,
   });
  } catch (err) {
   console.error("Erro ao mover membros:", err);
   await interaction.followUp({
    content: "❌ Erro ao mover membros. Verifique permissões Move Members.",
    ephemeral: true,
   });
  }
 },
};
