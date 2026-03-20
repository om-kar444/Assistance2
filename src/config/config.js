const config = {
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
  GEMINI_API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
};

export function getGeminiApiUrl() {
  return `${config.GEMINI_API_URL}?key=${config.GEMINI_API_KEY}`;
}

export default config;