import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const scoreCardSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  score: {
    type: Number,
    required: true,
    trim: true,
  }
}, {
  timestamps: true,
});

const ScoreCard = mongoose.model('ScoreCard', scoreCardSchema);

export default ScoreCard;
