export type FilterType<T, Condition> = {
    // Set all types that match the Condition to the value of the field (i.e. name: "name")
    // Else set the type to never
    [K in keyof T]: T[K] extends Condition ? K : never
}[keyof T] // Selects all the types of all the keys except for never