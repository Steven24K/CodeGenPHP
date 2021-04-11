export type Option<T> = {
    kind: 'none'
} | {
    kind: 'some'
    value: T
}


export const None = <T>(): Option<T> => ({
    kind: 'none'
})

export const Some = <T>(v: T): Option<T> => ({
    kind: 'some', 
    value: v
})