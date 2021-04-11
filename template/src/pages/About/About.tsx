import * as React from "react"
import { IAppState } from "../../AppState"
import { zeroAboutPageState } from "./AboutPageState"


export interface AboutPageProps extends IAppState {

}


export class AboutPage extends React.Component<AboutPageProps, never> {
    constructor(props: AboutPageProps) {
        super(props)
    }

    componentDidMount() {
        this.props.setState(s => ({ ...s, page: zeroAboutPageState()}))
    }

    render() {
        return <div className="container">
            <h1>About</h1>
        </div>
    }
}