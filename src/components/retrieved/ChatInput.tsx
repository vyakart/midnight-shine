import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Mic, Hand } from 'lucide-react';

interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
    handleSendMessage: (e: React.FormEvent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, handleSendMessage }) => {
    return (
        <form onSubmit={handleSendMessage} className="p-2 border-t border-gray-400 bg-gray-200">
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full h-9 pl-3 pr-24 rounded-full border border-gray-800 text-sm bg-white/90 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                    <button type="button" className="p-2 text-gray-500 hover:text-gray-800">
                        <Hand className="h-4 w-4" />
                    </button>
                    <button type="button" className="p-2 text-gray-500 hover:text-gray-800">
                        <Mic className="h-4 w-4" />
                    </button>
                    <motion.button
                        type="submit"
                        whileTap={{ scale: 0.95 }}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white shadow-md ml-2"
                    >
                        <ArrowUp className="h-5 w-5" />
                    </motion.button>
                </div>
            </div>
        </form>
    );
};

export default ChatInput;