import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createRequire } from 'module';
import scoreCardsRouter from './routes/scoreCards.js'
const require = createRequire(import.meta.url);

require('dotenv-defaults').config(); //dotenv

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URL;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,}
);
const connection = mongoose.connection;

connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

app.use('/scoreCards', scoreCardsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
