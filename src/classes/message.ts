export default class Message {
    ID: string;
    method: string;
    data?: any;

    constructor(json: any) {
        this.ID = json.ID;
        this.method = json.method;
        this.data = json.data;

        // Validate to make sure all fields are present
        if (!this.ID || !this.method) throw new Error("Invalid message");
    }

    public static fromJSON(json: string): Message {
        return new Message(JSON.parse(json));
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
            method: "Response",
            data: data,
        });

        socket.send(message.toJSON());
    }
}