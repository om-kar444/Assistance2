import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.window}>
      {messages.map((msg, i) => (
        <MessageBubble key={i} type={msg.type} text={msg.text} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

const styles = {
  window: {
    height: 560,
    overflowY: "scroll",
    padding: 10,
    scrollBehavior: "smooth",
  },
};