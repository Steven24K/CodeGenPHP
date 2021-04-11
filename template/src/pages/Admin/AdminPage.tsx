import * as React from "react"
import { Redirect } from "react-router"
import { IAppState } from "../../AppState"
import { AdminComponent } from "../../components/Admin/AdminComponent"
import { zeroAdminState } from "./AdminPageState"
import { AdminRoutes } from "./adminRoutes"


export interface AdminPageProps extends IAppState {

}

export class AdminPage extends React.Component<AdminPageProps, never> {
    constructor(props: AdminPageProps) {
        super(props)
    }

    componentDidMount() {
        this.props.setState(s => ({ ...s, page: zeroAdminState() }))
    }


    render() {
        if (this.props.appState.loginState == 'unloaded') return <div>Check authorization...</div>
        if (this.props.appState.loginState.kind == 'r') {
            return <Redirect to='/login' />
        }
        return <AdminComponent {...this.props}>
            <AdminRoutes {...this.props} />
        </AdminComponent>
    }
}
