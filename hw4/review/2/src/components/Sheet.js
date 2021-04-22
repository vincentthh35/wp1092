import React, {Component} from "react";
import Data from "../components/Data"

export default class Sheet extends Component{
    constructor(props){
        super(props)
        this.state = {
            data: new Array(100).fill().map(()=>Array(27).fill()),
            crow: -1,
            ccol: -1,
            numrow: 100,
            numcol: 27,
            equation: []
        }
        for(var i = 0; i < 100; i++){
            for(var j = 0; j < 27; j++){
                if(j != 0)
                    this.state.data[i][j] = {rowid: i+1, colid: j, value:'none', header:false, editting: false, chosen: false, overwrite: false}
                else 
                    this.state.data[i][j] = {rowid: i+1, colid: j, value: i+1, header:true, editting: false, chosen: false, overwrite: false}
            }
        }
        this.handleInput = this.handleInput.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDClick = this.handleDClick.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleOverWrite = this.handleOverWrite.bind(this)
        this.handleDelete = this.handleDelete.bind(this)

    }

    handleDelete(e, rowid, colid){
        console.log('handleDelete')
        if(e.key == 'Backspace'){
            let data = this.state.data 
            for(var i = 0; i < this.state.equation.length; i++){
                let eqa = this.state.equation[i]
                if(eqa[4] == 3 && rowid >= eqa[0] && rowid <= eqa[2] && colid >= eqa[1] && colid <= eqa[3])
                    this.state.equation[i][0] = -1 
                if(eqa[0] == rowid && eqa[1] == colid)
                    this.state.equation[i][0] = -1
                if(eqa[2] == rowid && eqa[3] == colid)
                    this.state.equation[i][0] = -1 
                if(eqa[5] == rowid && eqa[6] == colid)
                    this.state.equation[i][0] = -1
            }
            data[rowid-1][colid].value = ""
            this.setState({
                data: data
            })
        }
    }

    handleOverWrite(e, rowid, colid){
        console.log('handleOverWrite')
        let data = this.state.data 
        data[rowid-1][colid].overwrite = true 
        data[rowid-1][colid].editting = true 
        this.setState({
            data: data 
        })
    }

    handleInput(e, rowid, colid){
        console.log('handleInput')
        let data = this.state.data 
        data[rowid-1][colid].value = e.target.value
        this.setState({
            data: data
        })
    }

    handleSubmit(e, rowid, colid){
        console.log('handleSubmit')
        let data = this.state.data
        if(e.key == 'Enter'){
            if(data[rowid-1][colid].value[0] == '='){
                var eqa = this.solveEquation(data[rowid-1][colid].value)
                if(eqa !== 'ERROR!' && Array.isArray(eqa)){
                    eqa.push(rowid) 
                    eqa.push(colid)
                    this.state.equation.push(eqa)
                }
                else if(eqa === 'ERROR!')
                    data[rowid-1][colid].value = "ERROR!"
                else if(this.isNumeric(String(eqa)))
                    data[rowid-1][colid].value = String(eqa)
            }
            data[rowid-1][colid].editting = false
            var newrow = (rowid-1 < 99)? rowid+1:rowid 
            data[rowid-1][colid].chosen = false
            data[newrow-1][colid].chosen = true
            this.setState({
                data: data, 
                crow: newrow,
                equation: this.state.equation
            })
        }
    }

    handleDClick(e, rowid, colid){
        console.log('handleDclick')
        let data = this.state.data  
        data[rowid-1][colid].editting = true 
        this.setState({
            data: data
        })
    }

    handleClick(e, rowid, colid){
        console.log('handleclick')
        let data = this.state.data
        if(this.state.crow != -1 && this.state.ccol != -1){
            data[this.state.crow-1][this.state.ccol].chosen = false
            data[this.state.crow-1][this.state.ccol].editting = false
            data[this.state.crow-1][this.state.ccol].overwrite = false
        }
        data[rowid-1][colid].chosen = true
        this.setState({
            data:data,
            crow: rowid,
            ccol: colid,
        })
    }

    handleButtomEvent(eid){
        console.log('handleButtom')
        let numcol = this.state.numcol
        let numrow = this.state.numrow
        if(eid == 1){
            if(this.state.crow == -1 && this.state.ccol==-1){
                let tmp = new Array(numcol).fill()
                for(var j = 0; j < numcol; j++){
                    if(j != 0)
                        tmp[j] = {rowid: this.state.numrow+1, colid: j, value:'none', header:false, editting: false, chosen: false}
                    else 
                        tmp[j] = {rowid: this.state.numrow+1, colid: j, value: this.state.numrow+1, header:true, editting: false, chosen: false}
                }
                this.state.data.push(tmp)
                this.state.numrow += 1 
            }
            else{
                for(var i = 0; i < this.state.equation.length; i++){
                    let eqa = this.state.equation[i]
                    this.state.data[eqa[5]-1][eqa[6]].value = ""
                    if(eqa[4] == 3 && eqa[0] < this.state.crow && eqa[2] >= this.state.crow){
                        this.state.equation[i][1] = -1
                    }
                    if(eqa[0] >= this.state.crow)
                        this.state.equation[i][0] += 1 
                    if(eqa[2] >= this.state.crow)
                        this.state.equation[i][2] += 1 
                    if(eqa[5] >= this.state.crow)
                        this.state.equation[i][5] += 1 
                }
                let tmp = new Array(numcol).fill()
                for(var j = 0; j < numcol; j++){
                    if(j != 0)
                        tmp[j] = {rowid: this.state.crow, colid: j, value:'none', header:false, editting: false, chosen: false}
                    else 
                        tmp[j] = {rowid: this.state.crow, colid: j, value: this.state.crow, header:true, editting: false, chosen: false}
                }
                let data1 = this.state.data.slice(0,this.state.crow-1)
                data1.push(tmp)
                let data2 = this.state.data.slice(this.state.crow-1)
                for(var i = 0; i < data2.length; i++)
                    for(var j = 0; j < numcol; j++){
                        if(j == 0)
                            data2[i][j].value += 1
                        data2[i][j].rowid += 1 
                    }
                let data = data1.concat(data2)
                this.state.data = data 
                this.state.crow += 1 
                this.state.numrow += 1 
            }
        }
        else if(eid == 2){
            if(this.state.crow != -1 && this.state.ccol != -1){
                for(var i = 0; i < this.state.equation.length; i++){
                    let e = this.state.equation[i]
                    if(e[4] == 3 && e[0] <= this.state.crow && e[2] >= this.state.crow)
                        this.state.equation[i][1] = -1
                    if(e[0] == this.state.crow || e[2] == this.state.crow || e[5] == this.state.crow){
                        this.state.equation[i][0] = -1 
                        this.state.equation[i][2] = -1
                        if(e[5] == this.state.crow)
                            this.state.equation[i][5] = -1
                        else if(e[5] > this.state.crow)
                            this.state.equation[i][5] -= 1
                    }
                    else{
                        if(e[0] > this.state.crow)
                            this.state.equation[i][0] -= 1 
                        if(e[2] > this.state.crow)
                            this.state.equation[i][2] -= 1
                        if(e[5] > this.state.crow)
                            this.state.equation[i][5] -= 1
                    }
                }
                let data1 = this.state.data.slice(0,this.state.crow-1)
                let data2 = this.state.data.slice(this.state.crow)
                for(var i = 0; i < data2.length; i++)
                    for(var j = 0; j < numcol; j++){
                        if(j == 0)
                            data2[i][j].value -= 1
                        data2[i][j].rowid -= 1 
                    }
                let data = data1.concat(data2)
                data[this.state.crow-1][this.state.ccol].chosen = true
                this.state.data = data 
                this.state.numrow -= 1 
            }
        }
        else if(eid == 3){
            if(this.state.crow == -1 && this.state.ccol == -1){
                let data = this.state.data 
                for(var i = 0; i < numrow; i++){
                    data[i].push({rowid: i+1, colid: numcol, value:'none', header:false, editting: false, chosen: false})
                }
                this.state.data = data 
                this.state.numcol += 1
            }
            else{
                for(var i = 0; i < this.state.equation.length; i++){
                    let eqa = this.state.equation[i]
                    this.state.data[eqa[5]-1][eqa[6]].value = ""
                    if(eqa[4] == 3 && eqa[1] < this.state.ccol && eqa[3] >= this.state.ccol)
                        this.state.equation[i][0] = -1
                    if(eqa[1] >= this.state.ccol)
                        this.state.equation[i][1] += 1 
                    if(eqa[3] >= this.state.ccol)
                        this.state.equation[i][3] += 1 
                    if(eqa[6] >= this.state.ccol)
                        this.state.equation[i][6] += 1 
                }
                let data = this.state.data 
                let newdata = []
                for(var i = 0; i < numrow; i++){
                    let data1 = data[i].slice(0,this.state.ccol)
                    let data2 = data[i].slice(this.state.ccol)
                    for(var j = 0; j < data2.length; j++)
                        data2[j].colid += 1
                    data1.push({rowid: i+1, colid: this.state.ccol, value:'none', header:false, editting: false, chosen: false})
                    let rdata = data1.concat(data2)
                    newdata.push(rdata)
                }
                this.state.data = newdata 
                this.state.numcol += 1 
                this.state.ccol += 1
            }
        }
        else if(eid == 4){
            if(this.state.crow != -1 && this.state.ccol != -1){
                for(var i = 0; i < this.state.equation.length; i++){
                    let e = this.state.equation[i]
                    if(e[4] == 3 && e[1] <= this.state.ccol && e[3] >= this.state.ccol)
                        this.state.equation[i][0] = -1
                    if(e[1] == this.state.ccol || e[3] == this.state.ccol || e[6] == this.state.ccol){
                        this.state.equation[i][1] = -1 
                        this.state.equation[i][3] = -1
                        if(e[6] == this.state.ccol)
                            this.state.equation[i][6] = -1
                        else if(e[6] > this.state.ccol)
                            this.state.equation[i][6] -= 1
                    }
                    else{
                        if(e[1] > this.state.ccol)
                            this.state.equation[i][1] -= 1 
                        if(e[3] > this.state.ccol)
                            this.state.equation[i][3] -= 1
                        if(e[6] > this.state.ccol)
                            this.state.equation[i][6] -= 1
                    }
                }
                let data = this.state.data 
                let newdata = []
                for(var i = 0; i < numrow; i++){
                    let data1 = data[i].slice(0,this.state.ccol)
                    let data2 = data[i].slice(this.state.ccol+1)
                    for(var j = 0; j < data2.length; j++)
                        data2[j].colid -= 1
                    let rowdata = data1.concat(data2)
                    newdata.push(rowdata)
                }
                newdata[this.state.crow-1][this.state.ccol].chosen = true
                this.state.data = newdata
                this.state.numcol -= 1
            }
        }
    }

    NumtoLetter(number){
        var baseChar = ("A").charCodeAt(0),
            letters  = "";
      
        do {
          number -= 1;
          letters = String.fromCharCode(baseChar + (number % 26)) + letters;
          number = (number / 26) >> 0; // quick `floor`
        } while(number > 0);
      
        return letters;
    }

    LettertoNumber(letter){
        let alpha = new Array(this.state.numcol-1).fill()
        for(var i = 0; i < alpha.length; i++)
            alpha[i] = this.NumtoLetter(i+1)  
        var cidx = -1;
        for(var i = 0; i < alpha.length; i++)
            if(alpha[i] == letter){
                cidx = i+1
                break
            }
        return cidx 
    }

    isLetter(str){
        return str.length === 1 && str.match(/[a-z]/i);
    }

    isNumeric(str) {
        if (typeof str != "string") return false 
        return !isNaN(str) && 
               !isNaN(parseFloat(str)) 
      }

    solveEquation(equation){
        let x = equation.replace(/\s/g, "");
        x = x.slice(1)
        if(x.slice(0,3) == 'Sum' || x.slice(0,3) == 'sum'){
            if(x[3] != '(')
                return 'ERROR!'
            var idx1 = x.slice(4).indexOf(':')
            var idx2 = x.slice(4).indexOf(')')
            if(idx1 == -1 || idx2 == -1)
                return 'ERROR!'
            if(idx2 != x.slice(4).length-1)
                return 'ERROR!'
            var num1 = x.slice(4).slice(0,idx1)
            var num2 = x.slice(4).slice(idx1+1,idx2)
            var numidx = -1;
            for(var i = 0; i < num1.length; i++){
                if(!this.isLetter(num1[i])){
                    numidx = i 
                    break
                }
            }
            if(numidx == 0 || numidx == -1)
                return 'ERROR!'
            var cidx1 = this.LettertoNumber(num1.slice(0,numidx).toUpperCase())
            var ridx1 = Number(num1.slice(numidx))
            numidx = -1;
            for(var i = 0; i < num2.length; i++){
                if(!this.isLetter(num2[i])){
                    numidx = i 
                    break
                }
            }
            if(numidx == 0 || numidx == -1)
                return 'ERROR!'
            var cidx2 = this.LettertoNumber(num2.slice(0,numidx).toUpperCase())
            var ridx2 = Number(num2.slice(numidx))
            if(ridx1 > ridx2 || cidx1 > cidx2)
                return 'ERROR!'
            if(ridx1 > this.state.crow || ridx2 > this.state.crow || cidx1 > this.state.ccol || cidx2 > this.state.ccol)
                return 'ERROR!'
            if(ridx1 <= 0 || ridx2 <= 0 || cidx1 < 0 || cidx2 < 0)
                return 'ERROR!'
            return [ridx1, cidx1, ridx2, cidx2, 3]
        }
        else{
            if(x[0] == '('){
                if(x[x.length-1] != ')')
                    return 'ERROR!'
                var idx1 = x.indexOf('+')
                var idx2 = x.indexOf('-')
                if((idx1 != -1 && idx2 != -1) || (idx1 == -1 && idx2 == -1))
                    return 'ERROR!'
                if(idx1 != -1){
                    var num1 = x.slice(1,idx1)
                    var num2 = x.slice(idx1+1,x.length-1)
                }
                else if(idx2 != -1){
                    var num1 = x.slice(1,idx2)
                    var num2 = x.slice(idx2+1,x.length-1)
                }
                if(this.isNumeric(num1) && this.isNumeric(num2))
                    return Number(num1)+Number(num2)
                var numidx = -1;
                for(var i = 0; i < num1.length; i++){
                    if(!this.isLetter(num1[i])){
                        numidx = i 
                        break
                    }
                }
                if(numidx == 0 || numidx == -1)
                    return 'ERROR!'
                var cidx1 = this.LettertoNumber(num1.slice(0,numidx).toUpperCase())
                var ridx1 = Number(num1.slice(numidx))
                numidx = -1;
                for(var i = 0; i < num2.length; i++){
                    if(!this.isLetter(num2[i])){
                        numidx = i 
                        break
                    }
                }
                if(numidx == 0 || numidx == -1)
                    return 'ERROR!'
                var cidx2 = this.LettertoNumber(num2.slice(0,numidx).toUpperCase())
                var ridx2 = Number(num2.slice(numidx))
                if(ridx1 > this.state.crow || ridx2 > this.state.crow || cidx1 > this.state.ccol || cidx2 > this.state.ccol)
                    return 'ERROR!'
                if(ridx1 <= 0 || ridx2 <= 0 || cidx1 < 0 || cidx2 < 0)
                    return 'ERROR!'
                if(idx1 != -1)
                    return [ridx1, cidx1, ridx2, cidx2, 1]
                else 
                    return [ridx1, cidx1, ridx2, cidx2, 2]
            }
            else{
                var idx1 = x.indexOf('+')
                var idx2 = x.indexOf('-')
                if((idx1 != -1 && idx2 != -1) || (idx1 == -1 && idx2 == -1))
                    return 'ERROR!'
                if(idx1 != -1){
                    var num1 = x.slice(0,idx1)
                    var num2 = x.slice(idx1+1)
                }
                else{
                    var num1 = x.slice(0,idx2)
                    var num2 = x.slice(idx2+1)
                }
                if(this.isNumeric(num1) && this.isNumeric(num2))
                   return Number(num1)+Number(num2)
                var numidx = -1;
                for(var i = 0; i < num1.length; i++){
                    if(!this.isLetter(num1[i])){
                        numidx = i 
                        break
                    }
                }
                if(numidx == 0 || numidx == -1)
                    return 'ERROR!'
                var cidx1 = this.LettertoNumber(num1.slice(0,numidx).toUpperCase())
                var ridx1 = Number(num1.slice(numidx))
                numidx = -1;
                for(var i = 0; i < num2.length; i++){
                    if(!this.isLetter(num2[i])){
                        numidx = i 
                        break
                    }
                }
                if(numidx == 0 || numidx == -1)
                    return 'ERROR!'
                var cidx2 = this.LettertoNumber(num2.slice(0,numidx).toUpperCase())
                var ridx2 = Number(num2.slice(numidx))
                if(ridx1 > this.state.crow || ridx2 > this.state.crow || cidx1 > this.state.ccol || cidx2 > this.state.ccol)
                    return 'ERROR!'
                if(ridx1 <= 0 || ridx2 <= 0 || cidx1 < 0 || cidx2 < 0)
                    return 'ERROR!'
                if(idx1 != -1)
                    return [ridx1, cidx1, ridx2, cidx2, 1]
                else 
                    return [ridx1, cidx1, ridx2, cidx2, 2]
            }
        }
    }

    render(){
        if(this.state.crow != -1 && this.state.ccol != -1){
            var curdata = this.state.data[this.state.crow-1][this.state.ccol]
            var x = document.getElementById(String((this.state.numcol-1)*(curdata.rowid-1)+curdata.colid)).focus()
        }
        console.log(document.activeElement)
        let alpha = new Array(this.state.numcol-1).fill()
        for(var i = 0; i < alpha.length; i++)
            alpha[i] = this.NumtoLetter(i+1) 
        if(this.props.eventid != 0){
            this.handleButtomEvent(this.props.eventid)
            this.props.deBottom()
        }
        let deleteidx = []
        for(var i = 0; i < this.state.equation.length; i++){
            var equ = this.state.equation[i]
            if(equ[5] == -1){
                deleteidx.push(i)
                continue
            }
            if(this.state.data[equ[5]-1][equ[6]].editting){
                deleteidx.push(i)
                continue
            }
            if(equ[0] == -1 || equ[1] == -1 || equ[2] == -1 || equ[3] == -1){
                this.state.data[equ[5]-1][equ[6]].value = 'ERROR!'
                deleteidx.push(i)
                continue
            }
            var num1 = String(this.state.data[equ[0]-1][equ[1]].value)
            var num2 = String(this.state.data[equ[2]-1][equ[3]].value)
            if(!this.isNumeric(num1) || !this.isNumeric(num2))
                this.state.data[equ[5]-1][equ[6]].value = 'ERROR!'
            else{
                if(equ[4] == 1)
                    this.state.data[equ[5]-1][equ[6]].value = Number(num1)+Number(num2)
                else if(equ[4] == 2)
                    this.state.data[equ[5]-1][equ[6]].value = Number(num1)-Number(num2)
                else if(equ[4] == 3){
                    this.state.data[equ[5]-1][equ[6]].value = 0
                    for(var k = equ[0]-1; k < equ[2]; k++)
                        for(var j = equ[1]; j <= equ[3]; j++)
                            this.state.data[equ[5]-1][equ[6]].value += Number(this.state.data[k][j].value)
                    if(this.state.data[equ[5]-1][equ[6]].value == NaN)
                        this.state.data[equ[5]-1][equ[6]].value = 'ERROR!'
                }
            }
        }
        for(var i = 0; i < deleteidx.length; i++){
            this.state.equation.splice(deleteidx[i])
        }
        return(
                <div className='sheet-main'>
                    <tr>
                        <th></th>
                        {alpha.map((letter,idx)=>(
                            (this.state.ccol!=idx+1)? <th>{letter}</th>: <th className='selected-header'>{letter}</th>
                        ))}
                    </tr>
                    {this.state.data.map(row=>(
                        <tr>
                            {row.map(data=>(
                                <Data id={(this.state.numcol-1)*(data.rowid-1)+data.colid} crow={this.state.crow} 
                                    handleOverWrite={this.handleOverWrite} handleKey={this.handleKey} 
                                    handleClick={this.handleClick} handleDClick={this.handleDClick} 
                                    handleInput={this.handleInput} handleSubmit={this.handleSubmit} 
                                    handleDelete={this.handleDelete} data={data}/> 
                            ))}
                        </tr>
                    ))}
                </div>
        )
    }
}

