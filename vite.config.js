import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const userMsg = input;
setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
setInput("");
setIsTyping(true);

// Simulate "thinking" time
setTimeout(() => {
  const aiMsg = getLenResponse(userMsg);
  setMessages(prev => [...prev, { role: 'ai', text: aiMsg }]);
  setIsTyping(false);
}, 1200);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
],
})
