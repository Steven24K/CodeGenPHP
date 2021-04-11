import { RouteParams } from "./AppState"

export type Option<a> = ({
    kind: 'some'
    value: a
} | {
    kind: 'none'
})

export const some = <a>(v: a): Option<a> => ({
    kind: 'some',
    value: v
})

export const none = <a>(): Option<a> => ({ kind: 'none' })

export type Fun<a, b> = (_: a) => b


export type Either<a, b> = ({
    kind: 'l'
    v: a
} | {
    kind: 'r'
    v: b
})

/**
 * The message kind uses the same names as the class names from bootstrap alerts 
 * https://getbootstrap.com/docs/5.0/components/alerts/
 */
type BootstrapCssType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link'

export type Message = {
    kind: Exclude<BootstrapCssType, 'link'>
    msg: string
}


export const inl = <a, b>(v: a): Either<a, b> => ({ kind: 'l', v: v })

export const inr = <a, b>(v: b): Either<a, b> => ({ kind: 'r', v: v })


export const build_breadcrumb_from_url = (): string[] => document.location.pathname.split('/')

export type FormKinds = 'unsubmitted' | 'editing' | 'submitting' | 'submitted' | 'submit-error'
/**
 * The form state goes from unsubmitted -> editing -> submitting -> submitted
 */
export interface FormState<a> {
    kind: FormKinds
    data: a
}


export type BootstrapButtonKinds = BootstrapCssType

export const routeHasChanged = (prevRoute: RouteParams, currentRoute: RouteParams) =>
    prevRoute.id != currentRoute.id ||
    prevRoute.action != currentRoute.action

export type HttpResult<T> = {
    kind: 'result'
    value: T
    status: number
} | {
    kind: 'failed' | 'unauthorized' | 'not-found'
    status: number
}

/**
 * failed, unauthorized, not-found and result are being set after laoding based on the server response. 
 */
export type AsyncState<T> = {
    kind: 'unloaded' | 'failed' | 'unauthorized' | 'not-found'
} | {
    kind: 'loaded'
    value: T
} | {
    kind: 'loading'
    promise: () => Promise<HttpResult<T>>
}

export const unloadedAsyncState = <a>(): AsyncState<a> => ({ kind: 'unloaded' })

export const loadedAsyncState = <a>(v: a): AsyncState<a> => ({ kind: 'loaded', value: v })

export const loadingAsyncState = <a>(p: () => Promise<HttpResult<a>>): AsyncState<a> => ({ kind: 'loading', promise: p })

export type EditStateMachine = 'idle' | 'editing' | "updating" | "updated" | "update-failed"