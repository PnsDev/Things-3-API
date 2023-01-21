import { ServerWebSocket } from "bun";

let evenPool : ServerWebSocket<any>[] = [];

Bun.serve({
  websocket: {
    open(ws) {
      evenPool.push(ws);
      console.log("Client has connected");
    },
    message(ws, msg) {
      console.log("Echoing: %s", msg);
      evenPool[0].send(msg);
    },
    close(ws) {
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
