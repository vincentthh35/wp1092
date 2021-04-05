import React, { Component } from "react";

class Button extends Component {
    render () {
        return (
            <button className="top-add-del-button">{this.props.text}</button>
        )
    }
}

export default Button;
