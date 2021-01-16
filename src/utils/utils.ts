import { Attribute } from "../Spec/Attribute"
import { Fun } from "./types"

export let isStringLike: Fun<Attribute, boolean> = a => a.type == 'TEXT' || a.type == 'CHAR' || a.type == 'LONGTEXT' || a.type == 'MEDIUMTEXT'
    || a.type == 'PASSWORD' || a.type == 'TINYTEXT' || a.type == 'VARCHAR' || a.type == "USERNAME"
export let shouldBeEncrypted: Fun<Attribute, boolean> = a => a.type == 'PASSWORD'