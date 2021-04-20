// Designed by Ming-Yang, Ho (https://github.com/Kaminyou)
import React, { Component } from 'react';
import Header from '../components/Header';
import Board2048 from '../components/Board2048'
import '../containers/MergeSchool.css';

let secret_seed = 1;
const tokenString = "Kaminyou".split("");
for(let i = 0; i < tokenString.length; i++){
    secret_seed *= tokenString[i].charCodeAt(0);
    secret_seed = secret_seed % 0xffffffff;
}

class MergeSchool extends Component {
    constructor(props) {
        super(props);
        this.state = {
            board: [[0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0],
                    [2,2,0,0]], // the 4*4 board
            qs_ranking: 32768, // qs ranking now
            best_qs_ranking: 32768, // the best ranking
            gameover: false, // flag for game over
            step: 0, // step
            win: false, // flag for win i.e. get a "65536" grid
            seed: secret_seed,
            new_grid: [[3, 0], [3, 1]]
        };

    }

    componentDidMount = () => {
        // add event listener
        let body = document.querySelector('body');
        body.addEventListener('keydown', this.handleKeyDown);
    }

    // Pesudo random number generator
    // 4 bytes hashing function By Thomas Wang or Robert Jenkins
    prng = (seed, salt, mod) => {
        let temp = seed + salt;
        temp = (temp+0x7ed55d16) + (temp<<12);
        temp = (temp^0xc761c23c) ^ (temp>>19);
        temp = (temp+0x165667b1) + (temp<<5);
        temp = (temp+0xd3a2646c) ^ (temp<<9);
        temp = (temp+0xfd7046c5) + (temp<<3);
        temp = (temp^0xb55a4f09) ^ (temp>>16);
        if( temp < 0 ) temp = 0xffffffff + temp;
        return (temp % mod);
    }

    // Create board and add two "2" and reset everything required
    initializeBoard = () => {
        let board = [[0,0,0,0],
                     [0,0,0,0],
                     [0,0,0,0],
                     [0,0,0,0]];
        let boardset = this.putGridRandom(board, true);
        boardset = this.putGridRandom(boardset.board, true);
        // #########################
        // # 7 Add something yourself
        // boardset.board will be the initial board, please use it directly
        // #########################
        this.setState({
            board: boardset.board,
            qs_ranking: 32768, // qs ranking now
            gameover: false, // flag for game over
            step: 0, // step
            win: false, // flag for win i.e. get a "65536" grid
            seed: secret_seed,
            new_grid: [[3, 0], [3, 1]]
        })
    }



    // Get all empty x y coordinates in board
    getEmptyGrid = (board) => {
        let empty_grid = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j<4; j++) {
                if (board[i][j] === 0) {
                    empty_grid.push([i, j])
                }
            }
        }
        return empty_grid;
    }

    // Put one "2" in random empty grid
    putGridRandom = (board, init) => {
        let empty_grid = this.getEmptyGrid(board);
        let random_num = this.prng(this.state.seed, this.state.step, empty_grid.length);
        if (init){
            random_num = this.prng(this.state.seed, 0, empty_grid.length);
        }
        let random_empty_grid = empty_grid[random_num];
        board[random_empty_grid[0]][random_empty_grid[1]] = 2;
        this.setState({new_grid: [random_empty_grid]})
        return {board};
    }

    // Check if one move is effecitve
    justifyMove = (prev, next) => {
        let prev_string = JSON.stringify(prev)
        let new_string = JSON.stringify(next)
        return (prev_string !== new_string) ? true : false;
    }

    // Move
    moveGrid = (direction) => {
        if (!this.state.gameover) {
            if (direction === 'right') {
                const nextBoard = this.moveRight(this.state.board);
                this.checkAndUpdateAfterMove(nextBoard);
            } else if (direction === "left") {
                const nextBoard = this.moveLeft(this.state.board);
                this.checkAndUpdateAfterMove(nextBoard);
            } else if (direction === 'up') {
                const nextBoard = this.moveUp(this.state.board);
                this.checkAndUpdateAfterMove(nextBoard);
            } else if (direction === 'down') {
                const nextBoard = this.moveDown(this.state.board);
                this.checkAndUpdateAfterMove(nextBoard);
            }
            // #########################
            // # 8 Implement yourself
            // #########################
        }
    }

    // Check everything after one move including gameover and win
    // Also, the step, ranking, best ranking should be updated here
    checkAndUpdateAfterMove = (nextBoard) => {
        if (this.justifyMove(this.state.board, nextBoard.board)) {
            const nextBoardSetWithRandom = this.putGridRandom(nextBoard.board, false);
            let qsRankNow = this.state.qs_ranking;
            let stepNow = this.state.step;

            // #########################
            // # 4 Implement yourself
            // #########################
            // console.log(stepNow + 1);
            this.setState({step: stepNow + 1});

            // #########################
            // # 5 Implement yourself
            // #########################

            if (nextBoard.combination > 0) {
                this.setState({qs_ranking: qsRankNow - 1});
                if (qsRankNow - 1 < this.state.best_qs_ranking) {
                    this.setState({best_qs_ranking: qsRankNow - 1});
                }
            }

            this.setState({board: nextBoardSetWithRandom.board});

            // #########################
            // # 7 Implement yourself
            // #########################

            if (this.checkGameover(nextBoardSetWithRandom.board)) {
                this.setState({gameover: true});
            }

            if (this.checkWin(nextBoardSetWithRandom.board)) {
                this.setState({win: true});
            }
        }
    }

    // Moveup function
    // Moveright function
    moveRight = (prevBoard) => {
        let board = [];
        let combination = 0;

        for (let r = 0; r < prevBoard.length; r++) {
            let row = [];
            for (let c = 0; c < prevBoard[r].length; c++) {
                let current = prevBoard[r][c];
                (current === 0) ? row.unshift(current) : row.push(current);
            }
            board.push(row);
        }

        for (let r = 0; r < board.length; r++) {
            // special case
            if ((board[r][0] === board[r][1]) && (board[r][0] !== 0) && (board[r][2] === board[r][3]) && (board[r][2] !== 0)) {
                board[r][3] = board[r][3] * 2;
                board[r][2] = board[r][1] * 2;
                board[r][1] = 0;
                board[r][0] = 0;
                combination += 2;
                continue;
            }

            for (let c = board[r].length - 1; c > 0; c--) {
                if (board[r][c] > 0 && board[r][c] === board[r][c - 1]) {
                    board[r][c] = board[r][c] * 2;
                    board[r][c - 1] = 0;
                    combination += 1;
                } else if (board[r][c] === 0 && board[r][c - 1] > 0) {
                    board[r][c] = board[r][c - 1];
                    board[r][c - 1] = 0;
                }
            }
        }

        return {board, combination};
    }

    moveUp = (prevBoard) => {
        // #########################
        // # 8 Implement yourself
        // #########################
        let board = [];
        let combination = 0;

        for (let c = 0; c < prevBoard[0].length; c++) {
            let col = [];
            for (let r = prevBoard[c].length - 1; r >= 0; r--) {
                let current = prevBoard[r][c];
                (current === 0) ? col.push(current) : col.unshift(current);
            }
            board.push(col);
        }
        // console.log(board);

        // for (let r = 0; r < prevBoard.length; r++) {
        //     let row = [];
        //     for (let c = 0; c < prevBoard[r].length; c++) {
        //         let current = prevBoard[r][c];
        //         (current === 0) ? row.unshift(current) : row.push(current);
        //     }
        //     board.push(row);
        // }

        for (let r = 0; r < board.length; r++) {
            // special case
            if ((board[r][0] === board[r][1]) && (board[r][0] !== 0) && (board[r][2] === board[r][3]) && (board[r][2] !== 0)) {
                board[r][0] = board[r][0] * 2;
                board[r][1] = board[r][2] * 2;
                board[r][2] = 0;
                board[r][3] = 0;
                combination += 2;
                continue;
            }
            for (let c = 0; c < board[r].length - 1; c++) {
                if (board[r][c] > 0 && board[r][c] === board[r][c+1]) {
                    board[r][c] = board[r][c] * 2;
                    board[r][c+1] = 0;
                    combination += 1;
                } else if (board[r][c] === 0 && board[r][c+1] > 0) {
                    board[r][c] = board[r][c+1];
                    board[r][c+1] = 0;
                }
            }
        }
        // transpose back to correct direction
        let new_board = [];
        for (let c = 0; c < board[0].length; c++) {
            let row = [];
            for (let r = 0; r < board.length; r++) {
                row.push(board[r][c]);
            }
            new_board.push(row);
        }
        return {board: new_board, combination};
    }

    // Movedown function
    moveDown = (prevBoard) => {
        // #########################
        // # 8 Implement yourself
        // #########################
        let board = [];
        let combination = 0;

        for (let c = 0; c < prevBoard[0].length; c++) {
            let col = [];
            for (let r = 0; r < prevBoard.length; r++) {
                let current = prevBoard[r][c];
                (current === 0) ? col.unshift(current) : col.push(current);
            }
            board.push(col);
        }

        for (let r = 0; r < board.length; r++) {
            // special case
            if ((board[r][0] === board[r][1]) && (board[r][0] !== 0) && (board[r][2] === board[r][3]) && (board[r][2] !== 0)) {
                board[r][3] = board[r][3] * 2;
                board[r][2] = board[r][1] * 2;
                board[r][1] = 0;
                board[r][0] = 0;
                combination += 2;
                continue;
            }

            for (let c = board[r].length - 1; c > 0; c--) {
                if (board[r][c] > 0 && board[r][c] === board[r][c - 1]) {
                    board[r][c] = board[r][c] * 2;
                    board[r][c - 1] = 0;
                    combination += 1;
                } else if (board[r][c] === 0 && board[r][c - 1] > 0) {
                    board[r][c] = board[r][c - 1];
                    board[r][c - 1] = 0;
                }
            }
        }
        // transpose back to correct direction
        let new_board = [];
        for (let c = 0; c < board[0].length; c++) {
            let row = [];
            for (let r = 0; r < board.length; r++) {
                row.push(board[r][c]);
            }
            new_board.push(row);
        }
        return {board: new_board, combination};
        // let board = prevBoard;
        // let combination = 0;
        // return {board, combination};
    }

    // Moveleft function
    moveLeft = (prevBoard) => {
        // #########################
        // # 8 Implement yourself
        // #########################
        let board = [];
        let combination = 0;

        for (let r = 0; r < prevBoard.length; r++) {
            let row = [];
            for (let c = prevBoard[r].length - 1; c >= 0; c--) {
                let current = prevBoard[r][c];
                (current === 0) ? row.push(current) : row.unshift(current);
            }
            board.push(row);
        }

        for (let r = 0; r < board.length; r++) {
            // special case
            if ((board[r][0] === board[r][1]) && (board[r][0] !== 0) && (board[r][2] === board[r][3]) && (board[r][2] !== 0)) {
                board[r][0] = board[r][0] * 2;
                board[r][1] = board[r][2] * 2;
                board[r][2] = 0;
                board[r][3] = 0;
                combination += 2;
                continue;
            }
            for (let c = 0; c < board[r].length - 1; c++) {
                if (board[r][c] > 0 && board[r][c] === board[r][c+1]) {
                    board[r][c] = board[r][c] * 2;
                    board[r][c+1] = 0;
                    combination += 1;
                } else if (board[r][c] === 0 && board[r][c+1] > 0) {
                    board[r][c] = board[r][c+1];
                    board[r][c+1] = 0;
                }
            }
            // for (let c = board[r].length - 1; c > 0; c--) {
            //     if (board[r][c] > 0 && board[r][c] === board[r][c - 1]) {
            //         board[r][c] = board[r][c] * 2;
            //         board[r][c - 1] = 0;
            //         combination += 1;
            //     } else if (board[r][c] === 0 && board[r][c - 1] > 0) {
            //         board[r][c] = board[r][c - 1];
            //         board[r][c - 1] = 0;
            //     }
            // }
        }

        return {board, combination};
    };

    // Rotate the matrix clockwisely
    rotateClockwise = (matrix) => {
        let result = [];
        for(let i = 0; i < matrix[0].length; i++) {
            let row = matrix.map(e => e[i]).reverse();
            result.push(row);
        }
        return result;
    };

    // Rotate the matrix counterclockwisely
    rotateCounterClockwise = (matrix) => {
        // #########################
        // # 8 Implement yourself
        // #########################
        let result = [];
        for(let i = 0; i < matrix[0].length; i++) {
            let row = matrix.map(e => e[i]);
            result.unshift(row);
        }
        return result;
    };

    // Check if it is gameover
    checkGameover = (board) => {
        console.log("in checkGameover");
        // #########################
        // # 9 Implement yourself
        // #########################
        if (this.justifyMove(board, this.moveDown(board).board) === false &&
            this.justifyMove(board, this.moveUp(board).board) === false &&
            this.justifyMove(board, this.moveRight(board).board) === false &&
            this.justifyMove(board, this.moveLeft(board).board) === false) {
                console.log("gameover true");
                return true;
        }
        return false;
    };

    // Check if it is win
    checkWin = (board) => {
        // #########################
        // # 10 Implement yourself
        // #########################
        for (let r = 0; r < board.length; r++) {
            for (let c = 0; c < board[r].length; c++) {
                if (board[r][c] === 65536) {
                    return true;
                }
            }
        }
        return false;
    };

    // #########################
    // # 4 Implement yourself
    // You might need something to capture keyboard input
    // #########################

    handleKeyDown = (event) => {
        event.preventDefault();
        console.log(event.key);
        if (event.keyCode === 39) {
            this.moveGrid("right");
        } else if (event.key === 'ArrowLeft') {
            this.moveGrid("left");
        } else if (event.key === 'ArrowUp') {
            this.moveGrid("up");
        } else if (event.key === 'ArrowDown') {
            this.moveGrid("down");
        }
        // #########################
        // # 8 Implement yourself
        // #########################

    }

    // Useful function for you to check the endgame
    setBadEnd = () => {
        let nextBoard = [[2,4,2,4],
                        [4,2,4,2],
                        [2,4,2,128],
                        [4,128,2,2]];
        this.setState({board: nextBoard});
    }

    // Useful function for you to check the best result
    setGoodEnd = () => {
        let nextBoard = [[2,2,4,8],
                        [128,64,32,16],
                        [256,512,1024,2048],
                        [32768,16384,8192,4096]];
        this.setState({board: nextBoard});
    }

    render() {
        return (
            <>
                <Header
                    qs_ranking={this.state.qs_ranking}
                    step={this.state.step}
                    best_qs_ranking={this.state.best_qs_ranking}
                    initializeBoard={this.initializeBoard}
                />
                <Board2048 className="wrapper" board={this.state.board} initializeBoard={this.initializeBoard} gameover={this.state.gameover} win={this.state.win} new_grid={this.state.new_grid}/>
                <div className="btn-groups">
                    <div className="btn-useful" id="badend-btn" onClick={this.setBadEnd}>BadEnd</div>
                    <div className="btn-useful" id="goodend-btn" onClick={this.setGoodEnd}>GoodEnd</div>
                </div>
            </>
        );
    }
};

export default MergeSchool;
