// Convert markdown-like formatting to HTML for rich text display
function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **bold** to <strong>
    .replace(/__(.*?)__/g, '<u>$1</u>') // Convert __underline__ to <u>
    .replace(/• /g, '<br>• ') // Put bullet points on new lines
    .replace(/\n/g, '<br>'); // Convert line breaks to <br>
}

export default function MessageBubble({ type, text }) {
  // Render message content with formatting for bot messages
  const renderContent = () => {
    if (type === 'bot') {
      return <span dangerouslySetInnerHTML={{ __html: formatText(text) }} />; // Apply formatting to bot messages
    } else {
      return text; // Plain text for user/system messages
    }
  };

  return (
    <div style={styles.container}>
      <div style={{...styles.bubble, ...styles[type]}}> {/* Apply message type styling */}
        {renderContent()}
      </div>
    </div>
  );
}

// Styling for different message types
const styles = {
  container: {
    marginBottom: 15, // Space between messages
    display: 'flex',
  },
  bubble: {
    padding: 12,
    borderRadius: 12, // Rounded corners
    maxWidth: '80%', // Limit message width
    wordWrap: 'break-word', // Handle long words
    fontSize: 14,
    lineHeight: 1.4,
  },
  user: { // User messages: blue, right-aligned
    backgroundColor: '#007bff',
    color: 'white',
    marginLeft: 'auto',
    borderBottomRightRadius: 4, // Pointed corner effect
  },
  bot: { // Bot messages: gray, left-aligned
    backgroundColor: '#f1f1f1',
    color: '#333',
    marginRight: 'auto',
    borderBottomLeftRadius: 4, // Pointed corner effect
  },
  system: { // System messages: yellow, centered
    backgroundColor: '#fff3cd',
    color: '#856404',
    margin: '0 auto',
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 12,
  },
};