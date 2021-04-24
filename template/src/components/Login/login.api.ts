import { API_VERSION, ORIGIN } from "../../constants";
import { Either, inl, inr, Message } from "../../utils";
import { LoginForm, LoginState } from "./login.state";
import { LoginDatatoBody } from "./login.utils";



export const login = (body: LoginForm): Promise<Either<LoginState, Message>> => {
    let actual_body = LoginDatatoBody(body)
    if (actual_body.role == 'none') return new Promise((res) => res(inr({ kind: 'danger', msg: "Role does not exist" })))
    return fetch(`${ORIGIN}/api/${API_VERSION}/auth/Login.php`, {
        method: 'post',
        body: JSON.stringify(actual_body),
        mode: 'cors'
    })
        .then(respone => {
            if (respone.ok) {
                return respone.json()
            }
            return Promise.reject(respone.statusText)
        })
        .then(data => {
            if (data._status == 200) {
                return inl<LoginState, Message>(data._value)
            }
            return inr<LoginState, Message>({ kind: 'danger', msg: data._value })
        })
        .catch(reason => {
            console.log(reason)
            return inr<LoginState, Message>({ kind: 'danger', msg: "Login attempt failed unkown reason" })
        })
}

export const isLoggedInAs = (body: LoginState): Promise<boolean> =>
    fetch(`${ORIGIN}/api/${API_VERSION}/auth/IsLoggedInAs.php`, {
        method: 'post',
        body: JSON.stringify(body),
        mode: 'cors'
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response.statusText)
        })
        .then(data => data === 'TRUE')
        .catch(reason => {
            console.log(reason)
            return false
        })

export const logout = (): Promise<Either<LoginState, Message>> =>
    fetch(`${ORIGIN}/api/${API_VERSION}/auth/Logout.php`)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response.statusText)
        })
        .then(data => inr<LoginState, Message>({ kind: 'info', msg: data._value }))
        .catch(reason => {
            console.log(reason)
            return inr(reason)
        })