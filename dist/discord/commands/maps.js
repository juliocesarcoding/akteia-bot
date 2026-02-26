"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCommand = void 0;
const discord_js_1 = require("discord.js");
const config_1 = require("../../config");
const rconClient_1 = require("../../rcon/rconClient");
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
function normalizeMapName(input) {
    return input.trim().toLowerCase();
}
exports.mapCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("map")
        .setDescription("Troca o mapa do servidor (changelevel)")
        .addStringOption((opt) => opt.setName("mapa").setDescription("Ex: de_mirage").setRequired(true)),
    async execute(interaction) {
        const mapRaw = interaction.options.getString("mapa", true);
        const map = normalizeMapName(mapRaw);
        if (!ALLOWED_MAPS.has(map)) {
            await interaction.reply({
                content: `❌ Mapa não permitido: **${map}**\n` +
                    `Permitidos: ${Array.from(ALLOWED_MAPS).join(", ")}`,
                ephemeral: true,
            });
            return;
        }
        await interaction.deferReply({ ephemeral: true });
        try {
            // Mensagem no servidor (opcional)
            await (0, rconClient_1.rconExec)({
                host: config_1.config.cs.host,
                port: config_1.config.cs.port,
                password: config_1.config.cs.rconPassword,
            }, `say [AKTEIA] Trocando mapa para ${map}...`);
            // Troca de mapa
            const out = await (0, rconClient_1.rconExec)({
                host: config_1.config.cs.host,
                port: config_1.config.cs.port,
                password: config_1.config.cs.rconPassword,
            }, `changelevel ${map}`);
            await interaction.editReply({
                content: `✅ Mapa alterado para **${map}**.\n\n\`\`\`\n${(out || "").trim() || "(sem resposta)"}\n\`\`\``,
            });
        }
        catch (e) {
            await interaction.editReply({
                content: `❌ Falha ao trocar mapa.\nErro: ${String(e?.message ?? e)}`,
            });
        }
    },
};
