import * as React from "react"
import { IAppState } from "../../AppState"
import { routeHasChanged } from "../../utils"


export interface AdminHomePageProps extends IAppState {

}

export class AdminHomePage extends React.Component<AdminHomePageProps, never> {
    constructor(props: AdminHomePageProps) {
        super(props)
    }

    componentDidMount() {
        this.props.setState(s => ({ ...s, page: { ...s.page, entityData: { kind: 'no-entity' } } }))
    }

    componentDidUpdate(prevProps: AdminHomePageProps) {
        if (routeHasChanged(prevProps.route.match.params, this.props.route.match.params)) {
            this.props.setState(s => ({ ...s, page: { ...s.page, entityData: { kind: 'no-entity' } } }))
        }
    }

    render() {
        return <div className="jumbotron">
            <h1>Welcome to the dashboard of {this.props.appProps.siteName}</h1>
            <p>From here you can manage your database.</p>
        </div>
    }
}