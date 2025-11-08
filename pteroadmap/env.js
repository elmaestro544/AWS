/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// IMPORTANT: This file is used to set the API key for the Gemini API.
// In a real-world production application, you should never hardcode API keys
// in your client-side code. This is a security risk.
//
// For this project, you can get a key from Google AI Studio:
// https://aistudio.google.com/app/apikey
//
// 1. Create a new API key.
// 2. Replace "YOUR_API_KEY_HERE" with your actual API key.

// This polyfills the 'process.env' object for the browser environment.
window.process = {
  env: {
    API_KEY: 'AIzaSyDHP7oZKcq-pr3MMQwwAE8gvsPsJUro5n4',
  },
};
