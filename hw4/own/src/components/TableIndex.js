import React from "react";

const TableIndex = ({index_type, selected, text}) => {
    if (index_type === "blank") {
        return (
            <div id="blank-table-index"></div>
        );
    } else if (index_type === "side") {
        return (
            <div
                className={`side-table-index ${selected === "true" ? "selected-index" : ""} `}
            >
                {text}
            </div>
        );
    } else if (index_type === "up") {
        return (
            <div
                className={`up-table-index ${selected === "true" ? "selected-index" : ""}`}
            >
                {text}
            </div>
        );
    } else {
        console.log("??? TableIndex ???");
    }
};

export default TableIndex;
