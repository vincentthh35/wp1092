import React, { Component } from "react";
import Header from "../components/Header";
import Sheet from "../components/Sheet"

class FakeSheet extends Component {
    constructor(props){
        super(props)
        this.state = {
            bottom: 0, 
        }
        this.onBottom = this.onBottom.bind(this)
        this.deBottom = this.deBottom.bind(this)
    }

    onBottom(e,eventid){
        this.setState({
            bottom: eventid,
        })
    }

    deBottom(){
        this.setState({
            bottom: 0,
        })
    }

    render() {
        return (
            <>
                <Header onBottom={this.onBottom}/>
                <Sheet deBottom={this.deBottom} eventid={this.state.bottom}/>
            </>
        );
    }
}

export default FakeSheet;

