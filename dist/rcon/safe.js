"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRconCommand = validateRconCommand;
const BLOCKLIST = [
    "quit",
    "exit",
    "shutdown",
    "killserver",
    "sv_password",
    "rcon_password",
];
function validateRconCommand(cmd) {
    const c = (cmd || "").trim();
    if (!c)
        return { ok: false, reason: "Comando vazio." };
    const lower = c.toLowerCase();
    for (const bad of BLOCKLIST) {
        if (lower.startsWith(bad)) {
            return { ok: false, reason: `Comando bloqueado por segurança: ${bad}` };
        }
    }
    // Evitar multi-comandos separados por ; (pode ser perigoso)
    if (c.includes(";"))
        return { ok: false, reason: "Use apenas 1 comando por vez (sem ';')." };
    return { ok: true };
}
