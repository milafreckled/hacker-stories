import './App.css'
import { React, useState } from "react"
class InputWithLabel extends React.Component {
    render(){
        const{
            id,
            value,
            type="text",
            onInputChange,
            labelText,
        } = this.props
        return(
        <>
        <label htmlFor={id}>{labelText}</label> &nbsp;
        <input id={id} value={value} type={type} onChange={onInputChange} />
        </>
    )
    }
}
