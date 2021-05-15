import react, { Component } from "react";

class Button extends Component {
    render () {
        let button_id = "";
        if (this.props.buttonId === "clear") {
            button_id = "clear-button";
        } else if (this.props.buttonId === "add") {
            button_id = "add-button";
        } else if (this.props.buttonId === "query") {
            button_id = "query-button";
        } else if (this.props.buttonId === "controller") {
            button_id = "controller";
        } else if (this.props.buttonId === "sort") {
            button_id = "sort";
        }

        return (
            <button id={button_id} className="base-button" onClick={this.props.onClick} disabled={this.props.disabled}>
                {this.props.buttonText}
            </button>
        )
    }
}

export default Button;
