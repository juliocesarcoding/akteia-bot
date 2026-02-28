import { config } from "./config";
import { createDiscordClient } from "./discord/client";
import { pingCommand } from "./discord/commands/ping";
import { rconCommand } from "./discord/commands/rcon";
import { mapCommand } from "./discord/commands/maps";
import { restartCommand } from "./discord/commands/restart";
import { startMixCommand } from "./discord/commands/startmix";
import { EmbedBuilder, MessageFlags } from "discord.js";
import { enqueteCommand } from "./discord/commands/enquete";
import { separarTimeCommand } from "./discord/commands/separar-time";

const client = createDiscordClient();

console.log("INTENTS BITFIELD:", client.options.intents?.bitfield);
const commandMap = new Map<string, any>();
commandMap.set(pingCommand.data.name, pingCommand);
commandMap.set(rconCommand.data.name, rconCommand);
commandMap.set(mapCommand.data.name, mapCommand);
commandMap.set(restartCommand.data.name, restartCommand);
commandMap.set(startMixCommand.data.name, startMixCommand);
commandMap.set(enqueteCommand.data.name, enqueteCommand);
commandMap.set(separarTimeCommand.data.name, separarTimeCommand);

client.once("clientReady", () => {
 console.log(`✅ Logado como ${client.user?.tag}`);
});

// ✅ WELCOME (AK-téia)
client.on("guildMemberAdd", async (member) => {
 try {
  const welcomeChannelId = config.discord.welcomeChannelId; // vamos colocar no config
  if (!welcomeChannelId) return;

  const channel = await member.guild.channels
   .fetch(welcomeChannelId)
   .catch(() => null);
  if (!channel || !channel.isTextBased() || !("send" in channel)) return;

  const embed = new EmbedBuilder()
   .setTitle("🔥 Bem-vindo à AKtéia!")
   .setDescription(
    `Salve ${member}!\n\n` +
     `📌 **Leia as regras** antes de jogar\n` +
     `🚫 Sem toxicidade / preconceito\n` +
     `🚫 Sem xiter\n` +
     `🤝 Humildade sempre\n\n`
   )
   .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
   .setTimestamp();

  await channel.send({ embeds: [embed] });

  // (Opcional) cargo automático
  const autoRoleId = config.discord.autoRoleId;
  if (autoRoleId) {
   await member.roles.add(autoRoleId).catch(() => null);
  }
 } catch (err) {
  console.error("Erro no welcome:", err);
 }
});

client.on("interactionCreate", async (interaction) => {
 if (!interaction.isChatInputCommand()) return;

 const cmd = commandMap.get(interaction.commandName);
 if (!cmd) return;

 try {
  await cmd.execute(interaction);
 } catch (err) {
  console.error(err);
  if (interaction.deferred || interaction.replied) {
   await interaction.editReply({ content: "❌ Erro ao executar comando." });
  } else {
   await interaction.reply({
    content: "❌ Erro ao executar comando.",
    flags: MessageFlags.Ephemeral,
   });
  }
 }
});

client.login(config.discord.token);
