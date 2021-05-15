import mongoose from "mongoose";


const Schema = mongoose.Schema;
const RecordSchema = new Schema({
    name: String,
    subject: String,
    score: Number,
});

const Record = mongoose.model('Record', RecordSchema);

export default Record;
