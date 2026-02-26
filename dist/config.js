"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
function required(name) {
    const v = process.env[name];
    if (!v || !v.trim())
        throw new Error(`Missing env: ${name}`);
    return v.trim();
}
function optional(name, fallback = "") {
    return (process.env[name] ?? fallback).trim();
}
exports.config = {
    discord: {
        token: required("DISCORD_TOKEN"),
        clientId: required("DISCORD_CLIENT_ID"),
        guildId: required("DISCORD_GUILD_ID"),
    },
    cs: {
        host: required("CS_HOST"),
        port: Number(optional("CS_PORT", "27015")),
        rconPassword: required("CS_RCON_PASSWORD"),
    },
};
