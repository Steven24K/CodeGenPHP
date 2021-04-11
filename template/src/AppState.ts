import { RouteComponentProps } from "react-router-dom"
import { AppProps } from "./App"
import { AdminPageState } from "./pages/Admin/AdminPageState"
import { LoginState } from "./components/Login/login.state"
import { AboutPageState } from "./pages/About/AboutPageState"
import { HomePageState } from "./pages/Home/HomePageState"
import { LoginPageState } from "./pages/Login/LoginPageState"
import { Either, Message, Fun, Option, none } from "./utils"
import { NotFoundPageState } from "./errors/NotFoundPage"


export interface NoPageState { kind: 'no-page' }

export type AppState = {
    loginState: Either<LoginState, Message> | 'unloaded'
    page: HomePageState | AboutPageState | AdminPageState | LoginPageState | NotFoundPageState | NoPageState
    error: Option<Message>
}

export const setLoginState = (newLoginState: Either<LoginState, Message>) => (s: AppState): AppState => {
    return ({ ...s, loginState: newLoginState })
}

export type RouteParams = Partial<{
    id: string
    action: "edit" | "create" | "view"
}>

export interface IAppState {
    route: RouteComponentProps<RouteParams>
    appProps: AppProps
    appState: AppState
    setState: (_: Fun<AppState, AppState>) => void
}

export const zeroAppState = (): AppState => ({
    loginState: "unloaded",
    page: { kind: 'no-page' },
    error: none() // The error is being displayed on top of the the application, use this to give top level errors to the user. 
})
