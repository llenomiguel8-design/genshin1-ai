import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAtOp0nTfS7lGrD9DX8NuU-oORfUa339JY";

let genAI = null;
let model = null;
let chatSession = null;

export const initGemini = () => {
    if (!API_KEY) {
        console.error("Gemini API Key is missing! Check your .env file.");
        return;
    }
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

export const startChat = async (personaInstruction) => {
    if (!model) initGemini();

    chatSession = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: `System Instruction: ${personaInstruction}` }],
            },
            {
                role: "model",
                parts: [{ text: "Understood. I will act according to this persona." }],
            },
        ],
    });
    return chatSession;
};

export const sendMessage = async (message) => {
    if (!chatSession) {
        throw new Error("Chat session not initialized.");
    }

    try {
        const result = await chatSession.sendMessage(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        return "Error: Could not connect to the neural network.";
    }
};
