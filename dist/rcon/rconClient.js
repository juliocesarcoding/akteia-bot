"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rconExec = rconExec;
const rcon_1 = __importDefault(require("rcon"));
async function rconExec(opts, command) {
    const timeoutMs = opts.timeoutMs ?? 8000;
    return await new Promise((resolve, reject) => {
        const conn = new rcon_1.default(opts.host, opts.port, opts.password);
        let settled = false;
        const done = (fn) => {
            if (settled)
                return;
            settled = true;
            try {
                fn();
            }
            finally {
                try {
                    conn.disconnect();
                }
                catch { }
            }
        };
        const t = setTimeout(() => {
            done(() => reject(new Error(`RCON timeout (${timeoutMs}ms). Porta bloqueada ou host não permite acesso externo.`)));
        }, timeoutMs);
        conn.on("auth", () => {
            try {
                conn.send(command);
            }
            catch (e) {
                clearTimeout(t);
                done(() => reject(e));
            }
        });
        conn.on("response", (str) => {
            clearTimeout(t);
            done(() => resolve(str));
        });
        conn.on("error", (err) => {
            clearTimeout(t);
            done(() => reject(err));
        });
        conn.connect();
    });
}
