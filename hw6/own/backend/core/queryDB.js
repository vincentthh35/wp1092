import Record from '../models/record.js';

const parseQueryMessage = (object_list) => {
    let message = '';
    for (let i = 0; i < object_list.length; i++) {
        message += `name: ${object_list[i].name}, subject: ${object_list[i].subject}, score: ${object_list[i].score}\n`;
    }
    return message;
}

const queryDB = async (query, queryMode) => {
    try {
        if (queryMode === 'name') {
            const ret = await Record.find({ name: query });
            const message = parseQueryMessage(ret);
            if (message === '') {
                return Promise.reject(`Name (${query}) not found!`);
            } else {
                return message;
            }
        } else if (queryMode === 'subject') {
            const ret = await Record.find({ subject: query });
            const message = parseQueryMessage(ret);
            if (message === '') {
                return Promise.reject(`Subject (${query}) not found!`);
                // throw new Error(`Subject (${query}) not found!`);
            } else {
                return message;
            }
        } else {
            // should not happen
            return 'Incorrect query mode';
        }
    } catch (e) { return Promise.reject(`query error: ${query}, ${queryMode}`); }
}

export default queryDB;
