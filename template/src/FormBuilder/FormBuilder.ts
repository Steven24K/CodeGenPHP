import { Func } from "./utils/Func"
import { Pair } from "./utils/Pair"
import { Unit } from "./types/Unit"
import { FilterType } from "./types/FilterType"
import { ArrayType } from "./types/ArrayType"
import { ChangeType } from "./types/ChangeType"
import { createArray } from "./utils/createArray"
import { omitMany, omitOne } from "./utils/Omit"
import { pickMany } from "./utils/Pick"
import { zip } from "./utils/zip"
import { FormField } from "./types/FormField"
import { createFormFields } from "./utils/createFormfields"

export interface FormBuilder {
    Entity: <T1, T2, TResult>(data: T1, q: Func<InitialFormSelector<T1>, FormSelector<T2, TResult>>) => Renderer<TResult>

    Entities: <T1, T2, TResult>(data: T1[], q: Func<InitialFormSelector<T1>, FormSelector<T2, TResult>>) => Renderer<TResult>
}

export let FormBuilder: FormBuilder = ({
    Entity: function <T1, T2, TResult>(data: T1, q: Func<InitialFormSelector<T1>, FormSelector<T2, TResult>>): Renderer<TResult> {
        let result = q.f(InitialFormSelector([data]))
        return Renderer(result.data.Second)
    }, 

    Entities: function<T1, T2, TResult>(data: T1[], q: Func<InitialFormSelector<T1>, FormSelector<T2, TResult>>): Renderer<TResult> {
        let result = q.f(InitialFormSelector(data))
        return Renderer(result.data.Second)
    }
})

export type Data<T, U> = Pair<T[], U[]>

export interface InitialFormSelector<T> {
    data: Data<T, Unit>

    Select: <K extends keyof T>(...properties: K[]) => FormSelector<Omit<T, K>, Pick<T, K>>
}

export interface FormSelector<T, U> {
    data: Data<T, U>

    // Selects some fields in the object
    Select: <K extends keyof T>(...properties: K[]) => FormSelector<Omit<T, K>, Pick<T, K> & U>

    // UnSelects some selected properties, the opposite of Select
    UnSelect: <K extends keyof U>(...properties: K[]) => FormSelector<Pick<U, K> & T, Omit<U, K>>

    // Selects nested fields in the object and als Select attributes in the nested field
    Children: <K extends FilterType<T, Array<Object>>, t2, TResult>(
        child: K,
        q: Func<InitialFormSelector<ArrayType<T[K]>>, FormSelector<t2, TResult>>
    ) => FormSelector<Omit<T, K>, U & { [key in K]: Array<TResult> }>

    // Selects nested fields in the object, simular to Children, but this method works for single objects
    ChildrenObject: <K extends FilterType<T, Object>, t2, TResult>(
        child: K,
        q: Func<InitialFormSelector<T[K]>, FormSelector<t2, TResult>>
    ) => FormSelector<Omit<T, K>, U & { [key in K]: TResult }>

    // Change the default value to any value of any type
    AssignAny: <K extends keyof U, A>(property: K, new_value: A) => FormSelector<T, ChangeType<U, A, K>>

    // Change the default value, to the same type
    Assign: <K extends keyof U>(property: K, new_value: U[K]) => FormSelector<T, U>

    // Change the value for only a specific property 
    AssignWhere: <K extends keyof U>(property: K, value: U[K], condition: Func<U, boolean>) => FormSelector<T, U>
}


export let InitialFormSelector = <T>(e: T[]): InitialFormSelector<T> => ({
    data: Pair(e, createArray(e.length)),

    Select: function <K extends keyof T>(this: InitialFormSelector<T>, ...properties: K[]): FormSelector<Omit<T, K>, Pick<T, K>> {
        return FormSelector(this.data.map(
            fst => fst.map(entry => omitMany(entry, properties)),
            snd => zip(snd, this.data.First.map(entry => pickMany(entry, properties))).map(p => ({ ...p.First, ...p.Second }))
        ))
    }
})

export let FormSelector = <T, U>(e: Data<T, U>): FormSelector<T, U> => ({
    data: e,

    Select: function <K extends keyof T>(...properties: K[]): FormSelector<Omit<T, K>, Pick<T, K> & U> {
        return FormSelector(this.data.map(
            fst => fst.map(entry => omitMany(entry, properties)),
            snd => zip(snd, this.data.First.map(entry => pickMany(entry, properties))).map(p => ({ ...p.First, ...p.Second }))
        ))
    },

    UnSelect: function <K extends keyof U>(...properties: K[]): FormSelector<Pick<U, K> & T, Omit<U, K>> {
        return FormSelector(this.data.map(
            fst => zip(fst, this.data.Second.map(entry => pickMany(entry, properties))).map(p => ({ ...p.First, ...p.Second })),
            snd => snd.map(entry => omitMany(entry, properties))
        ))
    },

    Children: function <K extends FilterType<T, Array<Object>>, t1, t2, TResult>(
        child: K,
        q: Func<InitialFormSelector<ArrayType<T[K]>>, FormSelector<t2, TResult>>
    ): FormSelector<Omit<T, K>, U & { [key in K]: Array<TResult> }> {
        return FormSelector(this.data.map(
            fst => fst.map(entry => omitOne(entry, child)),
            snd => zip(snd, this.data.First.map(entry =>
                ({ [child]: q.f(InitialFormSelector(entry[child])).data.Second })))
                .reverse()
                .map(p => ({ ...p.First, ...p.Second })) as any
        ))
    },

    ChildrenObject: function <K extends FilterType<T, Object>, t2, TResult>(
        child: K,
        q: Func<InitialFormSelector<T[K]>, FormSelector<t2, TResult>>
    ): FormSelector<Omit<T, K>, U & { [key in K]: TResult }> {
        return FormSelector(this.data.map(
            fst => fst.map(entry => omitOne(entry, child)), 
            snd => zip(snd, this.data.First.map(entry => 
                ({ [child]: q.f(InitialFormSelector([entry[child]])).data.Second[0]})))
                .reverse()
                .map(p => ({...p.First, ...p.Second})) as any
        ))
    },

    AssignAny: function <K extends keyof U, A>(property: K, new_value: A): FormSelector<T, ChangeType<U, A, K>> {
        return FormSelector(this.data.mapRight(snd => snd.map(e => (<ChangeType<U, A, K>>{ ...e, [property]: new_value }))))
    },

    Assign: function <K extends keyof U>(property: K, new_value: U[K]): FormSelector<T, U> {
        return FormSelector(this.data.mapRight(snd => snd.map(e => (<U>{ ...e, [property]: new_value }))))
    },

    AssignWhere: function <K extends keyof U>(property: K, value: U[K], condition: Func<U, boolean>): FormSelector<T, U> {
        return FormSelector(this.data.mapRight(snd => snd.reduce((xs, x) => {
            if (condition.f(x)) {
                return xs.concat({ ...x, [property]: value })
            } else {
                return xs.concat(x)
            }
        }, Array<U>())))
    },



})


// This will be responsible for rendering the form, can be pas to a react component
export interface Renderer<T> {
    data: T[]
    // TODO: Make the form renderer 
    /**
     * Attributes: 
     * - Data 
     * - formfields 
     * - renderoptions {
     *    customValues 
     *    custumOptions 
     *    custumFields
     * }
     */
    getFields: () => FormField[]

}

let Renderer = <T>(d: T[]): Renderer<T> => ({
    data: d,
    getFields: function (): FormField[] {
        return createFormFields(this.data)
    }
})


// Example 

// let form = FormBuilder.Entity(DefaultSpec, Func(q => q
//     .Select('project_name')
//     .Select('colors')

//     .Children('models', Func(q => q
//         .Select('name').Select('type')

//     ))
// ))