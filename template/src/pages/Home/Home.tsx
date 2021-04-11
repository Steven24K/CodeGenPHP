import * as React from "react"
import { IAppState } from "../../AppState"
import { zeroHomePageState } from "./HomePageState"


export interface HomePageProps extends IAppState {

}


export class HomePage extends React.Component<HomePageProps, never> {
    constructor(props: HomePageProps) {
        super(props)
    }

    componentDidMount() {
        this.props.setState(s => ({ ...s, page: zeroHomePageState() }))
    }

    render() {
        return <div className="container">
            <h1>Home</h1>
        </div>
    }
}