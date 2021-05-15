import react, { Component } from "react";

class InputField extends Component {
    render () {
        return (
            <input className="base-input" placeholder={this.props.placeholder} id={this.props.id} onChange={this.props.onChange}/>
        )
    }
}

export default InputField;
