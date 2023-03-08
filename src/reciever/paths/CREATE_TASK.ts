import Message from "../../classes/message.ts";
import Todo from "../../utils/thingsUtils/interfaces/Todo.ts";
import { executeXCallBackURL } from "../../utils/xcall/xCallUtils.ts";

export default async function func(message: Message, socket: WebSocket) {

    // Parse todo from message and validate it
    const todo = Todo.isTodo(message.data);
    if (todo.operation) throw new Error("Operation not supported");

    let responseFromThings: string[] = await executeXCallBackURL("things", "json", {data: [todo], reveal: false}).split(":");
    switch (responseFromThings[0]) {
        case "Timeout":
            throw new Error("Things timed out");
        case "Error":
            throw new Error(responseFromThings[1]);
        case "Success":
            let thingsID = responseFromThings[1].replace("x-things-id=", "").trim();
            message.respond(socket, {success: true, thingsID: thingsID});
        default:
            throw new Error("Unknown response from Things");
    }

}


