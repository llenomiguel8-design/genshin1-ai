import React from 'react';
import { motion } from 'framer-motion';

const AboutPage = ({ onBack }) => {
    return (
        <div className="relative w-full h-screen overflow-hidden bg-black font-sans text-white select-none">
            {/* Background Image (Dimmed) */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center filter blur-sm brightness-50"
                style={{
                    backgroundImage: `url('https://upload-os-bbs.hoyolab.com/upload/2025/04/26/17138284/a6a4ceb09852d0335f908aa586c0a6b6_7877288227717400460.jpeg?x-oss-process=image%2Fauto-orient%2C0%2Finterlace%2C1%2Fformat%2Cwebp%2Fquality%2Cq_70')`
                }}
            />

            {/* Content Box */}
            <div className="relative z-10 flex items-center justify-center h-full p-8 md:p-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-black/60 backdrop-blur-md border border-[#d3bc8e]/30 rounded-lg p-8 md:p-12 max-w-4xl w-full text-center relative shadow-2xl"
                >
                    {/* Decorative Header */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d3bc8e] to-transparent opacity-50"></div>

                    <h2 className="text-3xl md:text-4xl font-serif text-[#d3bc8e] mb-6 drop-shadow-md">About Genshin Impact</h2>

                    <div className="text-sm md:text-base leading-relaxed text-gray-200 font-serif italic text-justify space-y-4 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                        <p>
                            Genshin Impact takes place in the fantasy world of Teyvat, home to seven nations, each of which are tied to a different element
                            and ruled by a different god called an "Archon". The story follows the Traveler, an interstellar adventurer who, at the start of the game,
                            is separated from their twin sibling after the two land in Teyvat. Thereafter, the Traveler journeys across the nations of Teyvat in search
                            of the lost sibling, accompanied by their guide, Paimon. Along the way, the two befriend myriad individuals, become involved in the affairs
                            of its nations, and begin to unravel the mysteries of the land.
                        </p>
                        <p>
                            Development began in 2017 and takes inspiration from a variety of sources, including The Legend of Zelda: Breath of the Wild, anime,
                            Gnosticism, and an array of real-world cultures and world mythologies. Genshin Impact has received generally positive reviews,
                            with critics approving of its combat mechanics and its immersive open world. Conversely, some criticism has been directed at its simplistic
                            endgame and its gacha-based monetization model. The game has also been subjected to controversy over censorship of content related to
                            Chinese politics, and privacy and security concerns.
                        </p>
                    </div>

                    <button
                        onClick={onBack}
                        className="mt-8 px-8 py-2 border border-[#d3bc8e] text-[#d3bc8e] hover:bg-[#d3bc8e] hover:text-black transition-all duration-300 font-serif rounded-sm"
                    >
                        Back
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutPage;
