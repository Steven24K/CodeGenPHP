import * as React from "react"

export const AdminHomePage = (props) => <div className="jumbotron">
    <h1>Welcome to the dashboard of {props.appProps.siteName}</h1>
    <p>From here you can manage your database.</p>
</div>