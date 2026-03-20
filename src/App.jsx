import { useState, useEffect, useRef } from "react";
import ChatWindow from "./components/ChatWindow";
import QuickButtons from "./components/QuickButtons";
import { getGeminiApiUrl } from "./config/config";
import { generateApiPrompt } from "./utils/apiInstructions";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [trainingData, setTrainingData] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    addMessage("system", "⏳ Loading knowledge base from ECHOBRAINS.docx...");
    fetch("/api/training-data")
      .then((res) => {
        if (!res.ok) return res.json().then((e) => { throw new Error(e.error || "Server error"); });
        return res.json();
      })
      .then((data) => {
        setTrainingData(data.trainingData || "");
        setIsReady(true);
        setMessages([
          {
            type: "system",
            text: "EchoBrains AI Assistant ready! Ask me anything about our training programs, courses, placements, or contact information.",
          },
        ]);
      })
      .catch((err) => {
        addMessage("system", `⚠️ Could not load knowledge base: ${err.message}`);
      });
  }, []);

  function addMessage(type, text) {
    setMessages((prev) => [...prev, { type, text }]);
  }

  async function sendMessage(overrideText) {
    const message = (overrideText ?? input).trim();
    if (!message || !isReady || isSending) return;

    setInput("");
    addMessage("user", message);
    addMessage("system", "Bot is thinking...");
    setIsSending(true);

    let reply = "I don't have information about that.";
    try {
      const res = await fetch(getGeminiApiUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: generateApiPrompt(trainingData, message) }] }],
        }),
      });
      const data = await res.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        reply = data.candidates[0].content.parts[0].text;
      } else if (data.error) {
        reply = "Sorry, I'm having trouble right now. Please try again.";
      }
    } catch {
      reply = "Sorry, connection issue. Please check your internet.";
    }

    // Remove "thinking" message, add bot reply
    setMessages((prev) => {
      const filtered = [...prev];
      for (let i = filtered.length - 1; i >= 0; i--) {
        if (filtered[i].text === "Bot is thinking...") {
          filtered.splice(i, 1);
          break;
        }
      }
      return [...filtered, { type: "bot", text: reply }];
    });

    setIsSending(false);
    inputRef.current?.focus();
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>
        <span style={{ color: "orange" }}>Echo</span>
        <span style={{ color: "blue" }}>Brains</span>
        <span style={{ color: "#4CAF50" }}> Assistance</span>
      </h1>

      <div style={styles.tableWrapper}>
        <table border="1" width="500" style={styles.table}>
          <tbody>
            {/* Quick Buttons */}
            <tr>
              <td style={{ padding: 0 }}>
                <QuickButtons onAsk={(q) => sendMessage(q)} disabled={!isReady || isSending} />
              </td>
            </tr>

            {/* Chat Window */}
            <tr>
              <td>
                <ChatWindow messages={messages} />
              </td>
            </tr>

            {/* Input Row */}
            <tr>
              <td>
                <div style={styles.inputRow}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    placeholder="Type your message here..."
                    style={styles.input}
                    disabled={!isReady || isSending}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <button
                    style={styles.sendBtn}
                    disabled={!isReady || isSending}
                    onClick={() => sendMessage()}
                  >
                    Send
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    margin: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 14,
  },
  title: { textAlign: "center", fontSize: 28, marginBottom: 10 },
  tableWrapper: { textAlign: "center" },
  table: {
    border: "2px solid",
    borderCollapse: "collapse",
  },
  inputRow: { display: "flex", gap: 10, alignItems: "center", width: "100%" },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    padding: 8,
    border: "2px solid #ddd",
    borderRadius: 5,
  },
  sendBtn: {
    height: 46,
    padding: "0 20px",
    background: "linear-gradient(45deg, orange, blue)",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontWeight: "bold",
  },
};