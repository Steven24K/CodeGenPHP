import * as React from "react"
import { Redirect } from "react-router"
import { IAppState } from "../../AppState"
import { LoginComponent } from "../../components/Login/LoginComponent"
import { zeroLoginPageState } from "./LoginPageState"


export interface LoginPageProps extends IAppState {

}

export class LoginPage extends React.Component<LoginPageProps, never> {
    constructor(props: LoginPageProps) {
        super(props)
    }

    componentDidMount() {
        this.props.setState(s => ({ ...s, page: zeroLoginPageState() }))
    }

    render() {
        if (this.props.appState.loginState == 'unloaded') return <div>Check authorization...</div>
        if (this.props.appState.loginState.kind == 'r') {
            return <LoginComponent appState={this.props.appState} setState={this.props.setState} />
        }
        return <Redirect to='/admin' />
    }
}
