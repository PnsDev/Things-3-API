import { isDateTimeStr, isIsoDate } from "../../utils/thingsUtils/propertyValidators.ts";

interface Contents { 
    title: string;
    notes?: string;
    when?: string;
    deadline?: string;

}

enum When {
    TODAY = "today",
    TOMORROW = "tomorrow",
    EVENING = "evening",
    ANYTIME = "anytime",
    SOMEDAY = "someday"
}

export default function func(message: Contents, socket?: WebSocket) {


    // Validate message.when to assure (message.when in When or isIsoDate() or isDateTimeStr())
    if (message.when) { // Validate message.when to assure
        if (!(message.when in When) &&
            !isIsoDate(message.when) &&
            !isDateTimeStr(message.when)
        ) throw new Error("Invalid when property");
    }

    if (message.deadline && !isDateTimeStr(message.deadline)) throw new Error("Invalid deadline property");


    let test = {
        type: "to-do",
        attibutes: message as Contents,
    }

}


