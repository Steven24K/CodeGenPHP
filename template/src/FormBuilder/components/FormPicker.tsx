import React from 'react'
import { FormField } from '../types/FormField'




type FormPickerProps<T> = {
    defaultData: T[]
    fields: FormField[]
    id_prefix: string
    listSeperator: string
    onChange: <a>(key: string, newValue: a, index: number) => void
}
type FormPickerState<T> = {}

export default class FormPicker<T> extends React.Component<FormPickerProps<T>, FormPickerState<T>> {
    constructor(props: FormPickerProps<T>) {
        super(props)
        this.state = {
            fields: []
        }

        this.idGenerator = this.idGenerator.bind(this)
    }

    static defaultProps = {
        listSeperator: ','
    }

    idGenerator = (prefix: string, attribute_name: string, index: number): string => `${prefix}?${attribute_name}?${index}`


    render() {
        return <div>
            <div>
                {this.props.fields.map((field) => {
                    switch (field.type) {
                        case "checkbox":
                            return <div key={this.idGenerator(this.props.id_prefix, field.name, field.index)}>
                                <label>{field.name}</label>
                                {this.props.defaultData[field.index][field.name as keyof T] ?
                                    <input onChange={(event) => this.props.onChange(field.name, false, field.index)} checked type='checkbox' />
                                    :
                                    <input onChange={(event) => this.props.onChange(field.name, true, field.index)} type='checkbox' />}
                            </div>
                        case "number":
                            return <div key={this.idGenerator(this.props.id_prefix, field.name, field.index)}>
                                <label>{field.name}</label>
                                <input onChange={(event) => this.props.onChange(field.name, Number(event.target.value), field.index)} type='number' value={this.props.defaultData[field.index][field.name as keyof T] as any} />
                            </div>
                        case "text":
                            return <div key={this.idGenerator(this.props.id_prefix, field.name, field.index)}>
                                <label>{field.name}</label>
                                <input onChange={(event) => this.props.onChange(field.name, String(event.target.value), field.index)} type='text' value={this.props.defaultData[field.index][field.name as keyof T] as any} />
                            </div>
                        case "primitiveList":
                            return <div key={this.idGenerator(this.props.id_prefix, field.name, field.index)}>
                                <label>{field.name}</label>
                                <textarea onChange={(event) => {
                                    let values = event.target.value.split(this.props.listSeperator)
                                    this.props.onChange(field.name, values, field.index)
                                }} cols={30} rows={5} placeholder={`Divide values by '${this.props.listSeperator}'`} value={this.props.defaultData[field.index][field.name as keyof T] as any} />
                            </div>
                        case "nestedList":
                            return <div key={this.idGenerator(this.props.id_prefix, field.name, field.index)}>
                                <label>{field.name}</label>
                                {field.lists.map((list, index) => <textarea cols={10} rows={2} placeholder={`Divide values by '${this.props.listSeperator}'`} value={list.toString()} key={index} onChange={event => {
                                    let nestedList = this.props.defaultData[field.index][field.name as keyof T] as any
                                    nestedList[index] = event.target.value.split(this.props.listSeperator)
                                    this.props.onChange(field.name, nestedList, field.index)
                                }} />)}
                            </div>
                        case "select":
                            return <div key={this.idGenerator(this.props.id_prefix, field.name, field.index)}>
                                <label>{field.name}</label>
                                <select onChange={(event) => this.props.onChange(field.name, event.target.value, field.index)} defaultValue={this.props.defaultData[field.index][field.name as keyof T] as any}>
                                    {field.options.options.map(option => <option value={option.Second} key={option.Second}>{option.First}</option>)}
                                </select>
                            </div>
                        case "date":
                            return <div key={this.idGenerator(this.props.id_prefix, field.name, field.index)}>
                                <label>{field.name}</label>
                                <input onChange={(event) => {
                                    // date is still in the wrong format
                                    let date = event.target.value//new Date(event.target.value)
                                    this.props.onChange(field.name, date, field.index)
                                }} type='date' value={this.props.defaultData[field.index][field.name as keyof T] as any} />
                            </div>
                        case "color":
                            return <div key={this.idGenerator(this.props.id_prefix, field.name, field.index)}>
                                <label>{field.name}</label>
                                <input onChange={(event) => this.props.onChange(field.name, String(event.target.value), field.index)} type='color' value={this.props.defaultData[field.index][field.name as keyof T] as any} />
                            </div>
                        case "form":
                            return <div style={{ marginLeft: 30 }} key={this.idGenerator(this.props.id_prefix, field.name, field.index)}>
                                <label><b>{field.name}</b></label>
                                <FormPicker id_prefix={field.name}
                                    defaultData={this.props.defaultData[field.index][field.name as keyof T] as any}
                                    fields={field.fields}
                                    onChange={(key, newValue, index) => {
                                        let nested_data = this.props.defaultData[field.index][field.name as keyof T] as any
                                        let new_entry = { ...nested_data[index], [key]: newValue }
                                        nested_data[index] = new_entry
                                        //console.log(nested_data)
                                        this.props.onChange(field.name, nested_data, index)
                                    }}
                                />
                            </div>
                        case "nestedObject":
                            return <div style={{ marginLeft: 30 }} key={this.idGenerator(this.props.id_prefix, field.name, field.index)}>
                                <label><b>{field.name}</b></label>
                                <FormPicker id_prefix={field.name}
                                    defaultData={[this.props.defaultData[field.index][field.name as keyof T] as any]}
                                    fields={field.fields}
                                    onChange={(key, newValue, index) => {
                                        let nested_data = this.props.defaultData[field.index][field.name as keyof T] as any
                                        let new_entry = { ...nested_data, [key]: newValue }
                                        nested_data = new_entry
                                        console.log(nested_data)
                                        this.props.onChange(field.name, nested_data, index)
                                    }}
                                />
                            </div>
                        case "none":
                            return <div key={this.idGenerator(this.props.id_prefix, field.name, field.index)}>
                                <label>{field.name}</label>
                                {/* <span>No Field {field.type}, value: {this.props.defaultData[index]}</span> */}
                                <div>No Form</div>
                            </div>
                        default:
                            return <div>No Form</div>
                    }
                })}

            </div>
        </div>
    }
}

