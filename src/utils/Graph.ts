import { Func, Identity } from "./Func"
import { none, Option, some } from "./Option"

type Matrix<T> = Option<T>[][]

const zeroMatrixValue = <T>(): Option<T> => none()

type Edge<a = any> = {
    fromIndex: number
    toIndex: number
    weight?: a
}

export const mkEdge = <a = any>(fromIndex: number, toIndex: number, weight?: a): Edge<a> => ({ fromIndex: fromIndex, toIndex: toIndex, weight: weight })

const isEdge = <T>(edge: Option<T>): boolean => edge.kind == 'some'

// I am just very proud of this logic, but the same can be done with Array(100).fill()
const createArray = <a>(init: a) => Func<number, Func<a[], a[]>>(n => Func<a[], a[]>(l => l.concat(init)).repeat().f(n))

const addNode = <T>(): Func<Matrix<T>, Matrix<T>> => Func(g => g.concat([Array(g.length).fill(none())]).map(m => m.concat(none<T>())))

const addNodes = <T>(n: number): Func<Matrix<T>, Matrix<T>> => addNode<T>().repeat().f(n)

const removeNode = <T>(): Func<number, Func<Matrix<T>, Matrix<T>>> => Func(i => Func(g => {
    return g.reduce((xs, x, indexX) => {

        // remove vertical row
        x = x.reduce((ys, y, indexY) => {
            if (indexY == i) {
                return ys
            }
            return ys.concat([y])
        }, Array<Option<T>>())

        // Remove horizontal row
        if (indexX == i) {
            return xs
        }
        return xs.concat([x])

    }, Array<Array<Option<T>>>())
}))

let removeNodes = <T>(): Func<number[], Func<Matrix<T>, Matrix<T>>> => Func(nodes => {
    return nodes.filter((a, b) => nodes.indexOf(a) == b).sort((a, b) => b - a)
        .map(node => removeNode<T>().f(node)).reduce((xs, x) => xs.then(x), Identity())
})

const getEdges = <T>(): Func<Matrix<T>, Edge[]> => Func(g => g.flatMap((row, rowIndex) => {
    return row.reduce((xs, x, columnIndex) => {
        if (isEdge(x)) {
            return xs.concat(mkEdge(rowIndex, columnIndex))
        }
        return xs
    }, Array<Edge>())
}))

const getEdgesFrom = <T>(fromIndex: number, G: Matrix<T>): Edge[] => G[fromIndex].reduce((xs, x, toIndex) => isEdge(x) ? xs.concat(mkEdge(fromIndex, toIndex)) : xs, Array<Edge>())
const getEdgesTo = <T>(toIndex: number, G: Matrix<T>): Edge[] => G.reduce((xs, x, fromIndex) => isEdge(x[toIndex]) ? xs.concat(mkEdge(fromIndex, toIndex)) : xs, Array<Edge>())

let removeEdge = <T>(): Func<Edge, Func<Matrix<T>, Matrix<T>>> => Func(edge => Func(g => {
    g[edge.fromIndex][edge.toIndex] = zeroMatrixValue()
    g[edge.toIndex][edge.fromIndex] = zeroMatrixValue()
    return g
}))

let removeEdges = <T>(): Func<Edge[], Func<Matrix<T>, Matrix<T>>> => Func(edges => {
    return edges.map(edge => removeEdge<T>().f(edge)).reduce((xs, x) => xs.then(x), Identity())
})

let addEdge = <T>(): Func<[T, Edge], Func<Matrix<T>, Matrix<T>>> => Func(value_edge => Func(G => {
    G[value_edge[1].fromIndex][value_edge[1].toIndex] = some(value_edge[0])
    if (value_edge[1].fromIndex != value_edge[1].toIndex) G[value_edge[1].toIndex][value_edge[1].fromIndex] = zeroMatrixValue()

    return G
}))


let addEdges = <T>(): Func<[T, Edge][], Func<Matrix<T>, Matrix<T>>> => Func(pairs => {
    return pairs.map(p => addEdge<T>().f(p)).reduce((xs, x) => xs.then(x), Identity())
})


const createGraph = <T>(size: number) => (init: Matrix<T>): Matrix<T> => addNodes<T>(size).f(init)

const initGraph = <T>(size: number): Matrix<T> => {
    return createGraph<T>(size)([])
}

export interface Graph<T> {
    G: Matrix<T>
    incr: (n?: number) => Graph<T>
    removeNode: (index: number) => Graph<T>
    removeNodes: (indices: number[]) => Graph<T>

    getEdge: (fromIndex: number, toIndex: number) => Edge
    getEdges: () => Edge[]
    setEdge: <a = any>(edge: Edge<a>, value: T) => Graph<T>
    setEdges: <a = any>(edges: [T, Edge][]) => Graph<T>
    removeEdge: (edge: Edge) => Graph<T>
    removeEdges: (edges: Edge[]) => Graph<T>

}

export const Graph = <T>(size = 0): Graph<T> => ({
    G: initGraph(size),

    incr: function (n = 1): Graph<T> {
        return ({ ...this, G: addNodes<T>(n).f(this.G) })
    },

    removeNode: function (index: number): Graph<T> {
        return ({ ...this, G: removeNode<T>().f(index).f(this.G) })
    },
    removeNodes: function (indices: number[]): Graph<T> {
        return ({ ...this, G: removeNodes<T>().f(indices).f(this.G) })
    },

    getEdge: function (fromIndex: number, toIndex: number): Edge {
        let value = this.G[fromIndex][toIndex]
        return mkEdge(fromIndex, toIndex, value.kind == 'none' ? undefined : value.v)
    },
    getEdges: function (): Edge[] {
        return getEdges().f(this.G)
    },
    setEdge: function <a = any>(edge: Edge<a>, value: T): Graph<T> {
        return ({ ...this, G: addEdge<T>().f([value, edge]).f(this.G) })
    },
    setEdges: function <a = any>(edges: [T, Edge<a>][]) {
        return ({ ...this, G: addEdges<T>().f(edges).f(this.G) })
    },
    removeEdge: function (edge: Edge) {
        return ({...this, G: removeEdge<T>().f(edge).f(this.G)})
    },
    removeEdges: function (edges: Edge[]) {
        return ({...this, G: removeEdges<T>().f(edges).f(this.G)})
    },
})

