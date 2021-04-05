import React, { Component } from "react";
import Button from "./Button";

class MainSection extends Component {
    render () {
        return (
            <div className="main-section">
                <div className="outer-top">
                    <div id="empty-block"></div>
                    <div id="up-add-delete">
                        <Button onClick={this.props.addRow} text="+"></Button>
                        <Button onClick={this.props.delRow} text="-"></Button>
                    </div>
                </div>
                <div className="side-add-delete"></div>
                <div className="spread-sheet"></div>
            </div>
        );
    }
}

export default MainSection;
