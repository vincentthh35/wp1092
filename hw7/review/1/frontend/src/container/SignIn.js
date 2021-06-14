import { useState } from "react";
import "../App.css";
import { Input } from "antd";
import { UserOutlined } from "@ant-design/icons";

const SignIn = ({ me, setMe, setSignedIn }) => {
  const [message, setMessage] = useState("");
  return (
    <>
      <div className="App-title">
        <h1>My Chat Room</h1>
      </div>
      <Input.Search
        prefix={<UserOutlined />}
        value={me}
        enterButton="Sign In"
        onChange={(e) => setMe(e.target.value)}
        placeholder="Enter your name"
        size="large"
        style={{ width: 300, margin: 50 }}
        onSearch={() => {
          if (me.trim().length > 0) setSignedIn(true);
          else setMessage("Name can not be empty.");
        }}
      ></Input.Search>
      <h4 style={{ color: "red" }}>{message}</h4>
    </>
  );
};

export default SignIn;
