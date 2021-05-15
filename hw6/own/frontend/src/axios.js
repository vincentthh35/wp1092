import axios from "axios";

const instance = axios.create({ baseURL: "http://localhost:4000/api/" })

const clearDB = async () => {
    let msg;

    try {
        const res = await instance.delete('/clearDB');
        msg = res.data.msg;
    } catch (error) {
        msg = error.message;
    }

    return msg;
}

const addDB = async (name, subject, score) => {
    let msg;

    try {
        const res = await instance.post('/addDB', { params: { name, subject, score } });
        msg = res.data.msg;
    } catch (error) {
        msg = error.message;
        return Promise.reject(error.response.data.msg);
    }

    return msg;
}

const queryDB = async (query, queryMode) => {
    let msg;

    try {
        const res = await instance.get('/queryDB', { params: { query, queryMode } });
        msg = res.data.msg;
    } catch (error) {
        msg = error.message;
        return Promise.reject(error.response.data.msg);
    }

    return msg
}

export { clearDB, addDB, queryDB };
