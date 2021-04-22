import React, { Component } from "react";
import Table from "../components/Table"
//import Header from "../components/Header";

export default class FakeSheet extends Component {
    constructor(props){
        super(props);
        this.state = {
            x: 10,
            y: 20
        }
    }

    render() {
        return (
            <div className="fakesheet_table">
                <div className="fakesheet_topbutton">
                    <button style={{marginBottom: '5px'}} className="fakesheet_button" onClick={() => {this.setState({x: this.state.x+1})}}>+</button>
                    <button style={{marginBottom: '5px'}} className="fakesheet_button" onClick={() => {this.setState({x: this.state.x-1})}}>-</button>
                </div>
                <div className="fakesheet_tablerow">
                    <div className="fakesheet_buttongroup">
                        <button className="fakesheet_button" onClick={() => {this.setState({y: this.state.y+1})}}>+</button>
                        <button className="fakesheet_button" onClick={() => {this.setState({y: this.state.y-1})}}>-</button>
                    </div>
                    <Table x={this.state.x} y={this.state.y}/>
                </div>
            </div>
        );
    }
}

