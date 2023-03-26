const { Signale } = require("signale");

import { ServerWebSocket } from "bun";
import { randomUUID } from "crypto";

export class IdentifiedSocket {
  readonly id: string = randomUUID();
  readonly socket: ServerWebSocket<any>;
  readonly log: any;

  constructor(socket: ServerWebSocket<any>) {
    this.socket = socket;
    this.log = new Signale({
      logLevel: "info",
      scope: this.shortId(),
      types: {
        close: {
          badge: "🔥",
          color: "red",
          label: "Closed",
          logLevel: "warn",
        },
        auth: {
          badge: "🔒",
          color: "cyan",
          label: "Authed",
          logLevel: "info",
        },
        open: {
          badge: "🚛",
          color: "green",
          label: "Opened",
          logLevel: "info",
        },
      },
    });
  }

  /**
   * Returns a shortened version of the socket's ID (only first 4 characters)
   */
  shortId(): string {
    return this.id.slice(0, 4);
  }
}
