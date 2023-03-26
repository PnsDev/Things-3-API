import * as dotenv from 'dotenv'
import { WebServer } from "./classes/webServer.ts";

dotenv.config({ path: './src/bridge/.env' });

const server = new WebServer();