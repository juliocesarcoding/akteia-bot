import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export const pingCommand = {
 data: new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Testa se o bot está vivo"),
 async execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply({ content: "Pong! ✅", ephemeral: true });
 },
};
