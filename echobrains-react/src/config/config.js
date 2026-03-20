// Configuration for EchoBrains AI Assistant
const config = {
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyBdgu7BwUuctrgNZVGEqSddFxZkFQvsspU", // Fallback to hardcoded if env fails
  GEMINI_API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
  ENABLE_EMOJIS: true,
  SHOW_TYPING_INDICATOR: true
};

// Generate complete API URL with authentication key
export function getGeminiApiUrl() {
  console.log("🔑 API Key source:", import.meta.env.VITE_GEMINI_API_KEY ? "Environment" : "Hardcoded fallback");
  console.log("🔑 API Key value:", config.GEMINI_API_KEY);
  return `${config.GEMINI_API_URL}?key=${config.GEMINI_API_KEY}`;
}

export default config;