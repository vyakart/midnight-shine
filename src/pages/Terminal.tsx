import React from 'react';
import { ChatTerminal } from '../components/ChatTerminal';

export default function Terminal() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[600px]">
        <ChatTerminal />
      </div>
    </div>
  );
}