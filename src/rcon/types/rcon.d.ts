declare module "rcon" {
 import { EventEmitter } from "events";

 class Rcon extends EventEmitter {
  constructor(host: string, port: number, password: string, options?: any);

  connect(): void;
  disconnect(): void;
  send(command: string): void;
 }

 export = Rcon;
}
