import React, { Component } from "react";
import Header from "../components/Header";

class TodoApp extends Component {
    constructor(props){
        super(props);
        this.state={todolist:[],listdone:[],mode:1};
    }
    render() {
        return (
            <>
                <Header text="todos" />
                <section className="todo-app__main">
                    <input className="todo-app__input" id="todo-list" onKeyPress={(e)=>{if(e.key==="Enter"){this.setState({todolist:this.state.todolist.concat(e.target.value) , listdone:this.state.listdone.concat(false)});e.target.value="";} }}></input>
                    {
                        (getnum(this.state.listdone)===0 && this.state.todolist.length===0)?(<div></div>):(
                        <ul className="todo-app__list" id="todo-list">
                            {
                                this.state.todolist.map((e,i)=>(
                                    fil(this.state.mode,this.state.listdone[i])?(
                                    <li className="todo-app__item" key={i+1}>
                                        <div className="todo-app__checkbox">
                                            <input id={i+1} type="checkbox" onChange={(e)=>{
                                                let temp = Array.from(this.state.listdone);
                                                temp[i]=!temp[i];
                                                this.setState({listdone:temp});
                                            }}></input>
                                            <label htmlFor={i+1} style={this.state.listdone[i]?{background:"#26ca299b"}:{background:"rgba(99, 99, 99, 0.698)"}}></label>
                                        </div>
                                        <h1 className="todo-app__item-detail" style={this.state.listdone[i]?{textDecoration:"line-through",opacity:"0.5"}:{textDecoration:'none',opacity:1}}>{e}</h1>
                                        <img src="./img/x.png" alt="" className="todo-app__item-x" onClick={()=>{
                                            let temp1=[];
                                            let temp2=[];
                                            this.state.todolist.map((e,j) => {
                                                if(j!==i){
                                                    temp1.push(e);
                                                    temp2.push(this.state.listdone[j]);
                                                } 
                                            });
                                            this.setState({ todolist:temp1 , listdone:temp2})
                                        }}></img>
                                    </li>):(" ")
                                ))
                            }
                            
                        </ul>)
                    }
                </section>
                {
                (getnum(this.state.listdone)===0 && this.state.todolist.length===0)?(<div></div>):(
                <footer className="todo-app__footer" id="todo-footer">
                    <div className="todo-app__total">{getnum(this.state.listdone)} left</div>
                    <ul className="todo-app__view-buttons">
                        <button className="filter" onClick={()=>{this.setState({mode:1})}}>All</button>
                        <button className="filter" onClick={()=>{this.setState({mode:2})}}>Active</button>
                        <button className="filter" onClick={()=>{this.setState({mode:3})}}>Complete</button>
                    </ul>
                    {showclean(this.state.listdone)?(
                    <div className="todo-app__clean">
                        <button className="complete" onClick={()=>{
                            let temp1=[];
                            let temp2=[];
                            this.state.todolist.map((e,i) => {
                                if(!this.state.listdone[i]){
                                    temp1.push(e);
                                    temp2.push(false);
                                } 
                            });
                            this.setState({todolist:temp1 , listdone:temp2 , mode:1})
                        }}>Clear completed</button>
                    </div>):(<div></div>)}
                </footer>)
                }
            </>
        );
    }
}
function fil(mode,bool){
    if(mode===1){
        return true;
    }else if(mode===2){
        if(bool) return false;
        else return true;
    }else{
        if(!bool) return false;
        else return true;
    }
}
function showclean(list){
    let flag = false;
    for(let k=0;k<list.length;k++){
        if(list[k])flag=true;
    }
    return flag;
}
function getnum(list){
    let t=0;
    for(let k=0;k<list.length;k++){
        if(!list[k])t++;
    }
    return t;
}

export default TodoApp;
