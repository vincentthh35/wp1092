import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { guess, startGame, restart } from './axios'

function App() {
    const [hasStarted, setHasStarted] = useState(false)
    const [hasWon, setHasWon] = useState(false)
    const [number, setNumber] = useState('')
    const [status, setStatus] = useState('')
    const [lastNumber, setLast] = useState(undefined)


    const startMenu = (
        <div>
            <button
                onClick={async () => {
                    const res = await startGame()
                    console.log(res);
                    setHasStarted(true)
                }}
            >
                start game
            </button>
        </div>
    )

    const winningMode = (
        <>
            <p>you won! the number was {number}.</p>
            <button
                onClick={async () => {
                    await restart()
                    setHasWon(false)
                    setStatus('')
                    setNumber('')
                }}
            >
                restart
            </button>
        </>
    )

    // TODO:
    // 1. use async/await to call guess(number) in Axios
    // 2. Process the response from server to set the proper state values
    const handleGuess = useCallback(async () => {
        if (number === lastNumber) {
            setStatus('This is the same number you guessed!');
        } else {
            const res = await guess(number);
            console.log(res);
            if (res === 'Equal') {
                setHasWon(true);
            } else {
                setStatus(res);
                setLast(number);
            }
        }
    }, [number, lastNumber]);

    const handleKeydown = useCallback((event) => {
        if (event.key === 'Enter') {
            console.log(number);
            if (number !== "") {
                handleGuess();
            }
        }
    }, [handleGuess, number]);

    useEffect(() => {
        let input = document.getElementById('input');
        if (input !== undefined && input !== null) {
            input.addEventListener('keydown', handleKeydown);
        }

        return (() => {
            let input = document.getElementById('input');
            if (input !== null && input !== undefined) {
                input.removeEventListener('keydown', handleKeydown);
            }
        });
    }, [hasStarted, handleKeydown]);

    const gameMode = (
        <>
            <p>Guess a number between 1 to 100</p>
            <input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                id="input"
            ></input>
            <button
                onClick={handleGuess}
                disabled={!number}
            >
                guess!
            </button>
            <p>{status}</p>
        </>
    )

    const game = (
        <div>
            {hasWon ? winningMode : gameMode}
        </div>
    )

    return <div className="App">{hasStarted ? game : startMenu}</div>
}

export default App
