import { Chance } from "chance"
import { Attribute, AttributeType } from "../Spec/Attribute"
import { Fun } from "./types"

let isStringLike_AUX: Fun<AttributeType, boolean> = a =>  a == 'TEXT' || a == 'CHAR' || a == 'LONGTEXT' || a == 'MEDIUMTEXT'
|| a == 'PASSWORD' || a == 'TINYTEXT' || a == 'VARCHAR' || a == "USERNAME"

export let isStringLike: Fun<Attribute, boolean> = a => isStringLike_AUX(a.type)

export let shouldBeEncrypted: Fun<Attribute, boolean> = a => a.type == 'PASSWORD'

export let mk_random_attr_value: Fun<Attribute, string | number | boolean | null> = attr => {
    let chance = Chance() // To randomly seed the database with chance.js (https://chancejs.com/index.html)
    return isStringLike(attr) ? chance.word() :
    attr.type == 'BOOLEAN' ? chance.bool() : 
    attr.type == 'INT' ? chance.integer({min: 0, max: 2000}) : 
    attr.type == 'FLOAT' ? chance.floating({min: 0, max: 2000}) : 
    attr.type == 'BINARY' ? chance.integer({max: 1, min: 0}) : null
}


export const SqlType_to_typescript_type = (t: AttributeType): 'number' | 'string' | 'boolean' => {
    if (isStringLike_AUX(t)) return 'string' 
    if (t == 'INT' || t == 'FLOAT' || t == 'BINARY') return 'number'
    return 'boolean'
}

export const type_to_default_value = (t: AttributeType): string => {
    if (isStringLike_AUX(t)) return '""'
    if (t == 'INT' || t == 'FLOAT' || t == 'BINARY') return '0'
    return 'false'
}