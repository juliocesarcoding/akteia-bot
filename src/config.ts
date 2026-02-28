import "dotenv/config";

function required(name: string): string {
 const v = process.env[name];
 if (!v || !v.trim()) throw new Error(`Missing env: ${name}`);
 return v.trim();
}

function optional(name: string, fallback = ""): string {
 return (process.env[name] ?? fallback).trim();
}

export const config = {
 discord: {
  token: required("DISCORD_TOKEN"),
  clientId: required("DISCORD_CLIENT_ID"),
  guildId: required("DISCORD_GUILD_ID"),
  welcomeChannelId: optional("WELCOME_CHANNEL_ID"),
  autoRoleId: optional("AUTO_ROLE_ID"),
  voiceQueueTrChannelId: optional("VOICE_QUEUE_TR_CHANNEL_ID"),
  voiceQueueCtChannelId: optional("VOICE_QUEUE_CT_CHANNEL_ID"),
  voiceCsChannelId: optional("VOICE_QUEUE_CS_CHANNEL_ID"),
 },
 cs: {
  host: required("CS_HOST"),
  port: Number(optional("CS_PORT", "27015")),
  rconPassword: required("CS_RCON_PASSWORD"),
 },
};
