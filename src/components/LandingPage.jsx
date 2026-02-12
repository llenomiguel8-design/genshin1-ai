import React from 'react';
import { motion } from 'framer-motion';

const LandingPage = ({ onPlay, onAbout }) => {
    return (
        <div className="relative w-full h-screen overflow-hidden bg-black font-sans text-white select-none">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url('https://w.wallhaven.cc/full/we/wallhaven-we725r.jpg')`
                }}
            >
                <div className="absolute inset-0 bg-black/20" /> {/* Slight overlay for readability */}
            </div>

            {/* Decorative Lines */}
            <div className="absolute top-0 left-0 w-full h-2 bg-[#364f6b] z-20"></div>
            <div className="absolute bottom-0 left-0 w-full h-2 bg-[#364f6b] z-20"></div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-8">

                {/* Logo */}
                <motion.img
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/5/5d/Genshin_Impact_logo.svg/2560px-Genshin_Impact_logo.svg.png"
                    alt="Genshin Impact Logo"
                    className="w-[400px] md:w-[600px] drop-shadow-2xl"
                />

                {/* Buttons */}
                <div className="flex flex-col items-center gap-4 mt-8">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onPlay}
                        className="px-12 py-3 bg-[#3e3b34] border-2 border-[#d3bc8e] text-[#d3bc8e] font-serif text-xl rounded-md shadow-[0_0_15px_rgba(211,188,142,0.5)] hover:bg-[#4a463e] hover:shadow-[0_0_25px_rgba(211,188,142,0.8)] transition-all duration-300"
                    >
                        Play
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onAbout}
                        className="text-[#d3bc8e] font-serif text-lg hover:text-white hover:underline transition-colors"
                    >
                        About
                    </motion.button>
                </div>
            </div>

            {/* Footer Copyright */}
            <div className="absolute bottom-4 left-4 text-xs text-white/50 z-20 font-sans">
                ©COGNOSPHERE
            </div>
        </div>
    );
};

export default LandingPage;
