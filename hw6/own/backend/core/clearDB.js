import Record from '../models/record.js';

const clearDB = async () => {
    const ret = await Record.deleteMany({});
    if (ret.ok !== 1) {
        return "Something went wrong when clearing database."
    }
    return "Database cleared.";
}

export default clearDB;
