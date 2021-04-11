import * as React from 'react'
import { AsyncState, loadedAsyncState } from '../../utils';
import { Loader } from './Loader';

interface AsyncLoaderProps<T> {
    children?: React.ReactNode
    async: AsyncState<T>
    onLoad: (res: AsyncState<T>) => void
}


export class AsyncLoader<T> extends React.Component<AsyncLoaderProps<T>, never> {
    constructor(props: AsyncLoaderProps<T>) {
        super(props)
    }


    // We probably don't need this
    // componentDidMount() {
    //     if (this.props.async.kind == 'loading') {
    //         this.props.async.promise().then(res => {
    //             if (res.kind == 'result') {
    //                 this.props.onLoad(loadeddAsyncState(res.value))
    //             }
    //         })
    //     }
    // }

    componentDidUpdate(prevProps: AsyncLoaderProps<T>) {
        if (prevProps.async.kind != this.props.async.kind) {
            if (this.props.async.kind == 'loading') {
                this.props.async.promise().then(res => {
                    if (res.kind == 'result') {
                        this.props.onLoad(loadedAsyncState(res.value))
                    } else if (res.kind == 'failed') {
                        this.props.onLoad({ kind: 'failed' })
                    } else if (res.kind == 'not-found') {
                        this.props.onLoad({ kind: 'not-found' })
                    } else if (res.kind == 'unauthorized') {
                        this.props.onLoad({ kind: 'unauthorized' })
                    }
                })
            }
        }
    }

    render() {
        if (this.props.async.kind == 'loaded') {
            return <>{this.props.children}</>
        } else if (this.props.async.kind == 'loading') {
            return <Loader />
        } else if (this.props.async.kind == 'failed') {
            return <div>Failed</div>
        } else if (this.props.async.kind == 'not-found') {
            return <div>Not found</div>
        } else if (this.props.async.kind == 'unauthorized') {
            return <div>Unauthorized</div>
        } else if (this.props.async.kind == 'unloaded') {
            return <div>Not loaded</div>
        }
    }
}
