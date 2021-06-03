import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import SignIn from './Containers/SignIn';
import ChatRoom from './Containers/ChatRoom';
import { message as antdMessage } from 'antd';
const ME_KEY = 'save-me';

const App = () => {
    const savedMe = localStorage.getItem(ME_KEY);
    const [signedIn, setSignedIn] = useState(false);
    const [me, setMe] = useState(savedMe || '');
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (signedIn) {
            localStorage.setItem(ME_KEY, me);
        }
    }, [signedIn, me]);


    const displayStatus = (payload) => {
        if (payload.msg) {
            const { type, msg } = payload;
            const content = { content: msg, duration: 1.5 };
            switch (type) {
                case 'success':
                    antdMessage.success(content);
                    break;
                case 'error':
                default:
                    antdMessage.error(content);
                    break;
            }
        }
    };

    useEffect(() => {
        displayStatus(status)
    }, [status]);

    return (
        <div className="App">
            { signedIn ? <ChatRoom me={me} displayStatus={displayStatus} /> : <SignIn me={me} setMe={setMe} setSignedIn={setSignedIn} displayStatus={displayStatus} /> }
        </div>
    );
}

export default App;
