import * as React from "react"
import { AppState } from '../../AppState'
import { AppRoles } from "../../types/AppRoles"
import { Fun } from '../../utils'
import { Loader } from "../shared/Loader"
import { login } from './login.api'
import './login.css'
import { LoginForm } from "./login.state"

export const setLoginForm = <K extends keyof LoginForm>(key: K, value: LoginForm[K]) => (s: AppState): AppState => {
    if (s.page.kind != 'login') return s
    return ({ ...s, page: { ...s.page, loginForm: { ...s.page.loginForm, [key]: value } } })
}

interface LoginComponentProps {
    appState: AppState
    setState: (_: Fun<AppState, AppState>) => void
}

const submit_login = async (props: LoginComponentProps) => {
    if (props.appState.page.kind == 'login') {
        let res = await login(props.appState.page.loginForm)
        props.setState(s => ({ ...s, loginState: res }))
    }
}

export const LoginComponent = (props: LoginComponentProps) => {
    if (props.appState.page.kind != 'login') return <div></div>
    if (props.appState.loginState == 'unloaded') return <Loader />

    return <div className="container login-container">
        <div className="row">
            <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                <div className="card card-signin my-5">
                    <div className="card-body">
                        <h5 className="card-title text-center">Sign In</h5>
                        {
                            props.appState.loginState.kind == 'r' && (<div className={`alert alert-${props.appState.loginState.v.kind}`}>
                                <strong>{props.appState.loginState.v.kind == 'danger' ? "Oops!" : "Info"}</strong> {props.appState.loginState.v.msg}
                            </div>)
                        }
                        <form onSubmit={e => {
                            e.preventDefault()
                            submit_login(props)
                        }} className="form-signin">
                            <div className="form-label-group">
                                <input value={props.appState.page.loginForm.username}
                                    type="text" id="inputEmail"
                                    className="form-control"
                                    autoFocus
                                    placeholder="Username"
                                    onChange={e => props.setState(setLoginForm('username', e.target.value))}
                                />

                            </div>

                            <div className="form-label-group">
                                <input value={props.appState.page.loginForm.password}
                                    type="password"
                                    id="inputPassword"
                                    className="form-control"
                                    placeholder="Password"
                                    onChange={e => props.setState(setLoginForm('password', e.target.value))}
                                />
                            </div>

                            <div className="form-label-group">
                                <select defaultValue={props.appState.page.loginForm.role} onChange={e => props.setState(setLoginForm('role', e.target.value as any))} className="custom-select" id="inputGroupSelect01">
                                    {AppRoles.map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>



                            <button
                                disabled={props.appState.page.loginForm.password == '' || props.appState.page.loginForm.username == ''}
                                onClick={() => submit_login(props)} className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">
                                Sign in
                            </button>
                            <hr className="my-4" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
}