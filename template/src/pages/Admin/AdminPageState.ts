import { Map } from "immutable";
import { SideBarItemState } from "../../components/shared/SideBarItem";
import { EntityData, zeroEntityData } from "../../components/AdminFrontend/AdminData";
import { AsyncState, unloadedAsyncState } from "../../utils";
import { EntityPermission } from "../../types/EntityPermission";

export type AdminPageState = {
    kind: 'admin'
    sidebarState: 'open' | 'closed'
    userPanelState: 'open' | 'closed'
    sidePanelState: Map<string, SideBarItemState>
    sideMenu: AsyncState<EntityPermission[]>
    entityData: EntityData
}


export const zeroAdminState = (): AdminPageState => ({
    kind: 'admin',
    sidebarState: 'open',
    userPanelState: 'closed',
    sidePanelState: Map(),
    sideMenu: unloadedAsyncState(),
    entityData: zeroEntityData()
})