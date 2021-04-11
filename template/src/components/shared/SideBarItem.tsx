import * as React from 'react'
import { Map } from 'immutable'
import { NavLink } from 'react-router-dom'
import { AppState, IAppState } from '../../AppState'

export interface SideBarItemState {
    title: string
    panelState: 'open' | 'closed'
}

interface SideBarItemProps extends IAppState {
    item: SideBarItemState
    children?: React.ReactNode
}

export const SideBarItem = (props: SideBarItemProps) => {


    const toggleSidebarItems = (s: AppState): AppState => {
        if (s.page.kind != 'admin') return s
        return ({
            ...s,
            page: {
                ...s.page,
                sidePanelState: s.page.sidePanelState
                    .reduce((xs, v, k) => xs.set(k, { ...v, panelState: 'closed' }), Map<string, SideBarItemState>())
                    .set(props.item.title, { ...props.item, panelState: props.item.panelState == 'open' ? 'closed' : 'open' })
            }
        })
    }

    return <>
        <NavLink to={`/admin/${props.item.title}`} onClick={() => props.setState(toggleSidebarItems)} className={`nav-link ${props.item.panelState == 'open' ? '' : 'collapsed'}`}>
            <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
            {props.item.title}
            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
        </NavLink>

        <div className={`collapse ${props.item.panelState == 'open' ? 'show' : ''}`} id="collapseLayouts">
            <nav className="sb-sidenav-menu-nested nav">
                <NavLink className="nav-link" to={`/admin/${props.item.title}`}>Show records</NavLink>
                <NavLink className="nav-link" to={`/admin/${props.item.title}/create/`}>Add {props.item.title}</NavLink>
                {props.children}
            </nav>
        </div>
    </>
}