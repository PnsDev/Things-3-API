import { When } from "../enums.ts";
import { isDateStr, isDateTimeStr } from "../propertyValidators.ts";
import ChecklistItem from "./ChecklistItem.ts";

export default class Todo {
    readonly type: string = "to-do"; // "to-do"
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