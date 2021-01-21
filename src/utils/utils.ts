import { Chance } from "chance"
import { Attribute } from "../Spec/Attribute"
import { Fun } from "./types"


export let isStringLike: Fun<Attribute, boolean> = a => a.type == 'TEXT' || a.type == 'CHAR' || a.type == 'LONGTEXT' || a.type == 'MEDIUMTEXT'
    || a.type == 'PASSWORD' || a.type == 'TINYTEXT' || a.type == 'VARCHAR' || a.type == "USERNAME"

export let shouldBeEncrypted: Fun<Attribute, boolean> = a => a.type == 'PASSWORD'

export let mk_random_attr_value: Fun<Attribute, string | number | boolean | null> = attr => {
    let chance = Chance() // To randomly seed the database with chance.js (https://chancejs.com/index.html)
    return isStringLike(attr) ? chance.word() :
    attr.type == 'BOOLEAN' ? chance.bool() : 
    attr.type == 'INT' ? chance.integer({min: 0, max: 2000}) : 
    attr.type == 'FLOAT' ? chance.floating({min: 0, max: 2000}) : 
    attr.type == 'BINARY' ? chance.integer({max: 1, min: 0}) : null
}
