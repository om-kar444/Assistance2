// Configuration for EchoBrains AI Assistant
const config = {
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY, // API key from environment variables
  GEMINI_API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", // Gemini API endpoint
  ENABLE_EMOJIS: true, // Enable emoji responses
  SHOW_TYPING_INDICATOR: true // Show "Bot is thinking..." message
};

// Generate complete API URL with authentication key
export function getGeminiApiUrl() {
  console.log("🔑 API Key from env:", config.GEMINI_API_KEY); // Debug: check if key loads
  return `${config.GEMINI_API_URL}?key=${config.GEMINI_API_KEY}`; // Combine URL + key
}

export default config;