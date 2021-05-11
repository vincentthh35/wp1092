import express from 'express'
import { log } from 'util'
import { guess } from '../../src/axios'
import getNumber from '../core/getNumber'

const router = express.Router()

function roughScale(x, base) {
  const parsed = parseInt(x, base)
  if (isNaN(parsed)) {
    return 0
  }
  return parsed
}

// Just call getNumber(true) to generate a random number for guessing game
router.post('/start', (_, res) => {
  console.log(process.env.NAME)
  const n = getNumber(true)
  console.log(n)

 
  var fs = require('fs')
  const dateTime = Date.now()
  var date = new Date(dateTime)
  var time_str = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + date.getDate().toString()
  time_str += '-' + date.getHours().toString() + '-' + date.getMinutes().toString() + '-' + date.getSeconds().toString()

  //start number=57 2021-04-30-18-33-27
  const str = 'start number=' + n.toString() + ' ' + time_str +'\n'
  fs.appendFileSync('server/log/'+process.env.LOGFILE, str)
  
  res.json({ msg: 'The game has started.' })
})

router.get('/guess', (req, res) => {

  const number = getNumber()
  const guessed = roughScale(req.query.number, 10)

  var fs = require('fs')
  const dateTime = Date.now()
  var date = new Date(dateTime)
  var time_str = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + date.getDate().toString()
  time_str += '-' + date.getHours().toString() + '-' + date.getMinutes().toString() + '-' + date.getSeconds().toString()

  const str = 'guess ' + guessed.toString() + ' ' + time_str +'\n'
  fs.appendFileSync('server/log/'+process.env.LOGFILE, str)

  // check if NOT a num or not in range [1,100]
  if (!guessed || guessed < 1 || guessed > 100) {
    res.status(400).send({ msg: 'Not a legal number.' })
  }
  else {
  // TODO: check if number and guessed are the same,
  // and response with some hint "Equal", "Bigger", "Smaller"
    if (guessed === number){
      res.send({ msg: 'Equal'})

      var fs = require('fs')
      var logStream = fs.createWriteStream('server/log/' + process.env.LOGFILE, {flags: 'a'});
      logStream.once('open', function(fd) {
        logStream.write('end-game\n');
      });
    }
    else if (guessed < number){
      res.send({ msg: "Bigger"})
    }
    else{
      res.send({msg: "Smaller"})
    }
  }
})

// TODO: add router.post('/restart',...)
router.post('/restart', (_, res)=>{
  const n = getNumber(true)
  console.log(n)

  var fs = require('fs')
  const dateTime = Date.now()
  var date = new Date(dateTime)
  var time_str = date.getFullYear().toString() + '-' + (date.getMonth()+1).toString() + '-' + date.getDate().toString()
  time_str += '-' + date.getHours().toString() + '-' + date.getMinutes().toString() + '-' + date.getSeconds().toString()

  const str = 'restart number=' + n.toString() + ' ' + time_str +'\n'
  var logStream = fs.createWriteStream('server/log/'+process.env.LOGFILE, {flags: 'a'});
  logStream.once('open', function(fd) {
    logStream.write(str);
  });

  res.json({msg: "The game has restarted."})
})

export default router
