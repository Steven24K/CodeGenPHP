import * as React from "react"
import "./admin.css"
import { Map } from "immutable";
import { NavLink } from "react-router-dom";
import { AppState, IAppState, setLoginState } from "../../AppState";
import { getAllowedEntities } from "./Admin.api";
import { SideBarItem, SideBarItemState } from "../shared/SideBarItem";
import { logout } from "../Login/login.api";
import { omitOne } from "../../FormBuilder/utils/Omit";
import { loadingAsyncState } from "../../utils";
import { AsyncLoader } from "../shared/AsyncLoader";
import { EntityPermission } from "../../types/EntityPermission";

interface AdminComponentProps extends IAppState {
    children?: React.ReactNode
}

const toggleSideBar = (s: AppState): AppState => {
    if (s.page.kind != 'admin') return s
    return ({ ...s, page: { ...s.page, sidebarState: s.page.sidebarState == 'open' ? 'closed' : 'open' } })
}

const toggleUserPanel = (s: AppState): AppState => {
    if (s.page.kind != 'admin') return s
    return ({ ...s, page: { ...s.page, userPanelState: s.page.userPanelState == 'open' ? 'closed' : 'open' } })
}

const setUserPanelState = (newValue: 'open' | 'closed') => (s: AppState): AppState => {
    if (s.page.kind != 'admin') return s
    return ({ ...s, page: { ...s.page, userPanelState: newValue } })
}

const setAdminEntities = (newEntities: string[]) => (s: AppState): AppState => {
    if (s.page.kind != 'admin') return s
    return ({ ...s, page: { ...s.page, sidePanelState: newEntities.reduce((xs, x) => xs.set(x, { title: x, panelState: 'closed' }), Map<string, SideBarItemState>()) } })
}

export const AdminComponent = (props: AdminComponentProps) => {
    if (props.appState.page.kind != 'admin') return <div></div>

    if (props.appState.page.sideMenu.kind == 'unloaded') {
        props.setState(s => {
            if (s.page.kind != 'admin') return s
            return ({ ...s, page: ({ ...s.page, sideMenu: loadingAsyncState(() => getAllowedEntities('view')) }) })
        })
    }

    return <div className={`sb-nav-fixed ${props.appState.page.sidebarState == 'open' ? '' : 'sb-sidenav-toggled'}`}>

        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            <a className="navbar-brand" href="/">{props.appProps.siteName}</a>
            <button onClick={() => props.setState(toggleSideBar)} className="btn btn-link btn-sm order-1 order-lg-0" id="sidebarToggle"><i className="fas fa-bars"></i></button>

            <div className="d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-3 my-2 my-md-0">
                {/*This is needed to keep the next element on the right of the screen, this area might be used to add an extra search bar */}
            </div>

            <ul className="navbar-nav ml-auto ml-md-0">
                <li className={`nav-item dropdown ${props.appState.page.userPanelState == 'open' ? 'show' : ''}`}>
                    <a onClick={() => props.setState(toggleUserPanel)} className="nav-link dropdown-toggle" id="userDropdown" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="fas fa-user fa-fw"></i></a>
                    <div onMouseLeave={() => props.setState(setUserPanelState('closed'))} className={`dropdown-menu dropdown-menu-right ${props.appState.page.userPanelState == 'open' ? 'show' : ''}`} aria-labelledby="userDropdown">
                        <div className="dropdown-section">
                            {props.appState.loginState != 'unloaded' && props.appState.loginState.kind == 'l'
                                && <h4>Hello {props.appState.loginState.v.role}</h4>}
                        </div>
                        <div className="dropdown-section">
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked" />
                                <label className="form-check-label">Edit</label>
                            </div>
                        </div>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" onClick={async () => {
                            let res = await logout()
                            props.setState(setLoginState(res))
                        }}>Logout</a>
                    </div>
                </li>
            </ul>
        </nav>

        <div id="layoutSidenav">
            <div id="layoutSidenav_nav">
                <nav className='sb-sidenav accordion sb-sidenav-dark' id="sidenavAccordion">
                    <div className="sb-sidenav-menu">
                        <div className="nav">
                            <div className="sb-sidenav-menu-heading">Core</div>
                            <NavLink className="nav-link" to="/admin/">
                                <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                                Dashboard
                            </NavLink>
                            <div className="sb-sidenav-menu-heading">Tables</div>

                            <AsyncLoader<EntityPermission[]>
                                async={props.appState.page.sideMenu}
                                onLoad={res => props.setState(s => {
                                    if (s.page.kind != 'admin') return s
                                    return ({
                                        ...s, page: {
                                            ...s.page,
                                            sideMenu: res,
                                            sidePanelState: res.kind == 'loaded' ? res.value.reduce((xs, x) => xs.set(x.entity, { title: x.entity, panelState: 'closed' }), Map<string, SideBarItemState>()) : Map()
                                        }
                                    })
                                })}
                            >
                                {
                                    props.appState.page.sidePanelState.toArray().map(e => <SideBarItem
                                        {...omitOne(props, 'children')}
                                        key={e[0]}
                                        item={e[1]} />)
                                }
                            </AsyncLoader>


                        </div>
                    </div>
                    <div className="sb-sidenav-footer">
                        <div className="small">Logged in as:</div>
                        {props.appState.loginState != 'unloaded' && props.appState.loginState.kind == 'l' && <span>{props.appState.loginState.v.role}</span>}
                    </div>
                </nav>
            </div>


            <div id="layoutSidenav_content">

                <main>
                    <div className="container-fluid">
                        <h1 className="mt-4">{props.appProps.siteName}</h1>
                        <ol className="breadcrumb mb-4">
                            <li className="breadcrumb-item active"><NavLink to="/admin/">Dashboard</NavLink></li>
                            {props.appState.page.entityData.kind != 'no-entity' && <li className="breadcrumb-item active"><NavLink to={`/admin/${props.appState.page.entityData.kind}`}>{props.appState.page.entityData.kind}</NavLink></li>}
                            {props.route.match.params.id && <li className="breadcrumb-item active">{props.route.match.params.id}</li>}
                        </ol>

                        {props.children}

                    </div>
                </main>

                <footer className="py-4 bg-light mt-auto">
                    <div className="container-fluid">
                        <div className="d-flex align-items-center justify-content-between small">
                            <div className="text-muted">Copyright &copy; {props.appProps.siteName} {new Date(Date.now()).getFullYear()}</div>
                            <div>
                                <a target='_blank' href="https://github.com/Steven24K/CodeGenPHP">Generated by CodeGenPHP</a>
                                &middot;
                                <a target='_blank' href="https://stevenkoerts.nl/">Made by Steven Koerts</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    </div>
}
