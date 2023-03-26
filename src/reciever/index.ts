import * as dotenv from 'dotenv'
import Reciever from "./classes/reciever.ts";

dotenv.config({ path: './src/reciever/.env' });

const websocketURL = Bun.env.WS_URL;
if (websocketURL == undefined) process.exit(1);

console.log("Starting reciever...");

const reciever = new Reciever(websocketURL != undefined ? websocketURL : "");
