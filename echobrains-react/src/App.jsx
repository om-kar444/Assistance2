import { useState, useEffect, useRef } from "react";
import ChatWindow from "./components/ChatWindow";
import QuickButtons from "./components/QuickButtons";
import { getGeminiApiUrl } from "./config/config";
import { generateApiPrompt } from "./utils/apiInstructions";

export default function App() {
  // State management for chat functionality
  const [messages, setMessages] = useState([]); // Store all chat messages
  const [input, setInput] = useState(""); // Current user input text
  const [trainingData, setTrainingData] = useState(""); // EchoBrains knowledge base
  const [isReady, setIsReady] = useState(false); // Whether app is ready to chat
  const [isSending, setIsSending] = useState(false); // Whether currently sending message
  const inputRef = useRef(null); // Reference to input field for focus

  // Load training data when app starts
  useEffect(() => {
    addMessage("system", "⏳ Loading knowledge base from ECHOBRAINS.docx...");
    
    // Fetch training data from backend server
    fetch("/api/training-data")
      .then((res) => {
        if (!res.ok) return res.json().then((e) => { throw new Error(e.error || "Server error"); });
        return res.json();
      })
      .then((data) => {
        setTrainingData(data.trainingData || ""); // Store knowledge base
        setIsReady(true); // Enable chat functionality
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

  // Add new message to chat history
  function addMessage(type, text) {
    setMessages((prev) => [...prev, { type, text }]);
  }

  // Send message to Gemini API and get response
  async function sendMessage(overrideText) {
    const message = (overrideText ?? input).trim();
    if (!message || !isReady || isSending) return; // Prevent empty/duplicate sends

    console.log("🚀 Sending message:", message);
    setInput(""); // Clear input field
    addMessage("user", message); // Add user message to chat
    addMessage("system", "Bot is thinking..."); // Show thinking indicator
    setIsSending(true); // Disable send button

    let reply = "I don't have information about that."; // Default fallback response
    
    try {
      const apiUrl = getGeminiApiUrl(); // Get API URL with key
      const prompt = generateApiPrompt(trainingData, message); // Create AI prompt
      
      console.log("🔗 API URL:", apiUrl);
      console.log("📝 Generated prompt:", prompt);
      
      // Prepare request body for Gemini API
      const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
      };
      
      console.log("📤 Request body:", JSON.stringify(requestBody, null, 2));
      
      // Send request to Gemini API
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      
      console.log("📥 Response status:", res.status);
      console.log("📥 Response ok:", res.ok);
      
      const data = await res.json(); // Parse response
      console.log("📊 Response data:", data);
      
      // Extract AI response from API data
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        reply = data.candidates[0].content.parts[0].text;
        console.log("✅ Got reply:", reply);
      } else if (data.error) {
        console.log("❌ API Error:", data.error);
        reply = `API Error: ${data.error.message || JSON.stringify(data.error)}`;
      } else {
        console.log("❌ Unexpected response format:", data);
        reply = "Sorry, unexpected response format.";
      }
    } catch (error) {
      console.log("💥 Fetch error:", error);
      reply = `Connection error: ${error.message}`;
    }

    // Remove "thinking" message and add bot reply
    setMessages((prev) => {
      const filtered = [...prev];
      for (let i = filtered.length - 1; i >= 0; i--) {
        if (filtered[i].text === "Bot is thinking...") {
          filtered.splice(i, 1); // Remove thinking message
          break;
        }
      }
      return [...filtered, { type: "bot", text: reply }]; // Add bot response
    });

    setIsSending(false); // Re-enable send button
    inputRef.current?.focus(); // Focus back to input field
  }

  return (
    <div style={styles.page}>
      {/* App title with brand colors */}
      <h1 style={styles.title}>
        <span style={{ color: "orange" }}>Echo</span>
        <span style={{ color: "darkblue" }}>Brains</span>
        <span style={{ color: "orange" }}> Assistant</span>
      </h1>
      
      {/* Main chat container */}
      <div style={styles.container}>
        {/* Quick action buttons */}
        <QuickButtons onAsk={(q) => sendMessage(q)} disabled={!isReady || isSending} />
        
        {/* Chat message display area */}
        <ChatWindow messages={messages} />
        
        {/* User input area */}
        <div style={styles.inputRow}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            placeholder="Ask about courses, fees, placements..."
            style={styles.input}
            disabled={!isReady || isSending}
            onChange={(e) => setInput(e.target.value)} // Update input state
            onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Send on Enter key
          />
          <button
            style={styles.sendBtn}
            disabled={!isReady || isSending}
            onClick={() => sendMessage()} // Send on button click
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// Component styling
const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    maxWidth: 500,
    margin: "20px auto",
    padding: 20,
    backgroundColor: "white",
  },
  title: { 
    textAlign: "center", 
    color: "#333",
    marginBottom: 20 
  },
  container: {
    border: "3px solid orange", // Orange outer border
    outline: "2px solid darkblue", // Dark blue inner border
    outlineOffset: "-1px",
    borderRadius: 12,
    padding: 0,
    backgroundColor: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  inputRow: { 
    display: "flex", 
    gap: 10, 
    padding: 15,
    borderTop: "1px solid #e0e0e0",
    backgroundColor: "white",
    borderRadius: "0 0 12px 12px",
  },
  input: {
    flex: 1,
    padding: 12,
    border: "1px solid #ddd",
    borderRadius: 20,
    fontSize: 14,
    outline: "none",
  },
  sendBtn: {
    padding: "12px 24px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: 20,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: "500",
  },
};