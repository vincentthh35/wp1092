import axios from 'axios'

const instance = axios.create({ baseURL: 'http://localhost:4000/api/guess' })

const startGame = async () => {
    let msg;
    try {
        const response = await instance.post('/start');
        msg = response.data.msg;
    } catch (error) {
        if (error.message === "Network Error") {
            msg = "Error: Server is currently down. Please start the server."
        } else {
            console.error(error);
            msg = "Unknown error...";
        }
    }
    return msg;
}

const guess = async (number) => {
    let msg;

    try {
        const response = await instance.get('/guess', { params: { number } })
        msg = response.data.msg;
    } catch (error) {
        // catch "no server error"
        if (error.message === "Network Error") {
            msg = `Error: Server is currently down. Please start the server.`;
        } else if (error.response !== undefined && error.response.status === 400) {
            msg = `Error: ${number} is not a valid number (1-100)`;
        } else {
            console.error(error);
            msg = 'Unknown error...';
        }
    }
    return msg;
}

const restart = async () => {
    let msg;
    try {
        const response = await instance.post('/restart');
        msg = response.data.msg;
    } catch (error) {
        if (error.message === "Network Error") {
            msg = "Error: Server is currently down. Please start the server."
        } else {
            console.error(error);
            msg = "Unknown error...";
        }
    }

    return msg;
}

export { startGame, guess, restart }
