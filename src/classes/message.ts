const aes256 = require("aes256");

export default class Message {
    ID: string;
    method: MessageMethod;
    data?: any;

    constructor(json: any) {
        this.ID = json.ID;
        this.method = json.method;
        this.data = json.data;

        // Validate to make sure all fields are present
        if (!this.ID || !this.method) throw new Error("Invalid message");
    }

    public static fromJSON(json: string): Message {
        // wtf is this
        return new Message(JSON.parse(JSON.parse(json)));
    }

    public toJSON(): string {
        return JSON.stringify({
            ID: this.ID,
            method: this.method,
            data: this.data,
        });
    }

    public respond(socket: WebSocket, data: any) {
        const message = new Message({
            ID: this.ID,
            method: MessageMethod.RESPONSE,
            data: data,
        });
        let json = message.toJSON();

        // Encrypt the message and send
        socket.send(aes256.encrypt(Bun.env.SECRET, json));
    }
}

export enum MessageMethod {
    GET_TASK, //GET_PROJECT, GET_AREA,
    UPDATE_TASK, //UPDATE_PROJECT, UPDATE_AREA,
    CREATE_TASK, //CREATE_PROJECT, CREATE_AREA,
    DELETE_TASK, //DELETE_PROJECT, DELETE_AREA
    AUTH,
    RESPONSE,
    PING,
    PONG
};