export type Option<a> = {
    kind: 'some'
    v: a
} | {
    kind: 'none'
}

export const some = <a>(v: a): Option<a> => ({ kind: 'some', v: v })
export const none = <a>(): Option<a> => ({ kind: 'none' })