import Rcon from "rcon";

type RconOptions = {
 host: string;
 port: number;
 password: string;
 timeoutMs?: number;
};

export async function rconExec(
 opts: RconOptions,
 command: string
): Promise<string> {
 const timeoutMs = opts.timeoutMs ?? 8000;

 return await new Promise<string>((resolve, reject) => {
  const conn = new Rcon(opts.host, opts.port, opts.password);

  let settled = false;
  const done = (fn: () => void) => {
   if (settled) return;
   settled = true;
   try {
    fn();
   } finally {
    try {
     conn.disconnect();
    } catch {}
   }
  };

  const t = setTimeout(() => {
   done(() =>
    reject(
     new Error(
      `RCON timeout (${timeoutMs}ms). Porta bloqueada ou host não permite acesso externo.`
     )
    )
   );
  }, timeoutMs);

  conn.on("auth", () => {
   try {
    conn.send(command);
   } catch (e: any) {
    clearTimeout(t);
    done(() => reject(e));
   }
  });

  conn.on("response", (str: string) => {
   clearTimeout(t);
   done(() => resolve(str));
  });

  conn.on("error", (err: any) => {
   clearTimeout(t);
   done(() => reject(err));
  });

  conn.connect();
 });
}
