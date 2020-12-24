import { List } from "immutable";

export interface Permission {
    create: List<string>
    read: List<string>
    update: List<string>
    delete: List<string>
}