import express from 'express';
import clearDB from '../core/clearDB.js';
import addDB from '../core/addDB.js';
import queryDB from '../core/queryDB.js';

const router = express.Router();

router.delete('/clearDB', (_, res) => {
    console.log('clearDB');
    clearDB()
        .then(ret => res.json({ msg: ret }))
        .catch(error => res.status(500).send({ msg: error }));
    // console.log(res.res);
});

router.post('/addDB', (req, res) => {
    const name = req.body.params.name;
    const subject = req.body.params.subject;
    const score = req.body.params.score;

    if (!name || !subject || !score) {
        console.error(`Error in /addDB: ${name}, ${subject}, ${score}`);
        res.json({ msg: 'Error in /addDB' });
        return;
    }

    addDB(name, subject, score)
        .then(ret => res.json({ msg: ret }))
        .catch(error => res.status(500).send({ msg: error }));
});

router.get('/queryDB', (req, res) => {
    const query = req.query.query;
    const queryMode = req.query.queryMode;

    if (!query || !queryMode) {
        console.error(`Error in queryDB: ${query}, ${queryMode}`);
        res.json({ msg: 'Error in /queryDB' });
        return;
    }

    queryDB(query, queryMode)
        .then(ret => res.json({ msg: ret }))
        .catch(error => {
            if (error.slice(0, 11) !== 'query error') {
                res.status(400).send({ msg: error });
            } else {
                res.status(500).send({ msg: error });
            }
        });
});

export default router;
