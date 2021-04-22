import React, { Component } from "react";

export default class Cell extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			editing: false,
			selected_x: props.selected_x,
			selected_y: props.selected_y
		}
	}

	selected = (e, x, y) => {
		this.dispatchUnselectAllEvent(x, y);
		this.setState({selected_x: x, selected_y: y});
	}

	focused = (e, x, y) => {
		this.dispatchUnselectAllEvent(x, y);
		this.setState({editing: true, selected_x: x, selected_y: y});
	}

	componentDidMount() {
		window.document.addEventListener('unselectAll', this.handleUnselect);
		let body = document.querySelector('body');
        body.addEventListener('keydown', this.handleKeyDownOnSpan);
	}

	componentWillUnmount() {
		window.document.removeEventListener('unselectAll', this.handleUnselect);
		let body = document.querySelector('body');
        body.removeEventListener('keydown', this.handleKeyDownOnSpan);
	}

	handleKeyDownOnSpan = (event) => {
		if(this.state.selected_x === this.props.x && this.state.selected_y === this.props.y){
			if(event.keyCode === 8) {
				this.setState({value: ""});
			}
			this.setState({editing: true});
		}
	}

	handleUnselect = (event) => {
		this.setState({selected_x: event.flag.x, selected_y: event.flag.y});
		if(this.state.editing || this.state.selected){
			this.setState({editing: false, selected: false});
		}
	}

	dispatchUnselectAllEvent = (x, y) => {
		const unselectAllEvent = new Event('unselectAll');
		unselectAllEvent.flag = {x, y};
		window.document.dispatchEvent(unselectAllEvent);
	}

	handleChange = (event) => {
		this.setState({value:event.target.value});
	}

	handleKeyPress = (event) => {
		if(event.key === 'Enter') {
			let indexY = this.props.y;
			if(indexY < this.props.large_y){
				indexY++;
			}
			this.selected(event, this.props.x, indexY);
		}
	}

	render() {
		const selectedStyle = {
			outline: '5px auto blue',
		}

		if(this.props.x === 0) {
			if(this.props.y !== 0) {
				return(
					<span 
						className={"fakesheet_cell y_index" + (this.props.y === this.state.selected_y ? " selected" : "")}
					>
						{this.props.y}
					</span>
				)
			}
			else if(this.props.y === 0) {
				return(
					<span className={"fakesheet_cell y_index"}>
					</span>
				)
			}
		}
		else{
			if(this.props.y === 0) {
				let cell = '';
				let x = this.props.x;
				while(x > 0){
					x -= 1;
					cell = String.fromCharCode(65 + (x%26)) + cell;
					x = x/26 >> 0;
				}
				return(
					<span className={"fakesheet_cell x_index" + (this.props.x === this.state.selected_x ? " selected" : "")}>
						{cell}
					</span>
				)
			}
		}

		if(this.state.editing) {
			return(
				<input 
					type="text" 
					style={(this.state.selected_x === this.props.x && this.state.selected_y === this.props.y)?selectedStyle:null} 
					className="fakesheet_cell" 
					onChange={this.handleChange}
					value={this.state.value}
					onKeyPress={this.handleKeyPress}
					autoFocus>
				</input>
			)
		}

		return(
			<span 
				style={(this.state.selected_x === this.props.x && this.state.selected_y === this.props.y)?selectedStyle:null} 
				onClick = {e => this.selected(e, this.props.x, this.props.y)} 
				onDoubleClick = {e => this.focused(e, this.props.x, this.props.y)}
				className="fakesheet_cell"
			>
				{this.state.value}
			</span>
		);
	}
}