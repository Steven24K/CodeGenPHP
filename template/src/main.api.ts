import { LoginState } from "./components/Login/login.state"
import { API_VERSION, ORIGIN } from "./constants"
import { Either, inl, inr, Message } from "./utils"



export const checkLoginSession = (): Promise<Either<LoginState, Message>> =>
    fetch(`${ORIGIN}/api/${API_VERSION}/auth/CheckSession.php`)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response.statusText)
        })
        .then(data => {
            if (data._status == 200) {
                return inl<LoginState, Message>(data._value)
            }
            return inr<LoginState, Message>({ kind: 'primary', msg: data._value })
        })
        .catch(reason => {
            console.log(reason)
            return inr<LoginState, Message>({ kind: 'warning', msg: `Error while checking authorization: ${reason}` })
        })
