import * as React from 'react'
import { BootstrapButtonKinds } from '../../../utils'

interface ModalProps {
    title: string
    children?: React.ReactNode
    onCancel: () => void
    onOkay: () => void
    show: boolean
    cancelText?: string
    okayText?: string 
    okayRole?: BootstrapButtonKinds
    cancelRole?: BootstrapButtonKinds

}

export const Modal = (props: ModalProps) => {
    if (props.show) {
        return <div className="modal" style={{ display: 'block' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{props.title}</h5>
                        <button onClick={() => props.onCancel()} type="button" className="btn-close" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                       {props.children}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className={`btn btn-${props.cancelRole ? props.cancelRole : 'secondary'}`} onClick={() => props.onCancel()}>
                            {props.cancelText ? props.cancelText : "Cancel"}
                        </button>
                        <button type="button" className={`btn btn-${props.okayRole ? props.okayRole : 'primary'}`} onClick={() => props.onOkay()}>
                            {props.okayText ? props.okayText : "Okay"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
    return <></>
}