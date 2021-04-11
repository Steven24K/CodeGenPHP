import * as React from "react"
import { IAppState } from "../AppState";


export interface UnauthorizedPageProps extends IAppState {

}


export const NotFoundPage = (props: UnauthorizedPageProps) => {
    return <div className="container">
        <h1>403 - That is an error</h1>

        <h2>That means that you don't have the right permission to view this page</h2>


        <h3>This is not the page you are looking for</h3>

    </div>
}