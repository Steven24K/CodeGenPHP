import { Pair } from "./Pair"

export class DropDownOptions<a> {
    defaultValue: a
    options: Array<Pair<string, a>>
    constructor(v: a, options: Array<Pair<string, a>>){
        this.defaultValue = v 
        this.options = options
    }
}