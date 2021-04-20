import React, { useState, useEffect } from "react";
import Button from "./Button";
import SpreadSheet from "../containers/SpreadSheet";

// class MainSection extends Component {
//     render () {
//         return (
//             <div className="main-section">
//                 <div className="outer-top">
//                     <div id="empty-block"></div>
//                     <div id="up-add-delete">
//                         <Button onClick={this.props.addRow} text="+"></Button>
//                         <Button onClick={this.props.delRow} text="-"></Button>
//                     </div>
//                 </div>
//                 <div className="side-add-delete"></div>
//                 <div className="spread-sheet"></div>
//             </div>
//         );
//     }
// }

const MainSection = ({addRow, delRow, addCol, delCol, row_count, col_count, selectCell, focusCell, select_pair, focus_pair, data, display_data, color_data, handleEnter, handleReplace}) => {

    useEffect(() => {
        console.log("change row_count");
    }, [row_count]);

    return (
        <div className="main-section">
            <div className="outer-top">
                <div id="empty-block"></div>
                <div id="up-add-delete">
                    <Button onClick={addCol} text="+"></Button>
                    <Button onClick={delCol} text="-"></Button>
                </div>
            </div>
            <div className="no-wrap">
                <div className="outer-side">
                    <div className="side-add-delete">
                        <Button onClick={addRow} text="+"></Button>
                        <Button onClick={delRow} text="-"></Button>
                    </div>
                </div>
                <div className="spread-sheet">
                    <SpreadSheet
                        row_count={row_count}
                        col_count={col_count}
                        selectCell={selectCell}
                        focusCell={focusCell}
                        focus_pair={focus_pair}
                        select_pair={select_pair}
                        data={data}
                        color_data={color_data}
                        display_data={display_data}
                        handleEnter={handleEnter}
                        handleReplace={handleReplace}
                    />
                </div>
            </div>
        </div>
    );
}

export default MainSection;
