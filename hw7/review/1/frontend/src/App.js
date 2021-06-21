import "./App.css";
import SignIn from "./Container/SignIn";
import ChatRoom from "./Container/ChatRoom";
import { useState, useEffect } from "react";
import {message} from "antd";
const LOCALSTORAGE_KEY = "save-me";
const App = () => {
  const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);
  const [signedIn, setSignedIn] = useState(false);
  const [me, setMe] = useState(savedMe || "");
  const displayStatus = (payload) => {
    if(payload.msg){
      const {type, msg} = payload
      const content = {
        content: msg, duration: 0.5}
      switch(type){
        case 'sucesss':
          message.success(content)
          break
        case 'error':
        default:
          message.error(content)
          break
      }
    }
  }
  useEffect(() => {
    if (signedIn) {
      localStorage.setItem(LOCALSTORAGE_KEY, me);
    }
  }, [signedIn]);
  /*
  useEffect(() => {
    displatStatus(status)
  }, [status])*/

  return (
    <div className="App">
      {signedIn? (<ChatRoom me={me} displayStatus={displayStatus}/>) : (<SignIn me={me} setSignedIn={setSignedIn} setMe={setMe} displayStatus={displayStatus}/>)}
</div> );
};
export default App;