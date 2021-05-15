import mongoose from "mongoose";
import express from 'express';
import cors from 'cors';
import path from 'path';

// config database
import dotenv from "dotenv-defaults";
dotenv.config();

mongoose
    .connect(
        process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((res) => console.log('mongodb connection created'));

// routing
import router from './routes/operation.js';

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    if (isProduction && req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect('https://' + req.headers.host + req.url);
    }
    return next();
});

app.use('/api', router);


const port = process.env.PORT || 4000;

if (isProduction) {
    const publicPath = path.join(__dirname, '..', 'build');
    app.use(express.static(publicPath));
    app.get('*', (_, res) => {
        res.sendFile(path.join(publicPath, 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`server is up on port ${port}.`);
});
