import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Settings, Send, User,
  ChevronRight, Zap, Brain, Activity, Terminal, HelpCircle
} from 'lucide-react';
import { startChat, sendMessage } from './services/gemini';
import personaRaw from './persona.txt?raw';

const THEMES = {
  Aether: {
    primary: '#ff6a00',
    accent: 'rgba(255, 106, 0, 0.2)',
    bgImage: 'https://ultimategacha.com/wp-content/uploads/2025/10/Honkai-Nexus-Anima-Artwork-Aether.png',
    particle: '#ff6a00',
    scanline: 'rgba(255, 106, 0, 0.4)',
    syncMsg: 'Hi I am Aether, your twin brother, and Im here to help you on your journey through Teyvat. What would you like to do today?'
  },
  Lumine: {
    primary: '#00e5ff',
    accent: 'rgba(0, 229, 255, 0.2)',
    bgImage: 'https://upload-os-bbs.hoyolab.com/upload/2022/02/16/130749360/a90c4d82abcd425e061277cd03ea9898_6828300138071160827.jpg?x-oss-process=image%2Fresize%2Cs_1000%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70',
    particle: '#00e5ff',
    scanline: 'rgba(0, 229, 255, 0.4)',
    syncMsg: 'Hi I am Lumine, your twin sister, and Im here to help you on your journey through Teyvat. What would you like to do today?'
  }
};

const GenshinChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeComm, setActiveComm] = useState("Message");
  const [currentPersona, setCurrentPersona] = useState('Aether');
  const [personaInstructions, setPersonaInstructions] = useState({});
  const [isGlitching, setIsGlitching] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

  const sidebarWidth = 320;
  const activeTheme = THEMES[currentPersona];

  // --- GUIDELINES LOGIC ---
  const triggerGuide = () => {
    const guideText = `*** NEURAL SYSTEM GUIDE ***\n\n1. PERSONNEL SWAP: Use the sidebar to toggle between Aether (Stoic/Focused) and Lumine (Assertive/Strategic).\n\n2. SYSTEM COMMANDS:\n- /archives : Access lore fragments.\n- /clear : Wipe current terminal buffer.\n- /system : Check core logic status.\n\n3. COMMUNICATION MODES:\n- Message: Standard interaction.\n- Creative: Unfiltered imaginative output.\n- Program: Focused on logical/coding tasks.\n\n*Swipe from the left edge to open the menu at any time.*`;
    setMessages(prev => [...prev, { role: 'ai', text: guideText }]);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const switchPersona = (p) => {
    if (p === currentPersona) return;
    setIsGlitching(true);
    setCurrentPersona(p);
    setTimeout(() => setIsGlitching(false), 500);
  };

  useEffect(() => {
    const parsePersonas = (text) => {
      const personas = {};
      const sections = text.split('---');
      let currentKey = null;
      sections.forEach(section => {
        const trimmed = section.trim();
        if (!trimmed) return;
        if (trimmed === 'Aether' || trimmed === 'Lumine') currentKey = trimmed;
        else if (currentKey) { personas[currentKey] = trimmed; currentKey = null; }
      });
      return personas;
    };
    setPersonaInstructions(parsePersonas(personaRaw));
  }, []);

  useEffect(() => {
    const initChat = async () => {
      if (personaInstructions[currentPersona]) {
        setMessages([]);
        await startChat(personaInstructions[currentPersona]);
        setMessages([{ role: 'ai', text: `*${currentPersona} online.* ${activeTheme.syncMsg}` }]);
      }
    };
    initChat();
  }, [currentPersona, personaInstructions]);

  const handleCommand = (cmd) => {
    const cleanCmd = cmd.toLowerCase().trim();
    if (cleanCmd === '/archives') return "ACCESSING ARCHIVES...\n- Fragment 001: The Fall of Khaenri'ah\n- Fragment 002: Skyward Sword records\n- Fragment 003: Vision Hunt Decree details.";
    if (cleanCmd === '/clear') { setMessages([]); return "Buffer cleared."; }
    if (cleanCmd === '/system') return `NODE: Gemini Pro\nPERSONNEL: ${currentPersona}\nSYNC: 98.4%`;
    return "Unknown Command. Try /archives or /system.";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");

    if (currentInput.startsWith('/')) {
      const systemResponse = handleCommand(currentInput);
      setTimeout(() => setMessages(prev => [...prev, { role: 'ai', text: systemResponse }]), 500);
      return;
    }

    setIsTyping(true);
    try {
      const responseText = await sendMessage(currentInput);
      setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: "Error syncing with Celestia." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-black font-sans text-white select-none relative italic-font">

      {/* --- SIDEBAR SWIPE HANDLE (Mobile Only) --- */}
      {!isSidebarOpen && (
        <motion.div
          onPanEnd={(e, info) => { if (info.offset.x > 50) setIsSidebarOpen(true); }}
          className="fixed left-0 top-0 bottom-0 w-12 z-[60] cursor-e-resize lg:hidden"
        />
      )}

      {/* --- GLITCH OVERLAY --- */}
      <AnimatePresence>
        {isGlitching && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] bg-white/5 backdrop-invert pointer-events-none mix-blend-difference" />
        )}
      </AnimatePresence>

      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div key={currentPersona}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: 0.9,
            scale: [1, 1.05, 1],
            y: [0, -30, 0]
          }}
          transition={{
            opacity: { duration: 1.5 },
            scale: { duration: 20, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute inset-0 md:inset-2 bg-contain md:bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${activeTheme.bgImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      </div>

      {/* --- SIDEBAR --- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" />

            <motion.aside
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => { if (info.offset.x < -80) setIsSidebarOpen(false); }}
              initial={{ x: -sidebarWidth }} animate={{ x: 0 }} exit={{ x: -sidebarWidth }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[320px] border-r p-8 flex flex-col shadow-2xl touch-none"
              style={{ borderColor: `${activeTheme.primary}33`, backgroundImage: `repeating-linear-gradient(45deg, #151311, #151311 2px, #1a1715 2px, #1a1715 10px)` }}
            >
              <div className="mb-10 flex justify-between items-center">
                <div>
                  <div className="italic font-black text-[10px] tracking-widest mb-1" style={{ color: activeTheme.primary }}>GENSHIN IMPACT</div>
                  <div className="text-xl italic font-black flex items-center gap-2 uppercase">
                    <User style={{ color: activeTheme.primary }} size={20} /> AI-SYSTEM
                  </div>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500">✕</button>
              </div>

              <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar">
                <SidebarSection label="Active Personnel">
                  <div className="flex gap-1 bg-black/40 rounded-full p-1 border border-white/5">
                    {['Aether', 'Lumine'].map((p) => (
                      <button key={p} onClick={() => switchPersona(p)}
                        className={`flex-1 py-2 text-[11px] font-bold italic rounded-full transition-all ${currentPersona === p ? 'text-black' : 'text-gray-500'}`}
                        style={{ backgroundColor: currentPersona === p ? activeTheme.primary : 'transparent', boxShadow: currentPersona === p ? `0 0 10px ${activeTheme.primary}66` : 'none' }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </SidebarSection>

                <SidebarSection label="Communication">
                  <div className="grid grid-cols-2 gap-2">
                    {['Message', 'Email', 'Program', 'Creative'].map((m) => (
                      <button key={m} onClick={() => setActiveComm(m)}
                        className={`py-2 px-3 rounded-lg text-[10px] font-bold italic border transition-all ${activeComm === m ? 'bg-white/10' : 'bg-transparent border-white/5 text-gray-500'}`}
                        style={{ borderColor: activeComm === m ? activeTheme.primary : 'rgba(255,255,255,0.05)' }}>
                        {m}
                      </button>
                    ))}
                  </div>
                </SidebarSection>

                <SidebarSection label="System Modules">
                  <div className="flex flex-col gap-2">
                    <button onClick={triggerGuide} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left">
                      <HelpCircle size={16} style={{ color: activeTheme.primary }} />
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider">Neural Guide</div>
                        <div className="text-[9px] text-gray-500 italic">User guidelines & Manual</div>
                      </div>
                    </button>
                    <button className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left">
                      <Terminal size={16} className="text-gray-500" />
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider">Terminal</div>
                        <div className="text-[9px] text-gray-500 italic">Advanced commands</div>
                      </div>
                    </button>
                  </div>
                </SidebarSection>
              </div>

              <div className="mt-auto pt-6 border-t border-white/5 text-[10px] font-mono text-gray-600">
                &gt; LOGIC: GEMINI_PRO_V1<br />&gt; SYNC_LVL: STABLE
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT --- */}
      <main className={`flex-1 relative flex flex-col transition-all duration-500 ${isSidebarOpen ? 'lg:ml-[320px]' : 'ml-0'}`}>
        {/* Toggle Button for Desktop */}
        {!isSidebarOpen && (
          <button onClick={() => setIsSidebarOpen(true)} className="absolute top-8 left-8 z-50 p-2 bg-black/40 border border-white/10 rounded-full hover:scale-110 transition-all">
            <ChevronRight size={20} style={{ color: activeTheme.primary }} />
          </button>
        )}

        <div className="relative z-40 flex-1 flex flex-col justify-end pb-8 px-6 lg:px-16 overflow-hidden">
          <div className="w-full max-w-3xl mx-auto mb-8 overflow-y-auto no-scrollbar max-h-[70vh] flex flex-col gap-6 pr-2">
            <AnimatePresence mode='popLayout'>
              {messages.map((m, i) => (
                <MessageBubble key={i} message={m} themeColor={activeTheme.primary} />
              ))}
            </AnimatePresence>
            {isTyping && <div className="text-[9px] font-bold tracking-[0.2em] animate-pulse uppercase ml-2" style={{ color: activeTheme.primary }}>Syncing Neural Paths...</div>}
          </div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-3xl mx-auto flex items-center gap-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
            <form onSubmit={handleSend} className="flex-1 flex items-center gap-4">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                placeholder={`Speak to ${currentPersona}...`}
                className="bg-transparent w-full outline-none italic text-sm text-white placeholder:text-gray-700" />
              <button type="submit" className="p-2" style={{ color: input ? activeTheme.primary : '#444' }}>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

const SidebarSection = ({ label, children }) => (
  <section>
    <label className="text-[10px] font-black text-gray-600 tracking-[0.2em] mb-3 block italic uppercase">{label}</label>
    {children}
  </section>
);

const MessageBubble = ({ message, themeColor }) => {
  const isAI = message.role === 'ai';
  return (
    <motion.div initial={{ opacity: 0, x: isAI ? -10 : 10 }} animate={{ opacity: 1, x: 0 }} className={`flex ${!isAI ? 'justify-end' : 'justify-start'}`}>
      <div className={`relative p-5 rounded-2xl text-[13px] italic leading-relaxed backdrop-blur-3xl border ${!isAI ? 'bg-white text-black font-bold border-none' : 'bg-black/80 text-white border-white/10'}`}>
        {isAI && <div className="absolute -top-1 -left-1 w-3 h-3 rotate-45" style={{ backgroundColor: themeColor, boxShadow: `0 0 10px ${themeColor}` }} />}
        <Typewriter text={message.text} />
      </div>
    </motion.div>
  );
};

const Typewriter = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let i = 0; setDisplayedText("");
    const timer = setInterval(() => {
      if (!text) return;
      setDisplayedText(text.substring(0, i + 1));
      i++; if (i >= text.length) clearInterval(timer);
    }, 8);
    return () => clearInterval(timer);
  }, [text]);
  return <span className="whitespace-pre-wrap">{displayedText}</span>;
};

export default GenshinChat;