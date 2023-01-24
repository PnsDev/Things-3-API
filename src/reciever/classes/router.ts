import Message from "../../classes/message.ts";
import { goBackDir, iterateDir } from "../../utils/miscUtils.ts";
import chalk from 'chalk';

export default class Router {
    private paths: Map<string, (socket: WebSocket, message: string) => void> = new Map();

    constructor() {
        console.log('Initializing router...');
        this.loadPaths();
        console.log('Router initialized!')
    }

    public route(socket: WebSocket, message: Message) {
        const func = this.paths.get(message.method.toLowerCase());
        if (func) return func(socket, message.data);
        // TODO: Handle invalid method
    }




    /**
     * Loads all the paths from the paths folder
     */
    private loadPaths() {
        if (this.paths.size != 0) return; // Don't load paths if they're already loaded

        const routerPathsDir = goBackDir(import.meta.dir, 1) + '/paths';
        iterateDir(routerPathsDir).forEach((path: String) => {
            // Create pretty name for the route
            const pathName = path.replace(routerPathsDir, '').split('.')[0].toLocaleLowerCase();
            console.log('');
            process.stdout.write(`[${chalk.yellowBright('LOAD')}] Loading API route: ${pathName}`);
    
            try {
                // Import the route file
                const route: (socket: WebSocket, message: string) => void | undefined = require(path + '').default;
                if (route === undefined) return process.stdout.write(`\r[${chalk.blueBright('SKIP')}] Skipped router path: ${pathName}`);
    
                // Save the route
                this.paths.set(pathName, route);
                process.stdout.write(`\r[${chalk.greenBright('OK')}] Loaded router path: ${pathName}                      `);
            } catch (ex) {
                // Log failure
                process.stdout.write(`\r[${chalk.redBright('ERR')}] Failed to load router path: ${pathName}               `);
                console.log('\n' + ex);
            }
        });
    }
}