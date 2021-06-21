import "./App.css";
import SignIn from "./Containers/SignIn";
import ChatRoom from "./Containers/ChatRoom";
import { useState, useEffect } from "react";
import { message } from "antd";

const App = () => {
  const LOCALSTORAGE_KEY = "save-me";
  const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);
  const [signedIn, setSignedIn] = useState(false);
  const [me, setMe] = useState(savedMe || "");

  useEffect(() => {
    if (signedIn) {
      localStorage.setItem(LOCALSTORAGE_KEY, me);
    }
  }, [signedIn]);

  const displayStatus = (payload) => {
    if (payload.msg) {
      const { type, msg } = payload;
      const content = {
        content: msg,
        duration: 1,
      };
      switch (type) {
        case "success":
          message.success(content);
          break;
        case "error":
        default:
          message.error(content);
          break;
      }
    }
  };

  return (
    <div className="App">
      {signedIn ? (
        <ChatRoom me={me} displayStatus={displayStatus} />
      ) : (
        <SignIn
          me={me}
          setMe={setMe}
          setSignedIn={setSignedIn}
          displayStatus={displayStatus}
        />
      )}
    </div>
  );
};

export default App;
