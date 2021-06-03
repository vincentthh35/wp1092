// const mongoose = require('mongoose');
import mongoose from 'mongoose';

// i use mongodb://localhost:27017/cardmongo for MONGO_URL

import dotenv from 'dotenv-defaults';
dotenv.config();

function connectMongo() {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    console.log('Mongo database connected!');
  });
}

const mongo = {
  connect: connectMongo,
};

// module.exports = mongo;
export default mongo;
