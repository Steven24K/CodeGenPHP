import * as React from "react"
import { IAppState } from "../AppState";


export interface NotFoundPageProps extends IAppState {

}

export interface NotFoundPageState { kind: '404' }


export class NotFoundPage extends React.Component<NotFoundPageProps, never> {
    constructor(props: NotFoundPageProps) {
        super(props)
    }

    componentDidMount() {
        this.props.setState(s => ({ ...s, page: { kind: '404' } }))
    }

    render() {
        return <div className="container">
            <h1>404 - That is an error</h1>

            <h2>That means that the page you are looking for cannot be found</h2>

            <p>
                The page might have been moved, deleted, or has never existed.
            </p>

            <h3>This is not the page you are looking for</h3>

        </div>
    }
}