import React, { Component, useState, useEffect } from "react";
import Header from "../components/Header";
import MainSection from "../components/MainSection"
import { Parser as FormulaParser } from "hot-formula-parser";

// class FakeSheet extends Component {
//     render() {
//         return (
//             <>
//                 <Header />
//                 <MainSection />
//             </>
//         );
//     }
// }

const FakeSheet = () => {
    const initData = (row_count, col_count) => {
        // return a 101*27 array of empty strings
        // 101*27 for convenience of changing value
        // (BasicBlock are 1-based)
        let ret = []
        for (let i = 0; i <= row_count; i++) {
            ret.push([]);
            for (let j = 0; j <= col_count; j++) {
                ret[i].push("");
            }
        }
        // console.log(ret);
        return ret;
    }

    const [row_count, setRowCount] = useState(100);
    const [col_count, setColCount] = useState(26);
    const [focus_pair, setFocusPair] = useState([0, 0]);
    const [select_pair, setSelectPair] = useState([0, 0]);
    const [data, setData] = useState(initData(100, 26));
    const [display_data, setDisplay] = useState(initData(100, 26));
    const [color_data, setColor] = useState(initData(100, 26));

    const resetAll = () => {
        setRowCount(100);
        setColCount(26);
        setFocusPair([0, 0]);
        setSelectPair([0, 0]);
        setData(initData(100, 26));
        setDisplay(initData(100, 26));
        setColor(initData(100, 26));
    }

    const addRow = () => {
        // setRowCount(row_count + 1);
        setRowCount(row_count + 1);
        let old_data = data;
        let old_display = display_data;
        let new_row = [];
        for (let i = 0; i <= col_count; i++) {
            new_row.push("");
        }
        old_data.splice(select_pair[0], 0, new_row);
        setData(old_data);
        old_display.splice(select_pair[0], 0, new_row);
        setDisplay(old_display);
    };

    const delRow = () => {
        if (select_pair[0] === 0 && select_pair[1] === 0) {
            return;
        }

        if (row_count > 0 && select_pair[0] !== 0 && select_pair[1] !== 0) {
            setRowCount(row_count - 1);
            let old_data = data;
            let old_display = display_data;
            old_data.splice(select_pair[0], 1);
            setData(old_data);
            old_display.splice(select_pair[0], 1);
            setDisplay(old_display);
        } else {
            console.log('there is nothing to delete!');
        }
    }

    const addCol = () => {
        setColCount(col_count + 1);
        let old_data = data;
        let old_display = display_data;
        for (let i = 0; i <= row_count; i++) {
            old_data[i].splice(select_pair[1], 0, "");
            old_display[i].splice(select_pair[1], 0, "");
        }
        setData(old_data);
        setDisplay(old_display);
    }

    const delCol = () => {
        if (select_pair[0] === 0 && select_pair[1] === 0) {
            return;
        }

        if (col_count > 0 && select_pair[0] !== 0 && select_pair[1] !== 0) {
            setColCount(col_count - 1);
            let old_data = data;
            let old_display = display_data;
            for (let i = 0; i <= row_count; i++) {
                old_data[i].splice(select_pair[1], 1);
                old_display[i].splice(select_pair[1], 1);
            }
            setData(old_data);
            setDisplay(old_display);
        } else {
            console.log('there is nothing to delete!');
        }
    }

    /*
    reference: (hot-formula-parser)
    https://flaviocopes.com/tutorial-react-spreadsheet/?fbclid=IwAR0-OcOf5ZXxL6UuUto9XNx13oHYjlDLnzGgXMUE9ZNigArhvo7Tt_XYxnE#introducing-formulas
    */
    let parser = new FormulaParser()

    const executeFormula = (cell, value) => {
        parser.cell = cell;
        let res = parser.parse(value);
        console.log(77777);
        console.log(res);
        if (res.error != null) {
            return res.error; // tip: returning `res.error` shows more details
        }
        if (res.result.toString() === '') {
            return res.error;
        }
        if (res.result.toString().slice(0, 1) === '=') {
            // formula points to formula
            res = executeFormula(cell, res.result.slice(1));
        }
        return res;
    }

    const parseFormula = (cell, input) => {
        input = input.toUpperCase();
        if (input.length <= 1) {
            // only '='
            return "ERROR!";
        } else {
            let result = executeFormula(cell, input.slice(1));
            console.log("AAAAA");
            if (result === null) {
                // reference an empty cell
                return "";
            } else if (result.error === null) {
                return result.result;
            } else {
                console.log(result.error);
                return "ERROR!";
            }
        }
    }

    // const parseNum = (n) => {
    //     const parsed = parseInt(n, 10);
    //     if (isNaN(parsed)) {
    //         return null;
    //     }
    //     console.log(`[parseNum] =${parsed}`);
    //     return parsed;
    // }

    // When a formula contains a cell value, this event lets us
    // hook and return an error value if necessary
    parser.on('callCellValue', (cellCoord, done) => {
        const x = cellCoord.column.index + 1;
        const y = cellCoord.row.index + 1;
        console.log(55555);

        // Check if I have that coordinates tuple in the table range
        if (x > col_count || y > row_count) {
            console.log(11111);
            throw parser.Error(this.parser.ERROR_NOT_AVAILABLE);
        }

        // Check that the cell is not self referencing
        if (parser.cell.i === x && parser.cell.j === y) {
            console.log(22222);
            throw parser.Error(this.parser.ERROR_REF);
        }

        if (!data[y] || !data[y][x]) {
            return done('');
        }

        // All fine
        console.log(`callCellValue: ${parseInt(data[y][x], 10)}`);
        return done(data[y][x]);
    });

    // When a formula contains a range value, this event lets us
    // hook and return an error value if necessary
    parser.on('callRangeValue',
        (startCellCoord, endCellCoord, done) => {
        const sx = startCellCoord.column.index + 1;
        const sy = startCellCoord.row.index + 1;
        const ex = endCellCoord.column.index + 1;
        const ey = endCellCoord.row.index + 1;
        const fragment = [];

        for (let y = sy; y <= ey; y++) {
            const row = data[y];
            if (!row) {
                continue;
            }

            const colFragment = [];

            for (let x = sx; x <= ex; x++) {
                let value = row[x];
                if (!value) {
                    value = '';
                }

                if (value.slice(0, 1) === '=') {
                    const res = executeFormula(
                        { x, y },
                        value.slice(1)
                    );
                    if (res.error) {
                        console.log(44444);
                        throw this.parser.Error(res.error);
                    }
                    value = res.result;
                }

                colFragment.push(value);
            }
            fragment.push(colFragment);
        }

        if (fragment) {
            done(fragment);
        }
    });

    const writeInput = (i, j, new_input) => {
        let old_data = data;
        old_data[i][j] = new_input;
        setData(old_data);
        console.log(`data[${i}][${j}] is now ${data[i][j]}`);
        // console.log(old_data[i][j]);
        // console.log("writeInput: " + new_input);
        if (new_input.length > 1 && new_input[0] === '=') {
            // new formula
            let new_display = display_data;
            new_display[i][j] = parseFormula({i, j}, new_input);
            // console.log("FORMULA");
            console.log(`display_data[${i}][${j}] is now ${display_data[i][j]}`);
            console.log(display_data[i][j]);
            setDisplay(new_display);
        } else {
            // no formula
            let old_display = display_data;
            old_display[i][j] = new_input;
            setDisplay(old_display);
        }
        // check dependencies
        let new_display = display_data;
        for (let i = 0; i <= row_count; i++) {
            for (let j = 0; j <= col_count; j++) {
                if (data[i][j].slice(0, 1) === '=') {
                    new_display[i][j] = parseFormula({i, j}, data[i][j]);
                }
            }
        }
        setDisplay(new_display);
        // console.log(data);
    }

    const selectCell = (i, j) => {
        // check if previous cell has some input
        if (select_pair[0] !== 0 && select_pair[1] !== 0 &&
           (select_pair[0] !== i || select_pair[1] !== j ||
            focus_pair[0] !== i || focus_pair[1] !== j)) {
            let new_input =
                document.getElementById(`${select_pair[0]}${select_pair[1]}`).value;
            if (new_input !== data[select_pair[0]][select_pair[1]]) {
                writeInput(select_pair[0], select_pair[1], new_input);
            }
        }

        // check if the selected cell is the selected
        if (select_pair[0] === i && select_pair[1] === j) {
            // console.log("select and focus");
            // setFocusPair([i, j]);
            focusCell(i, j);
            // document.getElementById(`${i}${j}`).focus();
        } else {
            setFocusPair([0, 0]);
        }
        setSelectPair([i, j]);

    }

    const focusCell = (i, j) => {
        setFocusPair([i, j]);
        // focus on input element
        if (document.getElementById(`${i}${j}`) !== null) {
            document.getElementById(`${i}${j}`).focus();
        }
    }

    const handleEnter = (i, j) => {
        let new_input =
            document.getElementById(`${select_pair[0]}${select_pair[1]}`).value;
        writeInput(i, j, new_input);
        if (i < row_count) {
            selectCell(i+1, j);
            focusCell(0, 0);
        } else {
            // stay in the same cell but not focus
            focusCell(0, 0);
        }
    }

    const handleReplace = (i, j, new_input) => {
        console.log("handleReplace");
        writeInput(i, j, new_input);
    }

    const unfocus = () => {
        setSelectPair([0, 0]);
        setFocusPair([0, 0]);
    }

    const genRandomColor = () => {
        return Math.floor(Math.random()*16777215).toString(16);
    }

    const giveColor = () => {
        if (select_pair[0] === 0 && select_pair[1] === 1) {
            return;
        }
        let old_color = color_data;
        old_color[select_pair[0]][select_pair[1]] = genRandomColor();
        setColor(old_color);
        let target = document.getElementById(`${select_pair[0]}${select_pair[1]}`);
        target.setAttribute("style", `background-color: #${old_color[select_pair[0]][select_pair[1]]}`)
    }

    return (
        <>
            <Header
                resetAll={resetAll}
                unfocus={unfocus}
                giveColor={giveColor}
            />
            <MainSection
                addRow={addRow}
                delRow={delRow}
                addCol={addCol}
                delCol={delCol}
                row_count={row_count}
                col_count={col_count}
                selectCell={selectCell}
                focusCell={focusCell}
                select_pair={select_pair}
                focus_pair={focus_pair}
                data={data}
                display_data={display_data}
                color_data={color_data}
                handleEnter={handleEnter}
                handleReplace={handleReplace}
            />
        </>
    );
}

export default FakeSheet;
