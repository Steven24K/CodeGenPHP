import { API_VERSION, ORIGIN } from "../../constants";
import { EntityPermission } from "../../types/EntityPermission";
import { HttpResult } from "../../utils";


export const getAllowedEntities = (action: 'view' | 'create' | 'edit' | 'delete' = 'view'): Promise<HttpResult<EntityPermission[]>> =>
    fetch(`${ORIGIN}/api/${API_VERSION}/extras/getEntitiesBasedOnRole.php?action=${action}`)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            return Promise.reject(response.statusText)
        })
        .then(data => (<HttpResult<EntityPermission[]>>{ kind: 'result', status: data._status, value: data._value }))
        .catch(reason => ({ kind: 'failed', status: 403 }))