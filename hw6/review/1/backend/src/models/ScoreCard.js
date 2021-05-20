// TODO: Define ScoreCardSchema
//   name   : String
//   subject: String
//   score  : Number
// export default model('ScoreCard', scoreCardSchema);

import mongoose from 'mongoose'
const Schema = mongoose.Schema; 
const scoreCardSchema = new Schema({
  name: String,
  subject: String,
  score: Number
});
const scoreCard = mongoose.model('ScoreCard', scoreCardSchema); 
export default scoreCard;
