import React, { Component } from "react";

export default class Header extends Component{
    constructor(props){
        super(props)
    }

    onBottom(e,eid){
        this.props.onBottom(e,eid)
    }

    render(){
        return(
            <div>
                <div className="top-header">
                    <div className="gg-add-r" id="top-add" onClick={(e)=>this.onBottom(e, 1)}></div>
                    <div className="gg-minus-r" id="top-minus" onClick={(e)=>this.onBottom(e, 2)}></div>
                </div>
                <div className="left-header">
                    <div className="gg-add-r" id="left-add" onClick={(e)=>this.onBottom(e,3)}></div>
                    <div className="gg-minus-r" id="left-minus" onClick={(e)=>this.onBottom(e,4)}></div>
                </div>
            </div>
        )
    }
}
