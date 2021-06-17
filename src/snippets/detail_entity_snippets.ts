import { Model } from "../Spec/Model";
import { Snippet } from "../utils/types";
import { type_to_default_value } from "../utils/utils";



export const DefaultEntity_snippet = (model: Model): Snippet => {
    let attrs = model.attributes.toIndexedSeq().toArray()
    return {
        name: `src/components/${model.name}/Default${model.name}.ts`, 
        content: `
        import { ${model.name} } from "../../models/${model.name}";

export const Default${model.name} = (): ${model.name} => ({
    Id: -1, 
    ${attrs.reduce((xs, x) => xs + `${x.name}: ${type_to_default_value(x.type)},\n` , "")}
})
        `
    }
}


export const EntityApi_snippet = (model: Model): Snippet => {
    return {
        name: `src/components/${model.name}/${model.name}.api.ts`, 
        content: `
        import { API_VERSION, ORIGIN } from "../../constants";
import { ${model.name} } from "../../models/${model.name}";
import { HttpResult } from "../../utils";

export const get_${model.name}s = (): Promise<HttpResult<${model.name}[]>> =>
    fetch(ORIGIN + "/api/" + API_VERSION + "/${model.name}/Get.php")
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response.statusText)
        })
        .then(data => (<HttpResult<${model.name}[]>>{ kind: 'result', status: data._status, value: data._value }))
        .catch(reason => {
            console.log(reason)
            return ({ kind: 'failed', status: 500 })
        })

export const get${model.name}ById = (id: number): Promise<HttpResult<${model.name}>> =>
    fetch(ORIGIN + "/api/" + API_VERSION + "/${model.name}/Get.php?Id=" + id)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response.statusText)
        })
        .then(data => (<HttpResult<${model.name}>>{ kind: 'result', status: data._status, value: data._value }))
        .catch(reason => {
            console.log(reason)
            return ({ kind: 'failed', status: 500 })
        })

export const create${model.name} = (body: Omit<${model.name}, 'Id'>): Promise<number> =>
    fetch(ORIGIN + "/api/" + API_VERSION + "/${model.name}/Create.php", {
        body: JSON.stringify(body),
        method: 'post',
        mode: 'cors'
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response.statusText)
        })
        .then(data => data._status)
        .catch(reason => {
            console.log(reason)
            return -1
        })

export const update${model.name} = (body: ${model.name}): Promise<number> =>
    fetch(ORIGIN + "/api/" + API_VERSION + "/${model.name}/Update.php", {
        body: JSON.stringify(body),
        method: 'put',
        mode: 'cors'
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response.statusText)
        })
        .then(data => data._status)
        .catch(reason => {
            console.log(reason)
            return -1
        })

export const delete${model.name} = (id: number): Promise<any> =>
    fetch(ORIGIN + "/api/" + API_VERSION + "/${model.name}/Delete.php?Id=" + id, {
        method: 'delete',
        mode: 'cors'
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response.statusText)
        })
        .then(data => data._value)
        .catch(reason => {
            console.log(reason)
            return -1
        })
        `
    }
}

export const EntityDetailComponent_snippet = (model: Model): Snippet => {
    let attrs = model.attributes.toIndexedSeq().toArray()
    return {
        name: `src/components/${model.name}/Detail${model.name}.tsx`, 
        content: `
        import * as React from "react"
import { NavLink } from "react-router-dom"
import { IAppState } from "../../AppState"
import { ${model.name} } from "../../models/${model.name}"
import { loadingAsyncState } from "../../utils"
import { setCurrent_${model.name} } from "../AdminFrontend/AdminData"
import { AsyncLoader } from "../shared/AsyncLoader"
import { get${model.name}ById } from "./${model.name}.api"

interface ${model.name}DetailProps extends IAppState {

}

export const Detail${model.name} = (props: ${model.name}DetailProps) => {
    if (props.appState.page.kind != 'admin') return <div></div>
    if (props.appState.page.entityData.kind != '${model.name}') return <div></div>

    if (props.appState.page.entityData.current${model.name}.data.kind == 'unloaded') {
        props.setState(setCurrent_${model.name}(loadingAsyncState(() => get${model.name}ById(Number(props.route.match.params.id)))))
    }

    let current_permission = props.appState.page.sidePanelState.get('${model.name}')
    
    return <div>
        <div>
            {
                current_permission && current_permission.can_edit && props.route.match.params.id &&
                <NavLink className="btn btn-primary" to={"/admin/${model.name}/edit/" + props.route.match.params.id}>Edit ${model.name}</NavLink>
            }
        </div>
        <AsyncLoader<${model.name}> async={props.appState.page.entityData.current${model.name}.data}
            onLoad={res => props.setState(setCurrent_${model.name}(res))}>
            {props.appState.page.entityData.current${model.name}.data.kind == 'loaded' &&
                <div>
                    <h1>Details for ${model.name}: {props.appState.page.entityData.current${model.name}.data.value.Id}</h1>

                    <ul>
                        <li><b>Id: </b>{props.appState.page.entityData.current${model.name}.data.value.Id}</li>
                        ${attrs.reduce((xs, x) => xs + `<li><b>${x.name}: </b>{props.appState.page.entityData.current${model.name}.data.value.${x.name}}</li>\n`, "")}
                    </ul>
                </div>}
        </AsyncLoader>
    </div>


}
        `
    }
}


export const EntityFormComponent_snippet = (model: Model): Snippet => {
    let attrs_selected = model.attributes.remove('Id').toIndexedSeq().toArray().reduce((xs, x) => xs + ` '${x.name}', `, "")
    return {
        name: `src/components/${model.name}/Form${model.name}.tsx`, 
        content: `
        import * as React from "react"
import { NavLink } from "react-router-dom";
import { AppState, IAppState } from "../../AppState";
import FormMaster from "../../FormBuilder/components/FormMaster";
import { Func } from "../../FormBuilder/utils/Func";
import { omitOne } from "../../FormBuilder/utils/Omit";
import { ${model.name} } from "../../models/${model.name}";
import { loadedAsyncState, loadingAsyncState, unloadedAsyncState } from "../../utils";
import { setCurrent_${model.name} } from "../AdminFrontend/AdminData";
import { AsyncLoader } from "../shared/AsyncLoader";
import { Default${model.name} } from "./Default${model.name}";
import { create${model.name}, get${model.name}ById, update${model.name} } from "./${model.name}.api";

interface ${model.name}FormProps extends IAppState {

}

const setFormData = (mode: 'edit' | 'create', key: string, value: any) => (s1: AppState): AppState => {
    if (s1.page.kind != 'admin') return s1
    if (s1.page.entityData.kind != '${model.name}') return s1
    if (mode == 'edit') {
        if (s1.page.entityData.current${model.name}.data.kind != 'loaded') return s1
        return {
            ...s1, page: {
                ...s1.page, entityData: {
                    ...s1.page.entityData, current${model.name}: { kind: 'editing', data: loadedAsyncState({ ...s1.page.entityData.current${model.name}.data.value, [key]: value }) }
                }
            }
        }
    }
    return {
        ...s1, page: {
            ...s1.page, entityData: {
                ...s1.page.entityData,
                ${model.name}Form: { kind: 'editing', data: { ...s1.page.entityData.${model.name}Form.data, [key]: value } }
            }
        }
    }
}

const submitForm = async (props: ${model.name}FormProps) => {
    if (props.appState.page.kind == 'admin' && props.appState.page.entityData.kind == '${model.name}') {
        if (props.route.match.params.action == 'edit') {
            if (props.appState.page.entityData.current${model.name}.data.kind == 'loaded') {
                props.setState(s => {
                    if (s.page.kind != 'admin') return s
                    if (s.page.entityData.kind != '${model.name}') return s
                    return ({
                        ...s, page: {
                            ...s.page, entityData: {
                                ...s.page.entityData,
                                current${model.name}: { ...s.page.entityData.current${model.name}, kind: 'updating' }
                            }
                        }
                    })
                })

                let res = await update${model.name}(props.appState.page.entityData.current${model.name}.data.value)

                props.setState(s => {
                    if (s.page.kind != 'admin') return s
                    if (s.page.entityData.kind != '${model.name}') return s
                    return ({
                        ...s, page: {
                            ...s.page, entityData: {
                                ...s.page.entityData,
                                ${model.name}s: unloadedAsyncState(),
                                current${model.name}: { ...s.page.entityData.current${model.name}, kind: res == 200 ? 'updated' : 'update-failed' }
                            }
                        }
                    })
                })
            }
        } else if (props.route.match.params.action == 'create') {
            props.setState(s => {
                if (s.page.kind != 'admin') return s
                if (s.page.entityData.kind != '${model.name}') return s
                return ({
                    ...s, page: {
                        ...s.page, entityData: {
                            ...s.page.entityData,
                            ${model.name}Form: { ...s.page.entityData.${model.name}Form, kind: 'submitting' }
                        }
                    }
                })
            })

            let res = await create${model.name}(omitOne(props.appState.page.entityData.${model.name}Form.data, 'Id'))

            props.setState(s => {
                if (s.page.kind != 'admin') return s
                if (s.page.entityData.kind != '${model.name}') return s
                return ({
                    ...s, page: {
                        ...s.page, entityData: {
                            ...s.page.entityData,
                            ${model.name}Form: {
                                data: res > 0 ? Default${model.name}() : s.page.entityData.${model.name}Form.data,
                                kind: res > 0 ? 'submitted' : 'submit-error'
                            }
                        },
                        ${model.name}s: unloadedAsyncState()
                    }
                })
            })
        }
    }
}

export const Form${model.name} = (props: ${model.name}FormProps) => {
    if (props.appState.page.kind != 'admin') return <div></div>
    if (props.appState.page.entityData.kind != '${model.name}') return <div></div>

    if ((props.appState.page.entityData.current${model.name}.data.kind == 'unloaded') && props.route.match.params.action == 'edit' && props.route.match.params.id && !isNaN(Number(props.route.match.params.id))) {
        props.setState(setCurrent_${model.name}(loadingAsyncState(() => get${model.name}ById(Number(props.route.match.params.id)))))
    }

    let current_permission = props.appState.page.sidePanelState.get('${model.name}')

    return <div>
        {
            props.appState.page.entityData.${model.name}Form.kind == 'submitted' && <div className="alert alert-success" role="alert">
                New {props.appState.page.entityData.kind} added succesfully!
            </div>
        }

        {
            props.appState.page.entityData.current${model.name}.kind == 'updated' && <div className="alert alert-success" role="alert">
                {props.appState.page.entityData.kind} has updated succesfully!
        </div>
        }

        {
            (props.appState.page.entityData.current${model.name}.kind == 'update-failed' || props.appState.page.entityData.${model.name}Form.kind == 'submit-error') && <div className="alert alert-warning" role="alert">
                An error occured while submitting form data, nothing is saved!
          </div>
        }

        {(
            (current_permission && current_permission.can_create && props.route.match.params.action == 'create') 
        || (current_permission && current_permission.can_edit && props.route.match.params.action == 'edit')
        )
         && <button className="btn btn-primary"
            onClick={() => submitForm(props)}
            disabled={props.route.match.params.action == 'create' && (props.appState.page.entityData.${model.name}Form.kind == 'unsubmitted' ||
                props.appState.page.entityData.${model.name}Form.kind == 'submitted' ||
                props.appState.page.entityData.${model.name}Form.kind == 'submitting')
            }
        >
            {
                props.route.match.params.action == 'edit' ?
                    "Save edits" : "Create ${model.name}"
            }
        </button>}
        {
            current_permission && current_permission.can_view && props.route.match.params.action == 'edit' && props.route.match.params.id &&
            <NavLink className="btn btn-info" to={"/admin/" + props.appState.page.entityData.kind + "/view/" + props.route.match.params.id}>View</NavLink>
        }

        {props.appState.page.entityData.${model.name}Form.kind == 'submitting' && <div>Submitting data...</div>}

        {props.route.match.params.action == 'create' && <h1>Create a new {props.appState.page.entityData.kind}</h1>}

        {props.route.match.params.action == 'edit' && props.appState.page.entityData.current${model.name}.data.kind == 'loaded' && <h1>Currently editing {props.appState.page.entityData.kind}: {props.appState.page.entityData.current${model.name}.data.value.Id}</h1>}


        {
            current_permission && current_permission.can_create && props.route.match.params.action == 'create' ?
                <FormMaster<${model.name}>
                    id_prefix="${model.name}_form"
                    defaultData={[props.appState.page.entityData.${model.name}Form.data]}
                    onChange={(key, newValue, index) => props.setState(setFormData('create', key, newValue))}
                    query={Func(q => q.Select(${attrs_selected}))}
                />
                :
                current_permission && current_permission.can_edit ?
                <AsyncLoader<${model.name}> async={props.appState.page.entityData.current${model.name}.data}
                    onLoad={res => props.setState(s => {
                        if (s.page.kind != 'admin') return s
                        if (s.page.entityData.kind != '${model.name}') return s
                        return ({
                            ...s, page: {
                                ...s.page, entityData: {
                                    ...s.page.entityData,
                                    current${model.name}: { ...s.page.entityData.current${model.name}, data: res }
                                }
                            }
                        })
                    })}
                >
                    {props.appState.page.entityData.current${model.name}.data.kind == 'loaded' &&
                        <FormMaster<${model.name}>
                            id_prefix="${model.name}_form"
                            defaultData={[props.appState.page.entityData.current${model.name}.data.value]}
                            onChange={(key, newValue, index) => props.setState(setFormData('edit', key, newValue))}
                            query={Func(q => q.Select(${attrs_selected}))}
                        />}

                </AsyncLoader>
                :
                <div>Permission denied</div>
        }

    </div>
}
        `
    }
}


export const EntityTableComponent_snippet = (model: Model): Snippet => {
    let attrs = model.attributes.toIndexedSeq().toArray()
    return {
        name: `src/components/${model.name}/Table${model.name}.tsx`, 
        content: `
        import * as React from "react"
import { NavLink } from "react-router-dom"
import { IAppState } from "../../AppState"
import { ${model.name} } from "../../models/${model.name}"
import { loadingAsyncState, none, some, unloadedAsyncState } from "../../utils"
import { set_${model.name}s } from "../AdminFrontend/AdminData"
import { AsyncLoader } from "../shared/AsyncLoader"
import { Loader } from "../shared/Loader"
import { Modal } from "../shared/Modal/Modal"
import { delete${model.name}, get_${model.name}s } from "./${model.name}.api"

interface ${model.name}TableProps extends IAppState {

}

export const Table${model.name} = (props: ${model.name}TableProps) => {
    if (props.appState.page.kind != 'admin') return <div></div>
    if (props.appState.page.entityData.kind != '${model.name}') return <div></div>

    let current_permission = props.appState.page.sidePanelState.get('${model.name}')

    if (props.appState.page.entityData.${model.name}s.kind == 'unloaded') {
        props.setState(set_${model.name}s(loadingAsyncState(() => get_${model.name}s())))
    }

    return <div className="card mb-4">
        <div className="card-header">
            <i className="fas fa-table mr-1"></i>
            {props.appState.page.entityData.kind}
        </div>
        <div className="card-body">
            <div className="table-responsive">
                <AsyncLoader<${model.name}[]> async={props.appState.page.entityData.${model.name}s}
                    onLoad={(res) => props.setState(set_${model.name}s(res))}
                >
                    {props.appState.page.entityData.${model.name}s.kind == 'loaded' ?
                        props.appState.page.entityData.${model.name}s.value.length > 0 ?
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        ${attrs.reduce((xs, x) => xs + `<th>${x.name}</th>\n`, "")}
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        props.appState.page.entityData.${model.name}s.value.map(entity => <tr key={entity.Id}>
                                            <td><NavLink to={"/admin/${model.name}/view/" + entity.Id}>{entity.Id}</NavLink></td>
                                            ${attrs.reduce((xs, x) => xs + `<td>{entity.${x.name}}</td>\n`, "")}
                                            <td className="right">
                                                <ul className='entity-modifiers'>
                                                    <li><NavLink to={"/admin/${model.name}/view/"+ entity.Id}>Detail</NavLink></li>
                                                    {current_permission && current_permission.can_edit && <li><NavLink to={"/admin/${model.name}/edit/" + entity.Id}>Edit</NavLink></li>}
                                                    {current_permission && current_permission.can_delete && <li><a role="button" className='danger' onClick={async () => {
                                                        props.setState(s => {
                                                            if (s.page.kind != 'admin') return s
                                                            if (s.page.entityData.kind != '${model.name}') return s
                                                            return ({
                                                                ...s, page: {
                                                                    ...s.page, entityData: {
                                                                        ...s.page.entityData,
                                                                        ${model.name}ToDelete: some(entity)
                                                                    }
                                                                }
                                                            })
                                                        })
                                                    }}>Delete</a></li>}
                                                </ul>
                                            </td>
                                        </tr>)

                                    }
                                </tbody>
                            </table>
                            :
                            <div>
                                <h2>No data</h2>
                                <NavLink to={"/admin/${model.name}/create"} role="button" className="btn btn-primary">
                                    Create some ${model.name}
                                </NavLink>
                            </div>
                        : <Loader />}

                    <Modal title={"Are you sure you want to delete this entity?"}
                        show={props.appState.page.entityData.${model.name}ToDelete.kind == 'some'}
                        onCancel={() => props.setState(s => {
                            if (s.page.kind != 'admin') return s
                            return ({ ...s, page: { ...s.page, entityData: { ...s.page.entityData, ${model.name}ToDelete: none() } } })
                        })}
                        onOkay={async () => {
                            if (props.appState.page.kind == 'admin' && props.appState.page.entityData.kind == '${model.name}' && props.appState.page.entityData.${model.name}ToDelete.kind == 'some') {
                                await delete${model.name}(props.appState.page.entityData.${model.name}ToDelete.value.Id)
                                props.setState(s => {
                                    if (s.page.kind != 'admin') return s
                                    if (s.page.entityData.kind != '${model.name}') return s
                                    return ({
                                        ...s, page: {
                                            ...s.page, entityData: {
                                                ...s.page.entityData,
                                                ${model.name}ToDelete: none(),
                                                ${model.name}s: unloadedAsyncState()
                                            }
                                        }
                                    })
                                })
                            }
                        }}
                        okayText="Delete"
                        cancelText='Cancel'
                        cancelRole='success'
                        okayRole='danger'
                    >

                        {props.appState.page.entityData.${model.name}ToDelete.kind == 'some' && <div>
                            <h5>You're about to delete:</h5>
                            <p>
                                <ul>
                                    <li><b>Id: </b>{props.appState.page.entityData.${model.name}ToDelete.value.Id}</li>
                                    ${attrs.reduce((xs, x) => xs + `<li><b>${x.name}: </b>{props.appState.page.entityData.${model.name}ToDelete.value.${x.name}}</li>\n` ,"")}
                                </ul>
                            </p>
                        </div>}

                    </Modal>

                </AsyncLoader>
            </div>
        </div>
    </div>
}
        `
    }
}