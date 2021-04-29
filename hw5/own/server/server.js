import express from 'express'
import cors from 'cors'
import path from 'path'

import guessRoute from './routes/guess'

const isProduction = process.env.NODE_ENV === 'production'

const app = express()

// init middleware
app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
    if (isProduction && req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect('https://' + req.headers.host + req.url)
    }
    return next()
})

// define routes
app.use('/api/guess', guessRoute)

const port = process.env.PORT || 4000

if (isProduction) {
  // set static folder
    const publicPath = path.join(__dirname, '..', 'build')

    app.use(express.static(publicPath))

    app.get('*', (_, res) => {
        res.sendFile(path.join(publicPath, 'index.html'))
    })
}

// logging
import { existsSync, writeFile, mkdir } from 'fs'
import getTimeString from './core/getTimeString'
import getNumber from './core/getNumber'

// check if folder exists:
if (!existsSync('./server/log/')) {
    // create log folder
    mkdir('./server/log', (error) => { if (error) { console.log(error); }})
}

// create a new log file
// let current_time = getTimeString();
// writeFile(
//     `./server/log/${current_time}.log`,
//     `start number=${getNumber()} ${current_time}`,
//     (error) => {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log(`create file: ./server/log/${current_time}.log`);
//         }
//     }
// );
//
// export const filename = `./server/log/${current_time}`

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
})
