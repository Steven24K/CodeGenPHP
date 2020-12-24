import { List } from "immutable"
import { Permission } from "./Permission"

export type RelationSort = '1-1' | '1-N' | 'N-N'

export interface Relation {
    source: string
    target: string
    sort: RelationSort
    permissions: Permission

    addPermission: (kind: keyof Permission, ...permissions: string[]) => Relation
}

export const mkRelation = (src: string, trgt: string, sort: RelationSort): Relation => ({
    source: src,
    target: trgt,
    sort: sort,
    permissions: {
        create: List(),
        read: List(),
        update: List(),
        delete: List()
    },

    addPermission: function (kind: keyof Permission, ...permissions: string[]): Relation {
        return ({
            ...this, permissions: {
                ...this.permissions,
                [kind]: this.permissions[kind].concat(permissions.reduce((xs, x) => this.permissions[kind].contains(x) ? xs : xs.concat(x), List<string>()))
            }
        })
    }
})