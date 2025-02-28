import React, { useState } from "react";
import { FaPaperPlane, FaRobot, FaUser } from "react-icons/fa";

export default function ChatBot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newChat = [...chat, { role: "user", content: message }];
    setChat(newChat);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setChat([...newChat, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-900 text-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        🤖 AI Asistente Financiero
      </h2>
      <div className="h-64 overflow-y-auto bg-gray-800 p-4 rounded-lg space-y-3">
        {chat.length === 0 && <p className="text-gray-400">Inicia una conversación...</p>}
        {chat.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`p-3 rounded-lg ${msg.role === "user" ? "bg-blue-600" : "bg-gray-700"}`}>
              {msg.role === "user" ? <FaUser className="inline mr-2" /> : <FaRobot className="inline mr-2" />}
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <p className="text-orange-400">Generando respuesta...</p>}
      </div>

      {/* Input de usuario */}
      <div className="mt-4 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 text-gray-900 rounded-l-lg"
          placeholder="Escribe tu pregunta..."
        />
        <button
          onClick={sendMessage}
          className="bg-orange-500 p-3 rounded-r-lg hover:bg-orange-600 transition"
          disabled={loading}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}