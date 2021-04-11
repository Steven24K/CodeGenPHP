import * as React from "react"
import { Switch, Route, BrowserRouter } from "react-router-dom";
import './App.css';
import { AppState, zeroAppState } from './AppState';
import { NotFoundPage } from "./errors/NotFoundPage";
import { checkLoginSession } from "./main.api";
import { AboutPage } from './pages/About/About';
import { AdminPage } from './pages/Admin/AdminPage';
import { HomePage } from './pages/Home/Home';
import { LoginPage } from "./pages/Login/LoginPage";
import { none } from "./utils";

export interface AppProps {
  siteName: string
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)
    this.state = zeroAppState()
    this.setState = this.setState.bind(this)
  }

  componentDidMount() {
    if (this.state.loginState == 'unloaded') {
      checkLoginSession().then(res => {
        this.setState(s => ({ ...s, loginState: res }))
      })
    }
  }

  render() {
    return <BrowserRouter>

      {this.state.error.kind == 'some' && <div className={`alert alert-${this.state.error.value.kind} alert-dismissible`}>
        {this.state.error.value.msg}
        <button type="button" className="btn-close" onClick={() => this.setState(s => ({...s, error: none()}))} />
      </div>}

      <Switch>
        <Route path='/' exact render={route => <HomePage appProps={this.props} appState={this.state} route={route} setState={this.setState} />} />
        <Route path='/about' render={route => <AboutPage appProps={this.props} appState={this.state} route={route} setState={this.setState} />} />
        <Route path='/login' render={route => <LoginPage appProps={this.props} appState={this.state} route={route} setState={this.setState} />} />
        <Route path='/admin' render={route => <AdminPage appProps={this.props} appState={this.state} setState={this.setState} route={route} />} />
        <Route path="*" render={route => <NotFoundPage appProps={this.props} appState={this.state} route={route} setState={this.setState} />} />
      </Switch>
    </BrowserRouter>
  }
}
