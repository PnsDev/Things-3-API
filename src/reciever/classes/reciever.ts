const aes256 = require("aes256");
import { randomUUID } from "crypto";
import { checkInternet } from "../../utils/webUtils.ts";
import Router from "./router.ts";
import Message, { MessageMethod } from "../../classes/message.ts";

export default class Reciever {
  private socket: WebSocket | undefined;
  private router: Router = new Router();
  private conectionURL: string;

  constructor(connectionURL: string) {
    this.conectionURL = connectionURL;
    this.connect();
  }

  /**
   * Connects to the server
   */
  private connect() {
    console.log("Connecting to server...")
    this.socket = new WebSocket(this.conectionURL);
    this.registerEvents();
  }

  /**
   * Registers the events for the socket
   */
  private registerEvents() {
    if (!this.socket) return;

    // Send auth message on open
    this.socket.addEventListener("open", (event) => {
      if (!this.socket) return;

      const message: Message = new Message({
        ID: randomUUID(),
        method: MessageMethod.AUTH
      });

      this.socket.send(aes256.encrypt(Bun.env.SECRET, JSON.stringify(message)));
    });

    // Listen for messages and if decrypted, route them
    this.socket.addEventListener("message", (event) => {
      if (!this.socket) return;

      try {
        const message: string = aes256.decrypt(event.data, Bun.env.SECRET);
        this.router.route(Message.fromJSON(message), this.socket);
      } catch (e) {
        // Kill process if it can't decrypt the messages
        console.error("Failed to decrypt message: %s", e);
        process.exit(1);
      }
    });

    // Listen for messages
    this.socket.addEventListener("close", async () => {
      console.log('Connection closed, reconnecting in 1 min...')
      // Check if there's an internet connection. if not wait 4 mins
      while (await !checkInternet()) {
        console.log("Waiting for internet connection...");
        await new Promise((resolve) => setTimeout(resolve, 240000));
      }

      // Wait 1 min before trying to reconnect
      await new Promise((resolve) => setTimeout(resolve, 60000));
      this.connect();
    });
  }
}
