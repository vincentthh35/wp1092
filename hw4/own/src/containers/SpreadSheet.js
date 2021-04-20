import React, { useState, useEffect } from "react";
import TableIndex from "../components/TableIndex";
import BasicBlock from "../components/BasicBlock";

const SpreadSheet = ({row_count, col_count, selectCell, focusCell, select_pair, focus_pair, data, display_data, color_data, handleEnter, handleReplace}) => {

    let ret = [];

    // const [my_data, setMyData] = useState(data);
    //
    // useEffect(() => {
    //     setMyData(data);
    //     console.log("sett??");
    // }, [data]);

    const colIdToString = (n) => {
        // n is 1-based
        let temp_arr = [];
        while (n > 0) {
            let target = (n % 26 === 0)? 26: (n%26);
            temp_arr.push(target + 64);
            n -= target;
            n /= 26;
        }
        temp_arr.reverse();

        return String.fromCharCode(...temp_arr);
    };
    const rowIdToString = (n) => {
        // n is 1-based
        return String(n);
    };

    let temp_index = [];
    console.log(`select_pair: ${select_pair}\nfocus_pair: ${focus_pair}`);
    for (let i = 0; i <= row_count; i++) {
        let temp_row = [];
        for (let j = 0; j <= col_count; j++) {
            temp_index.push(i*(col_count+1) + j);
            if (i === 0 && j === 0) {
                temp_row.push(
                    <TableIndex
                        index_type="blank"
                        selected="false"
                        key={`${i}${j}`}
                    />
                );
            } else if (i === 0) {
                temp_row.push(
                    <TableIndex
                        index_type="up"
                        selected={(select_pair[1] === j) ? "true" : "false"}
                        text={colIdToString(j)}
                        key={`${i}${j}`}
                    />
                );
            } else if (j === 0) {
                temp_row.push(
                    <TableIndex
                        index_type="side"
                        selected={(select_pair[0] === i) ? "true" : "false"}
                        text={rowIdToString(i)}
                        key={`${i}${j}`}
                    />
                );
            } else {
                // console.log(my_data[i][j]);
                temp_row.push(
                    <BasicBlock
                        row={i}
                        col={j}
                        selectCell={selectCell}
                        focusCell={focusCell}
                        select={(i === select_pair[0] && j === select_pair[1]) ? "true" : "false"}
                        focus={(i === focus_pair[0] && j === focus_pair[1]) ? "true" : "false"}
                        text={(data[i][j] === "") ? "" : data[i][j]}
                        display_text={(display_data[i][j] === "") ? "" : display_data[i][j]}
                        color={(color_data[i][j] === "") ? "" : color_data[i][j]}
                        id={`${i}${j}`}
                        handleEnter={handleEnter}
                        handleReplace={handleReplace}
                        key={`${i}${j}_${data[i][j]}`}
                    />
                );
            }
        }

        ret.push(<div className={`table-row ${i === 0 ? "index-row" : ""}`} key={`row${i}`}>{temp_row}</div>)
    }
    // console.log(temp_index);
    // console.log(ret);
    return (
        ret
    );
    // return (
    //     data.map((row, i) => {
    //         return (
    //             <div className={`table-row ${i === 0 ? "index-row" : ""}`} key={`row${i}`}>
    //                 {row.map((item, j) => {
    //                     if (i === 0 && j === 0) {
    //                         return (
    //                             <TableIndex
    //                                 index_type="blank"
    //                                 selected="false"
    //                                 key={`${i}${j}`}
    //                             />
    //                         );
    //                     } else if (i === 0) {
    //                         return (
    //                             <TableIndex
    //                                 index_type="up"
    //                                 selected={(select_pair[1] === j) ? "true" : "false"}
    //                                 text={colIdToString(j)}
    //                                 key={`${i}${j}`}
    //                             />
    //                         );
    //                     } else if (j === 0) {
    //                         return (
    //                             <TableIndex
    //                                 index_type="side"
    //                                 selected={(select_pair[0] === i) ? "true" : "false"}
    //                                 text={rowIdToString(i)}
    //                                 key={`${i}${j}`}
    //                             />
    //                         );
    //                     } else {
    //                         // console.log(my_data[i][j]);
    //                         return (
    //                             <BasicBlock
    //                                 row={i}
    //                                 col={j}
    //                                 oneClick={selectCell}
    //                                 doubleClick={focusCell}
    //                                 select={(i === select_pair[0] && j === select_pair[1]) ? "true" : "false"}
    //                                 focus={(i === focus_pair[0] && j === focus_pair[1]) ? "true" : "false"}
    //                                 text={(data[i][j] === "") ? "" : data[i][j]}
    //                                 id={`${i}${j}`}
    //                                 handleEnter={handleEnter}
    //                                 handleReplace={handleReplace}
    //                                 key={`${i}${j}`}
    //                             />
    //                         );
    //                     }
    //                 })}
    //             </div>
    //         )
    //     })
    // );
};

export default SpreadSheet;
