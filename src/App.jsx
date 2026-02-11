import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  Plus, Settings, Search, Send, User, 
  MessageSquare, Heart, Mail, Code, Palette, HelpCircle, ChevronRight, Menu, Zap
} from 'lucide-react';

const KagamineLenBot = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hey! Kagamine Len here. The Forge is operational! You can swipe this sidebar out or grab the edge. Ready to dive into Teyvat?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeComm, setActiveComm] = useState("Message");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  const sidebarWidth = 320;
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 1024) setIsSidebarOpen(true); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: "Systems calibrated! Let's get to work on that." }]);
      setIsTyping(false);
    }, 1200);
  };

  const onDragEnd = (event, info) => {
    if (info.offset.x > 50) setIsSidebarOpen(true);
    else if (info.offset.x < -50) setIsSidebarOpen(false);
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#0c0b0a] font-sans text-white select-none relative italic-font">
      
      {/* --- CREATIVE LAYER: HOLOGRAPHIC SCANLINES --- */}
      <div className="absolute inset-0 pointer-events-none z-100 opacity-[0.03] overflow-hidden">
        <motion.div 
          animate={{ y: ["-100%", "100%"] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-full h-20 bg-linear-to-b from-transparent via-white to-transparent"
        />
      </div>

      {/* --- CREATIVE LAYER: AETHER PARTICLES --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: Math.random() * 1000 }}
            animate={{ opacity: [0, 0.3, 0], y: -100, x: Math.random() * 100 }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, delay: i * 2 }}
            className="absolute w-1 h-1 bg-[#ff6a00] rounded-full blur-[1px]"
            style={{ left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      {/* --- 1. THE SWIPEABLE SIDEBAR --- */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
          />
        )}

        <motion.aside
          drag="x" dragConstraints={{ left: -sidebarWidth, right: 0 }} dragElastic={0.05} onDragEnd={onDragEnd}
          animate={{ x: isSidebarOpen ? 0 : -sidebarWidth }}
          transition={{ type: 'spring', damping: 22, stiffness: 150 }}
          className="fixed left-0 top-0 bottom-0 z-50 w-[320px] border-r border-[#ff6a00]/20 p-8 flex flex-col shadow-[10px_0_40px_rgba(0,0,0,0.7)] cursor-grab active:cursor-grabbing"
          style={{ backgroundImage: `repeating-linear-gradient(45deg, #151311, #151311 2px, #1a1715 2px, #1a1715 10px)` }}
        >
          {/* Aesthetic Sidebar Glow Handle */}
          <div className="absolute right-0 top-0 bottom-0 w-1px bg-linear-to-b from-transparent via-[#ff6a00] to-transparent opacity-30 shadow-[0_0_15px_#ff6a00]" />

          <div className="mb-10">
            <div className="text-[#ff6a00] italic font-black text-xs tracking-widest mb-1 flex items-center gap-2 drop-shadow-[0_0_8px_#ff6a00]">
               AETHER FORGE
            </div>
            <div className="text-2xl italic font-black flex items-center gap-2 tracking-tighter uppercase text-white/90">
               <User className="text-[#ff6a00]" size={24} /> AI-GENSHIN
            </div>
          </div>

          <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar pr-2">
            <SidebarSection label="Identify Name">
              <input type="text" defaultValue="Traveler" className="w-full bg-[#2a241f] border border-white/5 rounded-full px-5 py-2 text-sm italic outline-none focus:border-[#ff6a00] transition-all shadow-inner" />
            </SidebarSection>

            <SidebarSection label="Communication">
              <div className="grid grid-cols-2 gap-2">
                {['Email', 'Message', 'Program', 'Creative'].map((id) => (
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    key={id} onClick={() => setActiveComm(id)}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-full text-[11px] font-bold italic transition-all border ${
                      activeComm === id ? 'bg-[#ff6a00] border-[#ff6a00] text-white shadow-[0_0_20px_rgba(255,106,0,0.5)]' : 'bg-[#2a241f] border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {id}
                  </motion.button>
                ))}
              </div>
            </SidebarSection>

            <div className="p-4 bg-black/40 border border-[#ff6a00]/10 rounded-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-linear-to-tr from-[#ff6a00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] mb-2 block italic uppercase">Core Logic</label>
               <p className="text-[11px] text-gray-400 italic leading-relaxed relative z-10">
                 Neural pathing initialized. Current personality: <span className="text-[#ff6a00]">Len_V2.0</span>
               </p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 mt-auto">
            <button onClick={() => setIsHelpOpen(!isHelpOpen)} className="flex items-center gap-2 text-sm font-black italic hover:text-[#ff6a00] transition-colors uppercase group relative">
              <Settings size={18} className="group-hover:rotate-90 transition-transform duration-700" /> SYSTEM
              {isHelpOpen && <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#ff6a00] rounded-full animate-ping" />}
            </button>
            
            <AnimatePresence>
              {isHelpOpen && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute bottom-20 left-6 w-56 bg-[#ff6a00] p-5 rounded-2xl shadow-[0_10px_40px_rgba(255,106,0,0.4)] z-100 text-black">
                  <div className="font-black italic text-xs mb-3 flex items-center gap-2 border-b border-black/10 pb-2">
                    <Zap size={14} fill="black" /> PROTOCOL STATUS
                  </div>
                  <div className="text-[11px] font-bold space-y-3">
                    <button className="w-full text-left hover:translate-x-1 transition-transform">▸ Request Technical Support</button>
                    <button className="w-full text-left hover:translate-x-1 transition-transform">▸ View Command List</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* --- 2. EDGE SWIPE TRIGGER --- */}
      {!isSidebarOpen && (
        <motion.div 
          drag="x" dragConstraints={{ left: 0, right: 100 }} onDragEnd={(e, info) => info.offset.x > 50 && setIsSidebarOpen(true)}
          className="fixed left-0 top-0 bottom-0 w-8 z-50 cursor-e-resize flex items-center justify-center group"
        >
          <div className="h-24 w-1 bg-[#ff6a00]/30 rounded-full group-hover:bg-[#ff6a00] transition-all group-hover:h-32 group-hover:shadow-[0_0_15px_#ff6a00]" />
          <ChevronRight className="text-[#ff6a00] opacity-0 group-hover:opacity-100 -ml-1 transition-all" size={20} />
        </motion.div>
      )}

      {/* --- 3. MAIN CHAT AREA --- */}
      <main className={`flex-1 relative flex flex-col transition-all duration-700 ease-in-out ${isSidebarOpen ? 'lg:ml-320px' : 'ml-0'}`}>
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: `repeating-linear-gradient(-45deg, #333, #333 1px, transparent 1px, transparent 20px)` }} />
        
        {/* CHARACTER ANIMATION */}
        <motion.div animate={{ y: [0, -15, 0], opacity: [0.35, 0.45, 0.35] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 z-10 flex items-center justify-center">
          <img src="https://fastcdn.hoyoverse.com/content-v2/hk4e/158502/5f018fa19e3126856550af1c6a72bbde_6443717322543034887.jpg" alt="Len" className="h-[85%] object-contain contrast-[1.1] brightness-[0.8]" />
        </motion.div>

        {/* CHAT INTERFACE */}
        <div className="relative z-40 flex-1 flex flex-col justify-end pb-8 lg:pb-12 px-6 lg:px-16">
          
          <div className="w-full max-w-3xl mx-auto mb-12 overflow-y-auto no-scrollbar max-h-[50vh] flex flex-col gap-6">
            <AnimatePresence mode='popLayout'>
              {messages.map((m, i) => (
                <MessageBubble key={i} message={m} />
              ))}
            </AnimatePresence>
            {isTyping && <div className="text-[#ff6a00] text-[10px] font-bold tracking-widest animate-pulse uppercase">Syncing Neural Paths...</div>}
          </div>

          {/* INPUT BAR WITH GLOW */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-4xl mx-auto flex items-center gap-4 bg-[#111] border border-[#ff6a00]/10 rounded-2xl p-4 px-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] focus-within:border-[#ff6a00]/40 transition-all group"
          >
            <Plus className="hidden sm:block text-gray-500 hover:text-white cursor-pointer transition-colors" size={20} />
            <form onSubmit={handleSend} className="flex-1 flex items-center gap-4">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Send a command to Len..." className="bg-transparent w-full outline-none italic text-sm text-white placeholder:text-gray-700" />
              <button type="submit" className={`p-2 rounded-lg transition-all ${input ? 'text-[#ff6a00] shadow-[0_0_15px_#ff6a0033]' : 'text-gray-800'}`}>
                 <Send size={20} />
              </button>
            </form>
          </motion.div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.5em] text-gray-700 font-black italic opacity-50">
           Genshin // Impact-A-01
        </div>
      </main>
    </div>
  );
};

// --- CREATIVE COMPONENTS ---

const SidebarSection = ({ label, children }) => (
  <section className="group">
    <label className="text-[10px] font-black text-gray-500 tracking-[0.2em] mb-3 block italic uppercase group-hover:text-[#ff6a00] transition-colors">{label}</label>
    {children}
  </section>
);

const MessageBubble = ({ message }) => {
  const isAI = message.role === 'ai';
  return (
    <motion.div 
      initial={{ opacity: 0, x: isAI ? -20 : 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      className={`flex ${!isAI ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`relative p-6 rounded-2xl text-[13px] italic leading-relaxed backdrop-blur-xl border ${!isAI ? 'bg-[#d1c2b0] text-black font-bold border-none shadow-lg' : 'bg-black/80 text-white border-[#ff6a00]/20 shadow-[0_10px_30px_rgba(0,0,0,0.4)]'}`}>
        {isAI && (
          <div className="absolute -top-1 -left-1 w-4 h-4 bg-[#ff6a00] rotate-45 shadow-[0_0_10px_#ff6a00]">
            <div className="w-full h-full flex items-center justify-center text-[8px] text-black font-black rotate--45deg">✦</div>
          </div>
        )}
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
      setDisplayedText((prev) => text.substring(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayedText}</span>;
};

export default KagamineLenBot;