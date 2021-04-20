import Row from './Row'

export default function Board2048 ({ board, initializeBoard, gameover, win, new_grid }) {

    let boardClassName = "board";
    let infoClassName = "info";
    let outSentence = "No funding this year QAO";
    let phdSentence = "You should study a PhD!";

    if (gameover === true) {
        console.log("gameover");
        boardClassName += ' game-over-board';
        infoClassName += 'end-fade-in game-over-wrapper';
    }
    if (win === true) {
        console.log("win");
        boardClassName += ' game-over-board';
        infoClassName += ' end-fade-in game-over-wrapper';
        outSentence = phdSentence;
    }

    return (
        <>
            <table className={boardClassName} id="board-full">
                <tbody>
                    {board.map((row_vector, row_idx) => (<Row key={row_idx} row={row_vector} row_idx={row_idx} new_grid={new_grid}/>))}
                </tbody>
            </table>
            <div className={infoClassName} id="game-over-info">
                <span id="game-over-text">{outSentence}</span>
                <div className="button" id="game-over-button" onClick={initializeBoard}>Try again</div>
            </div>
        </>
    );
};
