import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Mic, Hand } from 'lucide-react';
import ChatMessages from './ChatMessages'; // This will be created next
import ChatInput from './ChatInput'; // This will be created next

const Dock = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hey checkout this new chat UI I am building!", sender: 'human', username: 'Ryo' },
        { id: 2, text: "It's inspired by a retro OS, pretty cool right?", sender: 'human', username: 'Ryo' },
        { id: 3, text: "Yeah, this is awesome, it has that classic vibe to it. Feels nostalgic!", sender: 'user' },
    ]);
    const [input, setInput] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const newMessage = {
            id: messages.length + 1,
            text: input,
            sender: 'user',
        };

        setMessages([...messages, newMessage]);
        setInput('');
    };

    return (
        <div className="w-full max-w-lg mx-auto h-[600px] flex flex-col font-sans border border-gray-600 rounded-lg shadow-2xl bg-[#EBEBEB] overflow-hidden">
            <header className="flex items-center justify-center p-2 border-b border-gray-400 bg-gray-200 relative">
                <div className="flex space-x-1.5 absolute left-3">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                </div>
                <h2 className="text-sm font-medium text-gray-800">ryo-chat</h2>
            </header>
            <ChatMessages messages={messages} />
            <ChatInput 
                input={input}
                setInput={setInput}
                handleSendMessage={handleSendMessage}
            />
        </div>
    );
}

export default Dock;