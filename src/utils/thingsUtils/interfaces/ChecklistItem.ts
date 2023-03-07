export default class ChecklistItem {
    readonly type: string = "checklist-item";
    attributes: {
        title: string;
        completed?: boolean;
        canceled?: boolean;
    }

    private constructor(json: any) {
        this.attributes = json;
        // This might load more attributes than we want but it doesn't seem to be a problem
    }

    static isChecklistItem(object: any): ChecklistItem {
        if (!object) throw new Error("Invalid attributes");
        if (!object.title || typeof object.title !== "string") throw new Error("Invalid title");

        // Validate optional attributes
        if (object.completed && typeof object.completed !== "boolean") throw new Error("Invalid completed attribute");
        if (object.canceled && typeof object.canceled !== "boolean") throw new Error("Invalid canceled attribute");

        return new ChecklistItem(object);
    }
}