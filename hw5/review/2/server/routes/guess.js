import express from 'express'
import getNumber from '../core/getNumber'
const date=new Date()
const month = (date.getMonth()+1)<10?'0'+ (date.getMonth()+1).toString():date.getMonth()
const day = date.getDate()<10?'0'+ (date.getDate()).toString():date.getDate()
const hour = date.getHours()<10?'0'+ (date.getHours()).toString():date.getHours()
const minute =date.getMinutes()<10?'0'+ (date.getMinutes()).toString():date.getMinutes()
const second = date.getSeconds()<10?'0'+ (date.getSeconds()).toString():date.getSeconds()
const winston = require('winston');
const logname = `${date.getFullYear()}-${month}-${day}-${hour}-${minute}-${second}`
let logger = winston.createLogger({
    // 當 transport 不指定 level 時 , 使用 info 等級
    //level: 'info',
     format: winston.format.combine(
      //winston.format.colorize({ all: true }),
      winston.format.timestamp({ format: 'YYYY-MM-DD-HH-mm-ss' }),
      winston.format.printf(info => `${info.message} ${info.timestamp}`)
    ),
    // 設定此 logger 的日誌輸出器
    transports: [
      // 只有 error 等級的錯誤 , 才會將訊息寫到 error.log 檔案中
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      // info or 以上的等級的訊息 , 將訊息寫入 combined.log 檔案中
      new winston.transports.File({ filename: './server/log/'+logname+'.log' }),
    ],
  })
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
  getNumber(true)
  logger.info("start number=" + getNumber())
  res.json({ msg: 'The game has started.',target: getNumber()})
})

router.get('/guess', (req, res) => {
  const number = getNumber()
  const guessed = roughScale(req.query.number, 10)
  const targetNumber = roughScale(req.query.targetNumber, 10)
  logger.info("guess " + guessed)
  // check if NOT a num or not in range [1,100]
  if (!guessed || guessed < 1 || guessed > 100) {
    res.send({ msg: 'Not a legal number.' })
  }
  else {
  // TODO: check if number and guessed are the same,
  if (guessed > targetNumber){
    res.send({ msg: 'Smaller' })
  }
  else if (guessed < targetNumber){
    res.send({ msg: 'Bigger' })
  }
  else{
    res.send({ msg: 'Equal' })
    logger.info("end-game")
  }
  // and response with some hint "Equal", "Bigger", "Smaller"
  }
})

// TODO: add router.post('/restart',...)
router.post('/restart', (_, res) => {
  getNumber(true)
  logger.info("restart " + getNumber())
  res.json({ msg: 'The game has restarted.',target: getNumber() })
})

export default router
