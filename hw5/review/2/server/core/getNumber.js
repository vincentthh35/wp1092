let number

const getNumber = (forceRestart = false) => {
  // TODO:
  // generate a random number if number is undefined or forceRestart is true
  if (number == undefined || forceRestart ==true){
    number = Math.ceil(Math.random()*100)
  }
  return number
}

export default getNumber
