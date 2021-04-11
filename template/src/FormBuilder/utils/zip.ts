import { Pair } from "./Pair"

export let zip = <T, U>(l1: T[], l2: U[]): Array<Pair<T, U>> => {
    if (l1.length != l2.length) {
        throw 'Zip(): Not equal lenght exception'
    } else if (l1.length == 0 && l2.length == 0) {
        return []
    } else {
        let v1 = l1.pop()
        let v2 = l2.pop()
        if (v1 != undefined && v2 != undefined) {
            return zip(l1, l2).concat([Pair(v1, v2)])
        } else {
            throw 'Zip(): Value undefined exception'
        }

    }
}