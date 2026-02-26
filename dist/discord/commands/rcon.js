"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rconCommand = void 0;
const discord_js_1 = require("discord.js");
const config_1 = require("../../config");
const rconClient_1 = require("../../rcon/rconClient");
const safe_1 = require("../../rcon/safe");
exports.rconCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("rcon")
        .setDescription("Executa um comando RCON no servidor CS (ex: status)")
        .addStringOption((opt) => opt
        .setName("cmd")
        .setDescription("Comando a executar (ex: status)")
        .setRequired(true)),
    async execute(interaction) {
        const cmd = interaction.options.getString("cmd", true);
        const valid = (0, safe_1.validateRconCommand)(cmd);
        if (!valid.ok) {
            await interaction.reply({ content: `❌ ${valid.reason}`, ephemeral: true });
            return;
        }
        await interaction.deferReply({ ephemeral: true });
        try {
            const out = await (0, rconClient_1.rconExec)({
                host: config_1.config.cs.host,
                port: config_1.config.cs.port,
                password: config_1.config.cs.rconPassword,
                timeoutMs: 8000,
            }, cmd);
            // Discord limita tamanho de msg; corta com segurança
            const trimmed = (out || "").toString().trim() || "(sem resposta)";
            const max = 1800;
            const safe = trimmed.length > max ? trimmed.slice(0, max) + "\n... (cortado)" : trimmed;
            await interaction.editReply({
                content: `✅ **RCON OK**\n\n\`\`\`\n${safe}\n\`\`\``,
            });
        }
        catch (e) {
            await interaction.editReply({
                content: `❌ **Falha no RCON**\n` +
                    `**Host:** ${config_1.config.cs.host}:${config_1.config.cs.port}\n` +
                    `**Erro:** ${String(e?.message ?? e)}`,
            });
        }
    },
};
