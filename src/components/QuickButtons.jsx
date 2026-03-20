const questions = [
  { label: "🎓 Training",  question: "Tell me about your training programs" },
  { label: "📚 Courses",   question: "What courses do you offer?" },
  { label: "📍 Location",  question: "Where is EchoBrains located?" },
  { label: "📞 Contact",   question: "How can I contact EchoBrains?" },
  { label: "👤 Founders",  question: "Who are the founders of EchoBrains?" },
];

export default function QuickButtons({ onAsk, disabled }) {
  return (
    <div style={styles.bar}>
      <span style={styles.label}>Quick:</span>
      {questions.map((q) => (
        <button
          key={q.label}
          style={styles.btn}
          disabled={disabled}
          onClick={() => onAsk(q.question)}
        >
          {q.label}
        </button>
      ))}
    </div>
  );
}

const styles = {
  bar: {
    display: "flex",
    flexWrap: "nowrap",
    gap: 6,
    padding: "7px 8px",
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    overflowX: "auto",
  },
  label: { fontSize: 11, color: "#aaa", whiteSpace: "nowrap" },
  btn: {
    padding: "4px 11px",
    fontSize: 11,
    border: "1px solid #ddd",
    borderRadius: 12,
    cursor: "pointer",
    backgroundColor: "#f0f0f0",
    color: "#555",
    whiteSpace: "nowrap",
  },
};