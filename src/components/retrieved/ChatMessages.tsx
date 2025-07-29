import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatMessages = ({ messages }: { messages: any[] }) => {

    const userColors: { [key: string]: string } = {
        'Ryo': 'bg-blue-100 text-black',
        // Add more users and colors if needed
    };

    const getUserColorClass = (username: string) => {
        return userColors[username] || 'bg-gray-100 text-black';
    };


    return (
        <div className="flex-1 p-4 overflow-y-auto">
            <AnimatePresence initial={false}>
                {messages.map((message: any) => (
                    <motion.div
                        key={message.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -50 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                        }}
                        className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`
                            py-2 px-4 rounded-2xl max-w-sm
                            ${message.sender === 'user' ? 'bg-yellow-100 text-black rounded-br-none' : 'rounded-bl-none'}
                            ${message.sender === 'human' ? getUserColorClass(message.username) : ''}
                        `}>
                            {message.sender === 'human' && (
                                <p className="text-xs text-gray-600 font-bold mb-1">{message.username}</p>
                            )}
                            <p className="text-sm">{message.text}</p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ChatMessages;