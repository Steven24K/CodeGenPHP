import { Optional } from "../utils/types"

export type AttributeType = 'TEXT' | "BOOLEAN" | "INT" | "FLOAT" | "TINYBLOB" | "TINYTEXT" | "MEDIUMTEXT" | "MEDIUMBLOB" | "LONGTEXT" | "LONGBLOB"
    | "VARCHAR" | "CHAR" | "BINARY" | "VARBINARY"
    | "ENUM" | "SET"
    | "PASSWORD" | "USERNAME"

// https://www.w3schools.com/sql/sql_datatypes.asp
export type Attribute = {
    type: AttributeType
    name: string
    size?: number
    list?: string[]
}



const defaultAttrubuteOptions:  Required<Optional<Attribute>> = {
    list: [],
    size: 50
}

export const mkAttribute = (name: string, type: AttributeType, options: Optional<Attribute> = defaultAttrubuteOptions): Attribute => ({
    name: name,
    type: type,

    ...defaultAttrubuteOptions,
    ...options
})