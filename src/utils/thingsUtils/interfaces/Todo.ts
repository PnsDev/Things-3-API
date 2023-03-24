import { writeFile } from "fs/promises";
import { executeXCallBackURL, generateCallBackURL } from "../../xcall/xCallUtils.ts";
import { When } from "../enums.ts";
import { isDateStr, isDateTimeStr } from "../propertyValidators.ts";
import ChecklistItem from "./ChecklistItem.ts";
import * as exec from "async-exec";

export default class Todo {
    readonly type: string = "to-do"; // "to-do"
    operation?: string;
    attributes: {
        title: string;
        notes?: string;
        when?: string; // TODO: support date
        deadline?: string; // TODO: support date
        tags?: string[];
        checklist_items?: ChecklistItem[];
        list_id?: string; // TODO: support lists to make sure it's a valid list
        completed?: boolean;
        canceled?: boolean;
        // creation_date?: string; // TODO: support date
        // completion_date?: string; // TODO: support date

    }

    private constructor(json: any) {
        this.attributes = json.attributes;
        // This might load more attributes than we want but it doesn't seem to be a problem
    }

    /**
     * Adds the Todo to Things
     * @param stealth If true, it will be added to things through a shortcut without opening the app
     * @returns Returns the ID of the Todo if it was added to Things
     */
    async addToThings(stealth: boolean = false): Promise<string> {
        let url = generateCallBackURL("things", "json", {data: [this]});
        if (!stealth) {
            let res: string[] = (await executeXCallBackURL(url)).split(": ");
            if (res[0] !== "Success" || !res[1].startsWith("x-things-ids=")) throw new Error(res[1]);
            return res[1].replace("x-things-ids=", "");
        }
        //TODO: add some sort of schedule system
        await writeFile("/Users/jcasas/Library/Caches/dev.pns/url.txt", url);
        // @ts-ignore
        let res = exec.default(`shortcuts run "Things 3 API Stealth Mode" -i /Users/jcasas/Library/Caches/dev.pns/url.txt ; echo "Done"`);
        //TODO: grab id from DB
        return res;
    }
    
    static isTodo(object: any): Todo {
        if (!object.attributes) throw new Error("Invalid attributes");
        if (!object.attributes.title || typeof object.attributes.title !== "string") throw new Error("Invalid title");

        if (object.attributes.notes && typeof object.attributes.notes !== "string") throw new Error("Invalid notes attribute");
        if (object.attributes.when && (
            typeof object.attributes.when !== "string" || (
            !(object.attributes.when.toUpperCase() in When) && !isDateTimeStr(object.attributes.when)
        ))) throw new Error("Invalid when attribute");

        if (object.attributes.deadline && !isDateStr(object.attributes.deadline)) throw new Error("Invalid deadline attribute");
        if (object.attributes.tags && !Array.isArray(object.attributes.tags) && object.attributes.tags.every((tag: any) => typeof tag !== "string")) throw new Error("Invalid tags attribute");
        if (object.attributes.checklist_items) {
            if (!Array.isArray(object.attributes.checklist_items)) throw new Error("Invalid checklist-items attribute");
            // Remap the checklist items
            object.attributes.checklist_items = object.attributes.checklist_items.map((item: any) => ChecklistItem.isChecklistItem(item));
        }

        if (object.attributes.list_id && typeof object.attributes.list_id !== "string") throw new Error("Invalid list-id attribute");
        if (object.attributes.completed && typeof object.attributes.completed !== "boolean") throw new Error("Invalid completed attribute");
        if (object.attributes.canceled && typeof object.attributes.canceled !== "boolean") throw new Error("Invalid canceled attribute");
    
        return new Todo(object);
    }
}