import Message from "../../classes/message.ts";
import Todo from "../../utils/thingsUtils/interfaces/Todo.ts";
import { executeXCallBackURL } from "../../utils/xcall/xCallUtils.ts";

export default async function func(message: Message, socket: WebSocket) {

    // Parse todo from message and validate it
    const todo = Todo.isTodo(message.data);
    if (todo.operation) throw new Error("Operation not supported");

    let id = todo.addToThings(Bun.env.STEALTH_MODE === "true");
    message.respond(socket, {success: true, thingsID: id});
}


