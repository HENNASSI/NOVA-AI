
import { useState } from "react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const backendUrl = "YOUR_DETA_SPACE_URL_HERE";

  const sendMessage = async (msg = input) => {
    if (!msg.trim()) return;
    const newMessages = [...messages, { sender: "You", text: msg }];
    setMessages(newMessages);

    const res = await fetch(`${backendUrl}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });
    const data = await res.json();
    const reply = data.reply;
    setMessages([...newMessages, { sender: "NOVA", text: reply }]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">🌟 NOVA AI</h1>
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-4 flex flex-col space-y-2">
        <div className="flex-1 overflow-y-auto h-80 border-b pb-2">
          {messages.map((m, i) => (
            <div key={i} className={m.sender === "You" ? "text-right" : "text-left"}>
              <p className="px-3 py-2 inline-block rounded-lg my-1 bg-gray-200 text-gray-900">
                <strong>{m.sender}:</strong> {m.text}
              </p>
            </div>
          ))}
        </div>
        <div className="flex mt-2">
          <input
            type="text"
            className="flex-1 border rounded-lg px-3 py-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
          />
          <button
            onClick={() => sendMessage()}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
