import { FormType } from "../types/FormField"
import { DropDownOptions } from "./DropdownOptions"

export let formTypeSelector = <a>(key: string, attr: a): FormType => {
    if (attr === null) {
        return "text"
    } else if (key.toLowerCase().includes('color') && typeof attr != 'object') {
        return "color"
    } else if (typeof attr === "number") {
        return "number"
    } else if (typeof attr === "string") {
        return "text"
    } else if (typeof attr === "boolean") {
        return 'checkbox'
    } else if (attr instanceof Date) {
        return 'date'
    } else if (attr instanceof Array && typeof attr[0] !== "object") {
        return 'primitiveList'
    } else if (attr instanceof Array && attr[0] instanceof Array) {
        return 'nestedList'
    } else if (attr instanceof Array && typeof attr[0] === "object" && !(attr[0] instanceof Array)) {
        return 'form'
    } else if (attr instanceof DropDownOptions) {
        return 'select'
    } else if (typeof attr === "object") {
        return 'nestedObject'
    } else {
        return 'none'
    }
}


