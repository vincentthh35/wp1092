import { Router } from 'express';
import ScoreCard from '../../models/ScoreCard';

const router = Router();

const saveCard = async (name, subject, score)=>{
  const existing = await ScoreCard.findOne({name:name, subject:subject});
  let msg;
  if(existing){
    existing.score = score;
    existing.save();
    msg = `Updating(${name}, ${subject}, ${score})`
    console.log("updateing:", existing)
    return [msg, existing]
  }
  else{
    try{
      const newScoreCard = new ScoreCard({name, subject, score});
      newScoreCard.save();
      msg = `Adding(${name}, ${subject}, ${score})`
      console.log("adding:", newScoreCard)
      return [msg, newScoreCard] 
    }
    catch(e){
      throw new Error("Card creation error: " + e); } 
    }
}

const findCard = async(type, string)=>{
  let queryResult;
  if(type=="name"){
    queryResult = await ScoreCard.find({name:string});
  }
  if(type=="subject"){
    queryResult = await ScoreCard.find({subject:string});
  }
  console.log(queryResult)
  return queryResult;
  
}


router.post('/create-card', async function (req, res) {
  try {
    // TODO:
    // - Create card based on { name, subject, score } of req.xxx
    // - If {name, subject} exists,
    //     update score of that card in DB
    //     res.send({card, message}), where message is the text to print
    //   Else
    //     create a new card, save it to DB
    //     res.send({card, message}), where message is the text to print

    let [msg, card] = await saveCard(req.body.name, req.body.subject, req.body.score);
    res.send({message: msg, card: card});


  } catch (e) {
    res.json({ message: 'Something went wrong...' });
  }
});

// TODO: delete the collection of the DB
// router.delete(...)
router.delete("/clear", async (req, res)=>{
  try {
    await ScoreCard.deleteMany({});
    console.log("Database cleared");
    res.send({message: "Database cleared"});
} 
  catch (e) { throw new Error("Database cleared failed"); }
})

// TODO: implement the DB query
// route.xx(xxxx)
router.get("/query", async (req, res)=>{
  let queryResult = await findCard(req.query.queryType, req.query.queryString)
  if(queryResult.length!==0){
    let msg = "query found";
    console.log(msg)
    //console.log(queryResult)
    let msgs = [];
    for(let i=0; i<queryResult.length; i++){
      msgs.push(`query found(${queryResult[i].name}, ${queryResult[i].subject}, ${queryResult[i].score})`)
    }
    res.send({messages: msgs, message: msg});
  }
  else{
    let msg = `${req.query.queryType}(${req.query.queryString}) not found`;
    console.log(msg)
    res.send({message: msg});
  }
})

export default router;
