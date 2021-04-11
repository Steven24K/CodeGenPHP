import { FilterType } from './FilterType'

export type PickIf<T, Condition> = Pick<T, FilterType<T, Condition>>