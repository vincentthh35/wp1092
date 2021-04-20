import React from "react";
export default ({ resetAll, unfocus, giveColor }) => (
    <div id='tool-bar'>
        <div className="tool" onClick={resetAll}>Reset</div>
        <div className="tool" onClick={unfocus}>Unfocus</div>
        <div className="tool" onClick={giveColor}>Color</div>
    </div>
)
