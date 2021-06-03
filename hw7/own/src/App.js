import './App.css'
import { Button, Input } from 'antd'

function App() {
  return (
    <div className="App">
      <div className="App-title">
        <h1>Simple Chat</h1>
        <Button type="primary" danger >
          Clear
        </Button>
      </div>
      <div className="App-messages">
        <p style={{ color: '#ccc' }}>
          No messages...
        </p>
      </div>
      <Input
        placeholder="Username"
        style={{ marginBottom: 10 }}
      ></Input>
      <Input.Search
        enterButton="Send"
        placeholder="Type a message here..."
      ></Input.Search>
    </div>
  )
}

export default App
