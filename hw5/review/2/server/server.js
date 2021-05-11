import express from 'express'
import cors from 'cors'
import path from 'path'

import guessRoute from './routes/guess'
import getNumber from './core/getNumber'

const isProduction = process.env.NODE_ENV === 'production'
const app = express()
let fs = require('fs');
const dir = './server/log';
if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir, {
		recursive: true
	});
}


// init middleware
app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  //const action = req._parsedUrl.pathname.replace('/api/guess/',"")
  //const number = (action=="guess")?req.query.number:getNumber()
  //console.log(action)
  //console.log(req)
  if (isProduction && req.headers['x-forwarded-proto'] !== 'https')
    return res.redirect('https://' + req.headers.host + req.url)

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

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`)
})
