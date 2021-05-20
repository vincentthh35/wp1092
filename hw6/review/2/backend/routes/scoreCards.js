import { Router } from 'express';
import ScoreCard from '../models/ScoreCards.js';

const router = Router();

const capitalizeFst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
//query
//params: {name: 'somename', subject: 'somesubject'}
//return: {status: success/ not found, data}
router.get('/', async function (req, res) {

  const target = {
    ...req.query
  }
  console.log(req.query);
  ScoreCard.findOne(target)
  .then(result => {
    if (result) {
      ScoreCard.find(target)
      .then(result => {
        console.log(result);
        res.status(200).send(result);
      })
    }
    else {
      console.log('cannot find');
      const keys = Object.keys(target);
      console.log(keys);
      let string = '';
      for (var i = 0; i < keys.length; i++) {
        console.log(target[keys[i]])
        if (i === keys.length - 1) {
          string = string + keys[i] + ' (' + capitalizeFst(target[keys[i]]) + '). '
        }
        else {
          string = string + keys[i] + ' (' + capitalizeFst(target[keys[i]]) + '), '
        }
      }
      res.status(230).send(string);
    }
  })
  .catch(err => res.json('Error: ' + err));
});

//delete all
//return 'Database cleared'
router.delete('/', async function (req, res) {
  console.log('clear requested')
  ScoreCard.deleteMany({})
  .then(() => res.sendStatus(200))
  .catch(err => res.json('Error: ' + err));
});

//add scoreCards
//check if (name, subject) already exists
//true --> update
//  return 'Updating (name, subject, score)!'
//**
//false -->add
//  return 'Adding (name, subject, score)!'
router.post('/add', async function (req, res) {
  const name = req.body.name;
  const subject = req.body.subject;
  const score = Number(req.body.score);
  //const existingCard = ScoreCard.find({name: name, subject: subject});
  ScoreCard.findOne({name: name, subject: subject})
  .then(result => {
    if(result) {
      //console.log(`Successfully found document: ${result}.`);
      var id = result._id;
      ScoreCard.findByIdAndUpdate(id, { score: score }, function (err, docs) {
        if (err){
          console.log(err)
        }
        else{
          console.log("Updated User : ", docs);
          res.sendStatus(200);
        }});
    } else {
      //console.log("No document matches the provided query.");
      const newScoreCard = new ScoreCard({
        name,
        subject,
        score,
      });

      newScoreCard.save()
      .then(() => res.sendStatus(210));
      //.catch(err => res.json('Error: ' + err));
    }
    return result;
  })
  .catch(err => console.error(`Failed to find document: ${err}`));
});


export default router;
