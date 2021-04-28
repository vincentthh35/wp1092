import express from 'express'
import getNumber from '../core/getNumber'

// import { filename } from '../server'
import { appendFile, writeFile } from 'fs'
import getTimeString from '../core/getTimeString'

const router = express.Router()

function roughScale(x, base) {
    const parsed = parseInt(x, base)
    if (isNaN(parsed)) {
        return 0
    }
    return parsed
}

let filename;

// Just call getNumber(true) to generate a random number for guessing game
router.post('/start', (_, res) => {
    getNumber(true)
    filename = `./server/log/${getTimeString()}.log`
    let current_time = getTimeString()
    writeFile(
        filename,
        `start number=${getNumber()} ${current_time}\n`,
        (error) => {
            if (error) {
                console.log(error);
            } else {
                console.log(`create file: ./server/log/${current_time}.log`);
            }
        }
    );
    res.json({ msg: 'The game has started.' })
})

router.get('/guess', (req, res) => {
    const number = getNumber()
    const guessed = roughScale(req.query.number, 10)

    // check if NOT a num or not in range [1,100]
    if (!guessed || guessed < 1 || guessed > 100) {
        res.status(400).send({ msg: 'Not a legal number.' })
    }
    else {
        // logging
        appendFile(
            filename,
            `guess ${guessed} ${getTimeString()}\n`,
            (error) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('successfully append file!');
                }
            }
        )
        // return hint
        if (guessed > number) {
            res.json({ msg: "Smaller" });
        } else if (guessed < number) {
            res.json({ msg: "Bigger" });
        } else {
            appendFile(filename, `end-game\n`, (error) => { if (error) { console.error(error); } })
            res.json({ msg: "Equal" });
        }
    }
})

// TODO: add router.post('/restart',...)
router.post('/restart', (req, res) => {
    getNumber(true);
    appendFile(filename, `restart number=${getNumber()} ${getTimeString()}\n`, (error) => { if (error) { console.error(error); } })
    res.json({ msg: 'Restarted' });
})

export default router
