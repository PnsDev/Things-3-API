const aes256 = require("aes256");
import { Server, ServerWebSocket } from "bun";
import Message, { MessageMethod } from "../classes/message.ts";

export class WebServer {
  private unAuthedSockets: ServerWebSocket<any>[] = [];
  private openSockets: ServerWebSocket<any>[] = [];
  private server: Server;

  constructor() {
    this.server = Bun.serve({
      websocket: {
        open: (ws) => { this.unAuthedSockets.push(ws); },
        message: (ws, msg) => this.handleMessage(ws, msg),
        close: (ws) => {
          this.unAuthedSockets.filter((socket) => socket !== ws);
          this.openSockets.filter((socket) => socket !== ws);
        },
      },
      fetch(req, server) {
        if (!server.upgrade(req)) {
          return new Response(null, { status: 404 });
        }
      },
      port: Bun.env.PORT,
    });
  }



  private handleMessage(ws: ServerWebSocket<any>, msg: string | Uint8Array) {
    try { // Decrypt the message and check if it's an auth message
      const decryptedMsg = Message.fromJSON(aes256.decrypt(Bun.env.SECRET, msg));

      // Kill the connection if it's not authed and it's not an auth message
      if (decryptedMsg.method !== MessageMethod.AUTH && !this.openSockets.includes(ws)) return ws.close(); 

      // Handle the message
      switch (decryptedMsg.method) { // The host server should only receive auth, ping, and response messages
        case MessageMethod.AUTH: {
          this.unAuthedSockets.filter((socket) => socket !== ws);
          this.openSockets.push(ws);
          break;
        }
        case MessageMethod.PING: {
          ws.send(aes256.encrypt(Bun.env.SECRET, JSON.stringify(new Message({
            ID: decryptedMsg.ID,
            method: MessageMethod.PONG,
          }))));
          break;
        }
        case MessageMethod.RESPONSE: {
        // TODO: Handle response with event emitter
        }
      }
    } catch (e) { ws.close(); } // Kill the connection if it can't decrypt the message
  }
}
