// This file is for environment variable configuration.
// In a real deployment, these values would be set by the server or build environment.

window.process = window.process || {};
window.process.env = {
  ...window.process.env,

  // --- Google Gemini ---
  // Get your key from: https://aistudio.google.com/app/apikey
  API_KEY: 'AIzaSyDHP7oZKcq-pr3MMQwwAE8gvsPsJUro5n4',

  // --- OpenAI ---
  // Get your key from: https://platform.openai.com/api-keys
  OPENAI_API_KEY: 'YOUR_OPENAI_API_KEY_HERE',

  // --- Perplexity ---
  // Get your key from: https://www.perplexity.ai/settings/api
  PERPLEXITY_API_KEY: 'YOUR_PERPLEXITY_API_KEY_HERE',
  
};
