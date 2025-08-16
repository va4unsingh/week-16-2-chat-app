import { useEffect, useRef, useState } from "react";

const App = () => {
  const [messages, setMessages] = useState(["Hello how are you"]);
  const wsRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };
    wsRef.current = ws;

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
  }, []);

  return (
    <div className="h-screen bg-black flex flex-col text-white">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, i) => (
          <div
            className="bg-blue-600 max-w-xs px-4 py-2 rounded-xl ml-auto"
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
        />

        <button
          onClick={() => {
            const message = inputRef?.value;
            wsRef.current.send(
              JSON.stringify({
                type: "chat",
                payload: {
                  message: message,
                },
              })
            );
          }}
          className="bg-blue-600 px-5 rounded-r-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
