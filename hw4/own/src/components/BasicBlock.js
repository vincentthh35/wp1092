import React, { Component } from "react";

class BasicBlock extends Component {
    constructor (props) {
        super(props);
        this.state = {
            display_state: "unfocus",
        };
    }

    componentDidMount = (props) => {
        this.click_timeout = null;
        if (this.props.select === "true" && this.props.focus !== "true") {
            document.getElementById(`${this.props.id}div`).focus();
        }
    }

    componentDidUpdate = (props) => {
        if (this.props.select === "true" && this.props.focus !== "true") {
            document.getElementById(`${this.props.id}div`).focus();
        }
    }

    handleClicks = () => {

        this.props.selectCell(this.props.row, this.props.col);

        // if (this.click_timeout !== null) {
        //     console.log("doubleClick");
        //     this.setState({display_state: "focus"})
        //
        //     clearTimeout(this.click_timeout);
        //     this.click_timeout = null;
        // } else {
        //     this.click_timeout = setTimeout(() => {
        //         console.log("oneClick");
        //         this.props.selectCell(this.props.row, this.props.col);
        //         clearTimeout(this.click_timeout);
        //         this.click_timeout = null;
        //     }, 300);
        // }
    }

    clearAndFocus = () => {
        this.props.handleReplace(this.props.row, this.props.col, "");
        this.props.focusCell(this.props.row, this.props.col);
        document.getElementById(this.props.id).value = "";
    }

    catchKey = (event) => {
        if (this.props.focus === "true") {
            // catch on
            if (event.key === "Enter") {
                console.log("catch enter");
                this.props.handleEnter(this.props.row, this.props.col);
            }
        } else if (this.props.select === "true") {
            console.log(event.key);
            if (event.key === "Backspace") {
                this.clearAndFocus();
            } else if (event.key === "Enter") {
                this.props.focusCell(this.props.row, this.props.col);
            } else {
                // input other character
                if (event.key.length === 1) {
                    this.clearAndFocus();
                }
            }
        }
    }

    render () {
        let color_style = {backgroundColor: "#FFFFFF"};
        if (this.props.color !== "") {
            color_style = {backgroundColor: `#${this.props.color}`};
        }
        if (this.props.focus === "true") {
            return (
                <div className="basic-block no-border" onClick={this.handleClicks}>
                    <input
                        className="basic-block-focus"
                        defaultValue={this.props.text}
                        id={this.props.id}
                        onKeyDown={this.catchKey}
                        style={color_style}
                        autoFocus
                    />
                </div>
            );
        } else if (this.props.select === "true") {
            console.log(`selected value: ${this.props.text}`);
            // console.log(`this.state.text: ${this.state.text}`);
            return (
                <div className="basic-block no-border" onClick={this.handleClicks} id={`${this.props.id}div`} tabIndex={-1}
                    onKeyDown={this.catchKey}>
                    <input
                        className="basic-block-focus"
                        defaultValue={this.props.text}
                        id={this.props.id}
                        style={color_style}
                    />
                </div>
            );
        } else {
            return (
                <div className="basic-block" onClick={this.handleClicks} style={color_style}>{this.props.display_text}</div>
            );
        }
    }
}

// const BasicBlock = ({row, col, text, oneClick, doubleClick}) => {
//     const [click_timeout, setClickTimeout] = useState(null);
//     const [display_state, setDisplayState] = useState("unfocus");
//
//     const makeInput = (e) => {
//         e.innerHTML = "<input value='"+e.innerText+"'>"
//     }
//
//     const handleClicks = (e) => {
//         if (click_timeout !== null) {
//             // double click
//             doubleClick();
//             makeInput(e);
//             console.log("doubleClick");
//
//             clearTimeout(click_timeout);
//             setClickTimeout(null);
//         } else {
//             // one click
//             setClickTimeout(setTimeout(() => {
//                 oneClick();
//                 clearTimeout(click_timeout);
//                 setClickTimeout(null);
//             }, 2000));
//         }
//     }
//
//     return (
//         <div className="basic-block" onClick={handleClicks(this)}>{text}</div>
//     );
// }

export default BasicBlock;
