import React from 'react'
import { FormField } from "../types/FormField"
import { Query } from "../LazyFormBuilder"
import { FormBuilder } from '../FormBuilder'
import FormPicker  from './FormPicker'

type FormMasterProps<T> = {
    defaultData: T[]
    query: Query<T, any, any>
    id_prefix: string
    listSeperator: string
    onChange: <a>(key: string, newValue: a, index: number) => void

}
type FormMasterState = {
    fields: FormField[]
}
export default class FormMaster<T> extends React.Component<FormMasterProps<T>, FormMasterState> {
    constructor(props: FormMasterProps<T>) {
        super(props)
        this.state = { fields: [] }
    }

    static defaultProps = {
        listSeperator: ','
    }

    componentDidUpdate(prevProps: FormMasterProps<T>, prevState: FormMasterState) {
        if (!Object.is(this.props.defaultData, prevProps.defaultData)) {
            this.setState({ ...this.state, fields: FormBuilder.Entities(this.props.defaultData, this.props.query).getFields() })
        }
    }

    componentDidMount() {
        this.setState({ ...this.state, fields: FormBuilder.Entities(this.props.defaultData, this.props.query).getFields() })
    }

    render() {
        return <FormPicker id_prefix={this.props.id_prefix}
            defaultData={this.props.defaultData}
            fields={this.state.fields}
            onChange={this.props.onChange}
            listSeperator={this.props.listSeperator} />
    }
}