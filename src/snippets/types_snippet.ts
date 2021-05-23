import { Application } from "../Spec/Application";
import { Snippet } from "../utils/types";

export const adminData_snippet = (app: Application): Snippet => {
    let models = app.models.toIndexedSeq().toArray()

    return ({
        name: 'src/components/AdminFrontend/AdminData.ts', 
        content: `
        import { AppState } from "../../AppState";
        import { AsyncState, FormState, EditStateMachine, none, Option, unloadedAsyncState, FormKinds } from "../../utils";

${models.reduce((xs, x) => xs + `


import { ${x.name} } from "../../models/${x.name}";
import { Default${x.name} } from "../${x.name}/Default${x.name}";

// ${x.name} 

export interface ${x.name}EntityData {
    kind: '${x.name}'
    ${x.name}s: AsyncState<${x.name}[]>
    current${x.name}: {
        data: AsyncState<${x.name}>
        kind: EditStateMachine
    }
    ${x.name}Form: FormState<${x.name}>
    ${x.name}ToDelete: Option<${x.name}>
}
export const zero${x.name}EntityData = (): ${x.name}EntityData => ({
    kind: '${x.name}',
    ${x.name}s: unloadedAsyncState(),
    current${x.name}: {
        data: unloadedAsyncState(),
        kind: 'idle'
    },
    ${x.name}Form: { kind: 'unsubmitted', data: Default${x.name}() },
    ${x.name}ToDelete: none()
})

export const set_${x.name}s = (new_${x.name}: AsyncState<${x.name}[]>) => (s: AppState): AppState => {
    if (s.page.kind != 'admin') return s
    if (s.page.entityData.kind != '${x.name}') return s
    return ({
        ...s, page: {
            ...s.page, entityData: {
                ...s.page.entityData,
                ${x.name}s: new_${x.name},
            }
        }
    })
}

export const setCurrent_${x.name} = (new_${x.name}: AsyncState<${x.name}>, editState?: EditStateMachine) => (s: AppState): AppState => {
    if (s.page.kind != 'admin') return s
    if (s.page.entityData.kind != '${x.name}') return s
    return ({
        ...s, page: {
            ...s.page, entityData: {
                ...s.page.entityData,
                current${x.name}: {
                    data: new_${x.name},
                    kind: editState ? editState : s.page.entityData.current${x.name}.kind
                }
            }
        }
    })
}


`, "")}



//All entities in one discriminated union
export type EntityData = ${models.reduce((xs, x) => xs + `${x.name}EntityData\n |`, "")}
     { kind: 'no-entity' }

export const zeroEntityData = (): EntityData => ({
    kind: 'no-entity'
})
        `
    })
}