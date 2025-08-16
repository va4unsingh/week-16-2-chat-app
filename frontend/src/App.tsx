import { useEffect, useRef, useState } from "react";

const App = () => {
  const [clientMessages, setClientMessages] = useState(["Client Side"]);
  const [serverMessages, setServerMessages] = useState(["Server Side"]);
  const wsRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
          },
        })
      );
    };

    ws.onmessage = (event) => {
      // push server message into serverMessages
      setServerMessages((prev) => [...prev, event.data]);
    };
    wsRef.current = ws;
  }, []);

  const sendMessage = () => {
    const message = inputRef.current?.value?.trim();
    if (!message) return;

    // show locally as client message
    setClientMessages((prev) => [...prev, message]);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: {
            message: message,
          },
        })
      );
    } else {
      console.warn("WebSocket is not open. Message not sent to server.");
    }

    // clear input
    inputRef.current.value = "";
  };

  return (
    <div className="h-screen bg-black flex flex-col text-white">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* client side  */}
        {clientMessages.map((clientMessage, i) => (
          <div
            className="bg-blue-600 max-w-xs px-4 py-2 rounded-xl ml-auto"
            key={i}
          >
            {clientMessage}
          </div>
        ))}

        {/* server side  */}
        {serverMessages.map((message, i) => (
          <div
            className="bg-gray-700 max-w-xs px-4 py-2 rounded-xl mr-auto"
            key={i}
          >
            {message}
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="flex p-4 bg-gray-900">
        <input
          ref={inputRef}
          className="bg-slate-700 flex-1 p-3 rounded-l-lg outline-none text-white"
          type="text"
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 px-5 rounded-r-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
