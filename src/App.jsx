import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Settings, Send, User,
  ChevronRight, Zap
} from 'lucide-react';
import { startChat, sendMessage } from './services/gemini';
import personaRaw from './persona.txt?raw';

const GenshinChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeComm, setActiveComm] = useState("Message");
  const [currentPersona, setCurrentPersona] = useState('Aether');
  const [personaInstructions, setPersonaInstructions] = useState({});

  const sidebarWidth = 320;
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

  // --- LOGIC PRESERVED ---
  useEffect(() => {
    const parsePersonas = (text) => {
      const personas = {};
      const sections = text.split('---');
      let currentKey = null;
      sections.forEach(section => {
        const trimmed = section.trim();
        if (!trimmed) return;
        if (trimmed === 'Aether' || trimmed === 'Lumine') {
          currentKey = trimmed;
        } else if (currentKey) {
          personas[currentKey] = trimmed;
          currentKey = null;
        }
      });
      return personas;
    };
    const parsed = parsePersonas(personaRaw);
    setPersonaInstructions(parsed);
  }, []);

  useEffect(() => {
    const initChat = async () => {
      if (personaInstructions[currentPersona]) {
        setMessages([]);
        await startChat(personaInstructions[currentPersona]);
        setMessages([{ role: 'ai', text: `*${currentPersona} online.* Syncing with Aether Core...` }]);
      }
    };
    initChat();
  }, [currentPersona, personaInstructions]);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 1024) setIsSidebarOpen(true); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    try {
      const responseText = await sendMessage(input);
      setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: "Error syncing with Celestia." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#0c0b0a] font-sans text-white select-none relative italic-font">

      {/* --- 1. BOUNCING FIRE BACKGROUND --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -30, 0], // The "Bounce"
            scale: [1, 1.08, 1],
            filter: [
              "brightness(1) saturate(1) contrast(1)",
              "brightness(1.2) saturate(1.4) contrast(1.1)",
              "brightness(1) saturate(1) contrast(1)"
            ] // The "Flicker"
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-2 bg-cover bg-center opacity-900"
          style={{ backgroundImage: `url(https://fastcdn.hoyoverse.com/content-v2/hk4e/158502/5f018fa19e3126856550af1c6a72bbde_6443717322543034887.jpg)` }}
        />

        {/* --- FIRE EMBER PARTICLES --- */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "110%", x: Math.random() * 100 + "%", opacity: 0 }}
            animate={{
              y: "-10%",
              opacity: [0, 0.8, 0],
              x: (Math.random() * 100 - 50) + "%"
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-[#ff6a00] rounded-full blur-[1px] shadow-[0_0_10px_#ff6a00]"
          />
        ))}

        {/* Diagonal Art Overlay */}
        <div className="absolute inset-0 bg-[#fffdfa] mix-blend-overlay opacity-15"
          style={{ clipPath: 'polygon(0 0, 48% 0, 28% 100%, 0% 100%)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
      </div>

      {/* --- 2. HOLOGRAPHIC SCANLINE --- */}
      <div className="absolute inset-0 pointer-events-none z-[100] opacity-[0.05] overflow-hidden">
        <motion.div
          animate={{ y: ["-100%", "100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-full h-40 bg-linear-to-b from-transparent via-[#ff6a00] to-transparent"
        />
      </div>

      {/* --- SIDEBAR SWIPE HANDLE (Open Trigger) --- */}
      {!isSidebarOpen && (
        <motion.div
          className="fixed left-0 top-0 bottom-0 w-16 z-50 cursor-grab active:cursor-grabbing lg:hidden flex items-center group touch-none"
          onPanEnd={(e, info) => {
            if (info.offset.x > 50 || info.velocity.x > 400) setIsSidebarOpen(true);
          }}
        >
          <div className="h-24 w-1 bg-[#ff6a00] rounded-full shadow-[0_0_15px_#ff6a00] ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      )}

      {/* --- SIDEBAR --- */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
          />
        )}

        <motion.aside
          drag="x"
          dragConstraints={{ left: -sidebarWidth, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, info) => {
            if (info.offset.x < -40 || info.velocity.x < -300) setIsSidebarOpen(false);
          }}
          animate={{ x: isSidebarOpen ? 0 : -sidebarWidth }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed left-0 top-0 bottom-0 z-50 w-[320px] border-r border-[#ff6a00]/20 p-8 flex flex-col shadow-[10px_0_40px_rgba(0,0,0,0.7)] cursor-grab active:cursor-grabbing"
          style={{ backgroundImage: `repeating-linear-gradient(45deg, #151311, #151311 2px, #1a1715 2px, #1a1715 10px)` }}
        >
          <div className="mb-10 pointer-events-none">
            <div className="text-[#ff6a00] italic font-black text-xs tracking-widest mb-1 flex items-center gap-2 drop-shadow-[0_0_8px_#ff6a00]">
              GENSHIN IMPACT
            </div>
            <div className="text-2xl italic font-black flex items-center gap-2 tracking-tighter uppercase text-white/90">
              <User className="text-[#ff6a00]" size={24} /> AI-SYSTEM
            </div>
          </div>

          <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar pr-2">
            <SidebarSection label="Active Personnel">
              <div className="flex gap-2 bg-[#2a241f] rounded-full p-1 border border-white/5">
                {['Aether', 'Lumine'].map((persona) => (
                  <button
                    key={persona}
                    onClick={() => setCurrentPersona(persona)}
                    className={`flex-1 py-2 text-xs font-bold italic rounded-full transition-all ${currentPersona === persona
                      ? 'bg-[#ff6a00] text-black shadow-[0_0_15px_#ff6a00]'
                      : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    {persona}
                  </button>
                ))}
              </div>
            </SidebarSection>

            <SidebarSection label="Communication">
              <div className="grid grid-cols-2 gap-2">
                {['Email', 'Message', 'Program', 'Creative'].map((id) => (
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    key={id} onClick={() => setActiveComm(id)}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-full text-[11px] font-bold italic transition-all border ${activeComm === id ? 'bg-[#ff6a00] border-[#ff6a00] text-white' : 'bg-[#2a241f] border-white/5 text-gray-400'}`}
                  >
                    {id}
                  </motion.button>
                ))}
              </div>
            </SidebarSection>

            <div className="p-4 bg-black/40 border border-[#ff6a00]/10 rounded-2xl relative overflow-hidden group">
              <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] mb-2 block italic uppercase">Core Logic</label>
              <p className="text-[11px] text-gray-400 italic leading-relaxed relative z-10 font-mono text-xs">
                &gt; NODE: <span className="text-[#ff6a00]">Gemini Pro</span>
                <br />
                &gt; USER: <span className="text-white uppercase">{currentPersona}</span>
              </p>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* --- MAIN CONTENT --- */}
      <main className={`flex-1 relative flex flex-col transition-all duration-700 ease-in-out ${isSidebarOpen ? 'lg:ml-320px' : 'ml-0'}`}>
        <div className="relative z-40 flex-1 flex flex-col justify-end pb-8 lg:pb-12 px-6 lg:px-16">
          <div className="w-full max-w-3xl mx-auto mb-12 overflow-y-auto no-scrollbar max-h-[60vh] flex flex-col gap-6">
            <AnimatePresence mode='popLayout'>
              {messages.map((m, i) => (
                <MessageBubble key={i} message={m} />
              ))}
            </AnimatePresence>
            {isTyping && <div className="text-[#ff6a00] text-[10px] font-bold tracking-widest animate-pulse uppercase">Syncing Neural Paths...</div>}
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-4xl mx-auto flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-white/5 rounded-2xl p-4 px-8 shadow-2xl focus-within:border-[#ff6a00]/40 transition-all"
          >
            <Plus className="hidden sm:block text-gray-500 cursor-pointer" size={20} />
            <form onSubmit={handleSend} className="flex-1 flex items-center gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Speak to ${currentPersona}...`}
                className="bg-transparent w-full outline-none italic text-sm text-white placeholder:text-gray-700"
              />
              <button type="submit" className={`p-2 transition-all ${input ? 'text-[#ff6a00]' : 'text-gray-800'}`}>
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.5em] text-white/30 font-black italic">
          GENSHIN // AI-CORE // UNIT_02
        </div>
      </main>
    </div>
  );
};

const SidebarSection = ({ label, children }) => (
  <section className="group">
    <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] mb-3 block italic uppercase group-hover:text-[#ff6a00] transition-colors">{label}</label>
    {children}
  </section>
);

const MessageBubble = ({ message }) => {
  const isAI = message.role === 'ai' || message.role === 'model';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex ${!isAI ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`relative p-6 rounded-2xl text-[13px] italic leading-relaxed backdrop-blur-3xl border ${!isAI ? 'bg-[#d1c2b0] text-black font-bold border-none' : 'bg-black/90 text-white border-white/5'}`}>
        {isAI && <div className="absolute -top-1 -left-1 w-4 h-4 bg-[#ff6a00] rotate-45 shadow-[0_0_10px_#ff6a00]" />}
        <Typewriter text={message.text} />
      </div>
    </motion.div>
  );
};

const Typewriter = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    const timer = setInterval(() => {
      if (!text) return;
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, 12);
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayedText}</span>;
};

export default GenshinChat;