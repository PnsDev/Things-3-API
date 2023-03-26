const aes256 = require("aes256");
const logger = require('signale');

import { Server, ServerWebSocket } from "bun";
import Message, { MessageMethod } from "../../classes/message.ts";
import { IdentifiedSocket } from "./IdentifiedSocket.ts";

export class WebServer {
  private unAuthedSockets: IdentifiedSocket[] = [];
  private clientSocket: IdentifiedSocket | null = null;

  constructor() {
    logger.info("Starting web server...");
    Bun.serve({
      websocket: {
        open: (ws) => { // When a socket opens
          let tempSocket = new IdentifiedSocket(ws); // Make it an identified socket
          this.unAuthedSockets.push(tempSocket); // Add it to the unauthed sockets
          tempSocket.log.open(`UnAuthed socket opened`);
         },
        message: (ws, msg) => { // When a socket sends a message
          let foundSocket = this.unAuthedSockets.find((identifiedSocket) => identifiedSocket.socket === ws);
          if (!foundSocket) {
            if (this.clientSocket?.socket === ws) foundSocket = this.clientSocket;
            else {
              ws.close();
              return;
            }
          }
          this.handleMessage(foundSocket, msg)
        },
        close: (ws) => { // When a socket closes
          // Check if it's the client socket
          if (this.clientSocket?.socket === ws) {
            this.clientSocket.log.close(`Client socket closed`);
            this.clientSocket = null;
            return;
          }

          // Check if it's an unauthed socket
          const foundSocket = this.unAuthedSockets.find((identifiedSocket) => identifiedSocket.socket === ws);
          if (!foundSocket) return;
          this.unAuthedSockets.splice(this.unAuthedSockets.indexOf(foundSocket), 1);
          foundSocket.log.close(`UnAuthed socket closed`);
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

  // TODO: add some sort of stash in case there is no client socket :O
  // TODO: if client socket does no respond, re-add to task to the stash

  private handleMessage(ws: IdentifiedSocket, msg: string | Uint8Array) {
    try { // Decrypt the message and check if it's an auth message
      let temp = aes256.decrypt(Bun.env.SECRET, msg);
      const decryptedMsg = Message.fromJSON(temp);

      // Kill the connection if it's not authed and it's not an auth message
      if (decryptedMsg.method !== MessageMethod.AUTH && this.clientSocket !== ws) {
        ws.log.warn("Unauthed socket sent a non auth message");
        ws.socket.close(); 
        return;
      }

      // Handle the message
      switch (decryptedMsg.method) { // The host server should only receive auth, ping, and response messages
        case MessageMethod.AUTH: {
          this.unAuthedSockets.splice(this.unAuthedSockets.indexOf(ws), 1);
          if (this.clientSocket !== null) this.clientSocket.socket.close();
          this.clientSocket = ws;
          ws.log.auth("New client socket authed");
          break;
        }
        case MessageMethod.PING: {
          ws.socket.send(aes256.encrypt(Bun.env.SECRET, JSON.stringify(new Message({
            ID: decryptedMsg.ID,
            method: MessageMethod.PONG,
          }))));
          break;
        }
        case MessageMethod.RESPONSE: {
        // TODO: Handle response with event emitter
        }
      }
    } catch (e) { 
      logger.error(e);
      ws.log.warn("Socket sent a non encrypted message");
      ws.socket.close(); 
    } // Kill the connection if it can't decrypt the message
  }
}
