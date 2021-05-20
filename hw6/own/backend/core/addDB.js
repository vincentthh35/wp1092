import Record from '../models/record.js'

const addDB = async (name, subject, score) => {
    const existing = await Record.findOne({ name, subject });
    try {
        if (!existing) {
            // create new record
            const newRecord = new Record({ name, subject, score });
            await newRecord.save();
            return `Adding (${name}, ${subject}, ${score})`;
        } else {
            // replace old record
            await Record.replaceOne({ name, subject }, { name, subject, score });
            return `Updating (${name}, ${subject}, ${score})`;
        }
    } catch (e) { throw new Error(`record error: ${name}, ${subject}, ${score}`) }
}

export default addDB;
