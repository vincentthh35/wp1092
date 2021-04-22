import React, { Component } from "react";
import Cell from "./Cell"

export default class Row extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const cells = [];

		for(let j = 0; j < this.props.x + 1; j++) {
			cells.push(
				<Cell 
					key={`${j}-${this.props.y}`}
					x={j} y={this.props.y} large_y={this.props.large_y}
				/>
			)
		}

		return(
			<>
				{cells}
			</>
		);
	}
}