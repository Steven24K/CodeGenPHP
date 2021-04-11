import { LoginForm } from "../../components/Login/login.state";

export interface LoginPageState {
    kind: 'login'
    loginForm: LoginForm
}

export const zeroLoginPageState = (): LoginPageState => ({ kind: 'login', loginForm: { password: '', username: '', role: 'admin' } })