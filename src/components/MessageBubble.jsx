export default function MessageBubble({ type, text }) {
  const styleMap = {
    user:   { backgroundColor: "#e3f2fd", borderLeft: "4px solid #2196f3" },
    bot:    { backgroundColor: "#fff3e0", borderLeft: "4px solid #ff9800", fontWeight: 600 },
    system: { backgroundColor: "#f5f5f5", borderLeft: "4px solid #9e9e9e", fontStyle: "italic" },
  };

  const labelMap = {
    user: <><b>You:</b> {text}</>,
    bot:  <><b>Bot:</b> {text}</>,
    system: <i>{text}</i>,
  };

  return (
    <table border="1" width="100%" style={{ marginBottom: 8, borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td style={{ ...baseStyle, ...styleMap[type] }}>
            {labelMap[type]}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

const baseStyle = {
  padding: 8,
  fontSize: 13,
  borderColor: "transparent",
};