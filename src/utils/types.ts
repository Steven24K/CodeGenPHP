import { RelationSort } from "../Spec/Relation"
import { Option } from "./Option"

export type Fun<a, b> = (_: a) => b

export type Action<a> = Fun<a, a>

export type Pair<a,b> = [a, b]

export type OptionalKeys<T> = { [K in keyof T]-?:
    ({} extends { [P in K]: T[K] } ? K : never)
}[keyof T]

export type Optional<T> = Pick<T, OptionalKeys<T>>

export type NodeType = {
    relation: Option<RelationSort>
}