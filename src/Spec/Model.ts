import { List, Map } from "immutable"
import { Optional } from "../utils/types"
import { Attribute } from "./Attribute"
import { Permission } from "./Permission"

export interface Model {
    name: string
    attributes: Map<string, Attribute>
    permissions: Permission
    seeds: object[]

    can_login?: boolean

    addAttributes: (...attr: Attribute[]) => Model
    addPermission: (kind: keyof Permission, ...permissions: string[]) => Model
    addSeeds: (...seeds: object[]) => Model
}

const defaultModelOptions: Required<Optional<Model>> = {
    can_login: false,
}

export const mkModel = (name: string, options: Optional<Model> = defaultModelOptions): Model => ({
    name: name,
    attributes: Map(),
    permissions: {
        create: List(),
        read: List(),
        update: List(),
        delete: List()
    },
    seeds: [],

    ...defaultModelOptions,
    ...options,

    addAttributes: function (...attr: Attribute[]): Model {
        attr.forEach(a => {
            if (this.attributes.has(a.name)) {
                console.log(`Attrubute ${a.name} does allready exist on ${this.name}`)
            } else {
                console.log(`attribute ${a.name} added to ${this.name}`)
                this.attributes = this.attributes.set(a.name, a)
            }
        })
        return this
    },

    addPermission: function (kind: keyof Permission, ...permissions: string[]): Model {
        return ({
            ...this, permissions: {
                ...this.permissions,
                [kind]: this.permissions[kind].concat(permissions.reduce((xs, x) => this.permissions[kind].contains(x) ? xs : xs.concat(x), List<string>()))
            }
        })
    },

    addSeeds: function (...seeds: object[]): Model {
        return ({
            ...this, seeds: this.seeds.concat(seeds)
        })
    }
})