import { DropDownOptions } from "../utils/DropdownOptions"


export type FormType = 'text' | 'number' | 'checkbox' | 'select' | 'date' | 'nestedList' | 'primitiveList' | 'form' | 'nestedObject' | 'color' | 'none'

export type FormField = {
    type: 'text'
    name: string
    index: number
} | {
    type: 'number'
    name: string
    index: number
} | {
    type: 'checkbox'
    name: string
    index: number
} | {
    type: 'none'
    name: string
    index: number
} | {
    type: 'form'
    name: string
    index: number
    fields: FormField[]
} | {
    type: 'nestedObject'
    name: string
    index: number
    fields: FormField[]
} | {
    type: 'color'
    name: string
    index: number
} | {
    type: 'select'
    name: string
    index: number
    options: DropDownOptions<any>
} | {
    type: 'primitiveList'
    name: string
    index: number
} | {
    type: 'date'
    name: string
    index: number
} | {
    type: 'nestedList'
    name: string
    index: number
    lists: any[][]
}

// export type FormType = 'text' | 'select' | 'number' | 'checkbox' | 'form'

// export type FormField = ({
//     type: 'text'
//     value: string
// } | {
//     type: 'select'
//     options: string[]
//     value: string
// } | {
//     type: 'number'
//     value: number
// } | {
//     type: 'checkbox'
//     value: boolean
// } | {
//     type: 'form'
//     fields: FormField[]
// }) & {
//     name: string
//     label: string
//     index: number
// }