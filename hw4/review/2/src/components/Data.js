import React, {Component} from "react";

export default class Data extends Component{
    constructor(props){
        super(props)
    }

    handleDClick(e){
        this.props.handleDClick(e,this.props.data.rowid, this.props.data.colid)
    }

    handleSubmit(e){
        this.props.handleSubmit(e,this.props.data.rowid,this.props.data.colid)
    }

    handleInput(e){
        this.props.handleInput(e, this.props.data.rowid,this.props.data.colid)
    }

    handleClick(e){
        this.props.handleClick(e, this.props.data.rowid,this.props.data.colid)
    }

    handleOverWrite(e){
        this.props.handleOverWrite(e, this.props.data.rowid, this.props.data.colid)
    }

    handleDelete(e){
        this.props.handleDelete(e, this.props.data.rowid, this.props.data.colid)
    }

    render(){
        if(!this.props.data.editting){
            if(this.props.data.header){
                if(this.props.crow != this.props.data.rowid)
                    return <th>{this.props.data.value}</th>
                else 
                    return <th className="selected-header">{this.props.data.value}</th>
            }
            else{
                if(this.props.data.value == 'none'){
                    if(!this.props.data.chosen){
                        return <td tabIndex={this.props.id} onKeyPress={(e)=>this.handleOverWrite(e)} id={this.props.id}
                                onClick={(e)=>this.handleClick(e)} onDoubleClick={(e)=>this.handleDClick(e)}></td>
                    }
                    else{
                        return(
                            <td className='chosen-box' tabIndex={this.props.id} onKeyPress={(e)=>this.handleOverWrite(e)}
                                onClick={(e)=>this.handleClick(e)} onDoubleClick={(e)=>this.handleDClick(e)} id={this.props.id}> 
                                    
                            </td>
                        )
                    }
                }
                else{
                    if(!this.props.data.chosen){
                        return <td tabIndex={this.props.id} onClick={(e)=>this.handleClick(e)} onKeyPress={(e)=>this.handleOverWrite(e)}
                                    onDoubleClick={(e)=>this.handleDClick(e)} id={this.props.id}>{this.props.data.value}</td>
                    }
                    else{
                        return (
                            <td tabIndex={this.props.id} className='chosen-box' onClick={(e)=>this.handleClick(e)} id={this.props.id}
                                   onKeyDown={(e)=>this.handleDelete(e)} onDoubleClick={(e)=>this.handleDClick(e)} onKeyPress={(e)=>this.handleOverWrite(e)}> 
                                {this.props.data.value}
                            </td>
                        )
                    }
                }
            }
        }
        else{
            if(this.props.data.value == 'none' || this.props.data.overwrite){
                return <td className='chosen-box' id={this.props.id}><input tabIndex={this.props.id} autoFocus  onInput={(e)=>this.handleInput(e)} 
                            onKeyPress={(e)=>this.handleSubmit(e)}></input></td>
            }
            else{
                return <td className='chosen-box' id={this.props.id}><input tabIndex={this.props.id} autoFocus  value={this.props.data.value} onInput={(e)=>this.handleInput(e)} 
                            onKeyPress={(e)=>this.handleSubmit(e)}></input></td>
            }
        }
    }   
}