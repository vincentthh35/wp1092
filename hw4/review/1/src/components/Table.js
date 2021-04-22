import React, { Component } from "react";
import Row from "./Row"
//import Header from "../components/Header";

export default class FakeSheet extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {},
		}
	}

  render() {
    const rows = [];

    for(let i = 0; i < this.props.y + 1; i++) {
      rows.push(
        <div className="fakesheet_rows">
          <Row key={`row-${this.props.x}`} x={this.props.x} y={i} large_y={this.props.y}/>
        </div>
      )
    }

    return (
      <>
        {rows}
      </>
    );
  }
}

