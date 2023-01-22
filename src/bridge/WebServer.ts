import { Server, ServerWebSocket } from "bun";

export class WebServer {
  private unAuthedSockets: ServerWebSocket<any>[] = [];
  private openSockets: ServerWebSocket<any>[] = [];
  private server: Server;

  constructor() {
    this.server = Bun.serve({
      websocket: {
        open: (ws) => {
          this.unAuthedSockets.push(ws);
          console.log("Client has connected");
        },
        message: (ws, msg) => {
          console.log("Echoing: %s", msg);
          evenPool[0].send(msg);
        },
        close: (ws) => {
          console.log("Client has disconnected");
        },
      },
      fetch(req, server) {
        if (!server.upgrade(req)) {
          return new Response(null, { status: 404 });
        }
      },
      port: 1234,
    });
  }



  
}
