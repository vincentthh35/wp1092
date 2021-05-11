import axios from 'axios'

const instance = axios.create({ baseURL: 'http://localhost:4000/api/guess' })
let targetNumber
const startGame = async () => {
  try{
    const {
    data: { msg, target }
    } = await instance.post('/start')
    targetNumber = target
    return msg
  }catch{
    return 0
  }
  /*
  const {
    data: { msg }
  } = await instance.post('/start')
  */
  //return msg
}

const guess = async (number) => {
  //console.log(targetNumber)

  // TODO: Change this to catch error
  // The error message should be: Error: "xx" is not a valid number (1 - 100)
  try{
    const {
    data: { msg }} = await instance.get('/guess', { params: { number, targetNumber} });
    if (msg==='Not a legal number.'){
      return `Error: "${number}" is not a valid number`
    }
    return msg;
  }catch{
    return 0
  }
  /*
  const {
    data: { msg }
  } = await instance.get('/guess', { params: { number } })*/
  //return msg
}

const restart = async () => {
  try{
    const {
    data: { msg, target }
    } = await instance.post('/restart')
    targetNumber=target
    return msg
  }catch{
    return 0
  }
  /*
  const {
    data: { msg }
  } = await instance.post('/restart')

  return msg*/
}

export { startGame, guess, restart }
