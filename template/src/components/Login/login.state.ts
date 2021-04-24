import { AppRoles } from "../../types/AppRoles";


export interface LoginState {
    role: AppRoles
    id: number
}

export interface LoginForm {
    role: AppRoles
    username: string
    password: string
}