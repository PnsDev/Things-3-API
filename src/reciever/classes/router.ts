import Message from "../../types/message.ts";

export default class Router {
    private paths: Map<string, (socke: WebSocket, message: string) => void> = new Map();

    constructor() {
        // TODO: Auto add paths
        this.paths.set("get", require("./paths/get"));
    }

    public route(socket: WebSocket, message: Message) {
        const func = this.paths.get(message.method.toLowerCase());
        if (func) return func(socket, message.data);
        // TODO: Handle invalid method
    }
}