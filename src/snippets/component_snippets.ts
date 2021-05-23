import { Application } from "../Spec/Application";
import { Model } from "../Spec/Model";
import { Snippet } from "../utils/types";
import { SqlType_to_typescript_type } from "../utils/utils";

export const AppRoles_snippet = (app: Application): Snippet => {
    let roles = app.models.toIndexedSeq().toArray().filter(m => m.can_login)
    return ({
        name: 'src/types/AppRoles.ts',
        content: `
        export type AppRoles = ${roles.reduce((xs, x, i) => xs + `'${x.name}'${roles.length - 1 != i ? ' | ' : ''}`, '')}
        
        export const AppRoles: AppRoles[] = [${roles.reduce((xs, x) => xs + `'${x.name}', ` ,'')}]
        
        `
    })
}

export const adminRoutes_snippet = (app: Application): Snippet => {
    return ({
        name: 'src/pages/Admin/adminRoutes.tsx',
        content: `import * as React from "react"
        import { Route, Switch } from "react-router-dom"
        import { IAppState } from "../../AppState"
        import { AdminHomePage } from "./AdminHome"
        import { AdminNotFoundPage } from "./AdminNotFound"
        ${app.models.toIndexedSeq().toArray().reduce((xs, x) => xs + `import { Admin${x.name}Page } from "./${x.name}/Admin${x.name}Page"\n`, '')}
        
        interface AdminRouteProps extends IAppState { }
        
        export const AdminRoutes = (props: AdminRouteProps) => <Switch>
            <Route path='/admin' exact render={() => <AdminHomePage {...props} />} />
            ${app.models.toIndexedSeq().toArray().reduce((xs, x) => xs + `<Route path='/admin/${x.name}/:action?/:id?' render={route => <Admin${x.name}Page {...props} route={route} />} />\n`, '')}
            <Route path='/admin/*' render={() => <AdminNotFoundPage />} />
        </Switch>`
    })
}

export const AdminPages_snippet = (model: Model): Snippet => {
    return ({
        name: `src/pages/Admin/${model.name}/Admin${model.name}Page.tsx`,
        content: `import * as React from "react"
        import { IAppState } from "../../../AppState"
        import { zero${model.name}EntityData } from "../../../components/AdminFrontend/AdminData"
        import { routeHasChanged } from "../../../utils"
        import { Table${model.name} } from "../../../components/${model.name}/Table${model.name}"
        import { Detail${model.name} } from "../../../components/${model.name}/Detail${model.name}"
        import { Form${model.name} } from "../../../components/${model.name}/Form${model.name}"
        
        
        export interface Admin${model.name}PageProps extends IAppState {
        
        }
        
        export class Admin${model.name}Page extends React.Component<Admin${model.name}PageProps, never> {
            constructor(props: Admin${model.name}PageProps) {
                super(props)
            }
        
            componentDidMount() {
                this.props.setState(s => ({ ...s, page: { ...s.page, entityData: zero${model.name}EntityData() } }))
            }
        
            componentDidUpdate(prevProps: Admin${model.name}PageProps) {
                if (routeHasChanged(prevProps.route.match.params, this.props.route.match.params)) {
                    this.props.setState(s => ({ ...s, page: { ...s.page, entityData: zero${model.name}EntityData() } }))
                }
            }
        
            render() {
                // TODO: Nested routing could also be applied here.
                return <>
                    {!this.props.route.match.params.id && !this.props.route.match.params.action && <Table${model.name} {...this.props} />}
        
                    {this.props.route.match.params.id && this.props.route.match.params.action == 'view' && <Detail${model.name} {...this.props} />}
        
                    {(this.props.route.match.params.id && this.props.route.match.params.action == 'edit' || this.props.route.match.params.action == 'create') && <Form${model.name} {...this.props} />}
         
                </>
            }
        }
        `
    })
}

export const typescriptInterfaces_snippet = (m: Model): Snippet => {
    return ({
        name: `src/models/${m.name}.ts`,
        content: `export interface ${m.name} {Id: number; ${m.attributes.toIndexedSeq().toArray().reduce((xs, x) => xs + `${x.name}: ${SqlType_to_typescript_type(x.type)}; `, '')}}`
    })
}


export const loginUtils_snippet = (app: Application): Snippet => {
    let roles = app.models.toIndexedSeq().toArray().filter(m => m.can_login
        && m.attributes.findEntry(v => v.type == 'USERNAME')
        && m.attributes.findEntry(v => v.type == 'PASSWORD')
    )
    return ({
        name: 'src/components/Login/login.utils.ts',
        content: `import { LoginForm } from "./login.state"

        ${roles.reduce((xs, x) => xs + `
        interface ${x.name}Login {
            role: "${x.name}"
            ${x.attributes.findEntry(v => v.type == 'USERNAME')?.[1].name}: string
            ${x.attributes.findEntry(v => v.type == 'PASSWORD')?.[1].name}: string
        }

        ` , '')}

        
        type LoginBody = ${roles.reduce((xs, x) => xs + `${x.name}Login | `, '')}{ role: "none" }
        

        export const LoginDatatoBody = (data: LoginForm): LoginBody => {
            ${roles.reduce((xs, x) => xs + `
            if (data.role == '${x.name}') {
                return { role: '${x.name}', ${x.attributes.findEntry(v => v.type == 'PASSWORD')?.[1].name}: data.password, ${x.attributes.findEntry(v => v.type == 'USERNAME')?.[1].name}: data.username }
            }

            `, '')}

        
            return { role: 'none' }
        }`
    })
}

export const detailPage_snippet = (app: Application): Snippet => {
    let models = app.models.toIndexedSeq().toArray()

    return {
        name: 'src/components/shared/DetailPage/DetailPage.tsx', 
        content: `
        import * as React from "react"
import { NavLink } from "react-router-dom"
import { IAppState } from "../../../AppState"
import { loadingAsyncState } from "../../../utils"
import { AsyncLoader } from "../AsyncLoader"

${models.reduce((xs, x) => xs + `
import { ${x.name} } from "../../../models/${x.name}"
import { setCurrent_${x.name} } from "../../AdminFrontend/AdminData"
import { get${x.name}ById } from "../../${x.name}/${x.name}.api"
import { Detail${x.name} } from "../../${x.name}/Detail${x.name}"
`, "")}


interface DetailPageProps extends IAppState {

}

export const DetailPage = (props: DetailPageProps) => {
    if (props.appState.page.kind != 'admin') return null 

    return <div>
        <div>
            {
                props.route.match.params.id &&
                <NavLink className="btn btn-primary" to={"/admin/" + props.appState.page.entityData.kind + "/edit/" + props.route.match.params.id}>Edit {props.appState.page.entityData.kind}</NavLink>
            }
        </div>
        <PageSwitcher {...props} />
    </div>
}



const PageSwitcher = (props: DetailPageProps) => {
    if (props.appState.page.kind != 'admin') return null

    ${models.reduce((xs, x) => xs + `
    if (props.appState.page.entityData.kind == '${x.name}' && props.route.match.params.id && !isNaN(Number(props.route.match.params.id))) {
        if (props.appState.page.entityData.current${x.name}.data.kind == 'unloaded') {
            props.setState(setCurrent_${x.name}(loadingAsyncState(() => get${x.name}ById(Number(props.route.match.params.id)))))
        }
        return <AsyncLoader<${x.name}> async={props.appState.page.entityData.current${x.name}.data}
            onLoad={res => props.setState(setCurrent_${x.name}(res))}>
            <Detail${x.name} {...props} />
        </AsyncLoader>
    }
    `, "")}


    return <div>
        <h1>Detail page does not exist</h1>
    </div>
}
        `
    }
}


export const dataTable_snippet = (app: Application): Snippet => {
    let models = app.models.toIndexedSeq().toArray()

    return {
        name: 'src/components/shared/DataTable/DataTable.tsx', 
        content: `
        import * as React from "react"
        import { loadingAsyncState } from "../../../utils"
import { IAppState } from "../../../AppState"
import { Loader } from "../Loader"
import { AsyncLoader } from "../AsyncLoader"

${models.reduce((xs, x) => xs + `
import { ${x.name} } from "../../../models/${x.name}"
import { get_${x.name}s } from "../../${x.name}/${x.name}.api"
import { Table${x.name} } from "../../${x.name}/Table${x.name}"
`, "")}

import { ${models.reduce((xs, x) => xs + `set_${x.name}s, ` ,"")} } from "../../AdminFrontend/AdminData"
import './DataTable.css'

interface DataTableProps extends IAppState {
}


export const DataTable = (props: DataTableProps) => {
    if (props.appState.page.kind != 'admin') return <div></div>

    return <div className="card mb-4">
        <div className="card-header">
            <i className="fas fa-table mr-1"></i>
            {props.appState.page.entityData.kind}
        </div>
        <div className="card-body">
            <div className="table-responsive">
                <TableRenderer {...props} />
            </div>
        </div>
    </div>
}


const TableRenderer = (props: DataTableProps) => {
    if (props.appState.page.kind != 'admin') return <div></div>


    ${models.reduce((xs, x) => xs + `
    if (props.appState.page.entityData.kind == '${x.name}') {
        if (props.appState.page.entityData.${x.name}s.kind == 'unloaded') {
            props.setState(set_${x.name}s(loadingAsyncState(() => get_${x.name}s())))
        }
        return <AsyncLoader<${x.name}[]> async={props.appState.page.entityData.${x.name}s}
            onLoad={(res) => props.setState(set_${x.name}s(res))}
        >
            <Table${x.name} {...props} />
        </AsyncLoader>
    }

    `, "")}


    return <div>
        <h3>Table not found</h3>

        <p>
            This table does not exist in your database, or the admin panel does not contain a definition for it.
        </p>
    </div>
}
        `
    }
}


export const dataForm_snippet = (app: Application): Snippet => {
    let models = app.models.toIndexedSeq().toArray()

    return {
        name: 'src/components/shared/DataForm/DataForm.tsx', 
        content: `
        import * as React from "react"
import { IAppState } from "../../../AppState";
import { loadingAsyncState } from "../../../utils";

import { ${models.reduce((xs, x) => xs + `setCurrent_${x.name}, ` ,"")} } from "../../AdminFrontend/AdminData"

${models.reduce((xs, x) => xs + `
import { get${x.name}ById } from "../../${x.name}/${x.name}.api";
import { Form${x.name} } from "../../${x.name}/Form${x.name}";
`, "")}

interface DataFormProps extends IAppState {

}


export const DataForm = (props: DataFormProps) => {
    if (props.appState.page.kind != 'admin') return <div></div>


    ${models.reduce((xs, x) => xs + `
    if (props.appState.page.entityData.kind == '${x.name}') {
        if ((props.appState.page.entityData.current${x.name}.data.kind == 'unloaded') && props.route.match.params.action == 'edit' && props.route.match.params.id && !isNaN(Number(props.route.match.params.id))) {
            props.setState(setCurrent_${x.name}(loadingAsyncState(() => get${x.name}ById(Number(props.route.match.params.id)))))
        }
        return <Form${x.name} {...props} />
    }

    `, "")}

    return <div>
        <h1>No form found</h1>
    </div>
}

        `
    }
}
