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
        import { Route, Switch } from "react-router"
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
        import { zero${model.name}EntityData } from "../../../components/Admin/AdminData"
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