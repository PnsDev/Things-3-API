import Reciever from "./classes/reciever.ts";

const websocketURL = Bun.env.WS_URL;
if (websocketURL == undefined) process.exit(1);

const reciever = new Reciever(websocketURL != undefined ? websocketURL : "");
