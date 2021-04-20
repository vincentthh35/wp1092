import React from "react";

// class Button extends Component {
//     render () {
//         return (
//             <button className="top-add-del-button">{this.props.text}</button>
//         )
//     }
// }

const Button = ({ onClick, text }) => {
    return (
        <button className="add-del-button" onClick={onClick}>{text}</button>
    );
}

export default Button;
