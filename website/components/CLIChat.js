import { useEffect, useState } from 'react';

// ASCII art for a simple universe scene
const ART_LINES = [
  '                                 .           *       .               .',
  '                    .                     .             .          .',
  '        .                .       .              *             .        ',
  '              .       *       .       .                 .         *   ',
  '    .       .       .            .            .       .    .         ',
  '             .         .   .  *      .   .             *      .       ',
  '        *      .     .    .       .     .    .      .     .         ',
  '   .             .        .    .        *       .         .         ',
  '          .    .      .        .       .      .      .      .        ',
  '             .         .    *      .        .   .        .           ',
  '                 .       .        .   .      .        .       *      ',
  '       .    .        .        .       .         .     .      .       ',
];

// Translations for Vyakart/creator
const TRANSLATIONS = [
  { lang: 'English', word: 'Vyakart' },
  { lang: 'Kannada', word: 'ಸೃಷ್ಟಿಕರ್ತ' },
  { lang: 'Chakma', word: 'সৃষ্টিকর্তা' },
  { lang: 'Japanese', word: 'クリエイター' },
  { lang: 'Sanskrit', word: 'व्याकर्तृ' },
  { lang: 'Arabic', word: 'المنشئ' },
  { lang: 'Russian', word: 'создатель' },
  { lang: 'Chinese', word: '创造者' },
  { lang: 'Portuguese', word: 'O Criador' },
  { lang: 'Yoruba', word: 'Eleda' },
];

export default function CLIChat() {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [phase, setPhase] = useState('loading'); // 'loading' | 'translations' | 'chat'
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');

  // Simulate the universe loading effect
  useEffect(() => {
    if (phase === 'loading') {
      ART_LINES.forEach((line, idx) => {
        setTimeout(() => {
          setDisplayedLines((prev) => [...prev, line]);
          if (idx === ART_LINES.length - 1) {
            setTimeout(() => setPhase('translations'), 300);
          }
        }, idx * 60);
      });
    }
  }, [phase]);

  // Scroll to bottom of chat area when new messages appear
  const chatEndRef = (el) => {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle sending user input
  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    // Append user message
    setChatHistory((prev) => [...prev, { sender: 'user', text: input.trim() }]);
    // Reset input
    setInput('');
    // Mock response after a short delay
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        { sender: 'bot', text: 'Thanks for your message! In the full implementation I will be connected to an AI backend.' },
      ]);
    }, 700);
  };

  return (
    <div className="bg-surface border border-primary rounded-lg p-4 max-w-xl mx-auto text-sm font-mono text-primary whitespace-pre overflow-hidden">
      {/* Loading phase: show ASCII art */}
      {phase === 'loading' && (
        <pre>
          {displayedLines.join('\n')}
        </pre>
      )}
      {/* Translations phase */}
      {phase === 'translations' && (
        <div className="space-y-1">
          <div className="mb-2 font-heading text-secondary">=== VYAKART ===</div>
          {TRANSLATIONS.map(({ lang, word }) => (
            <div key={lang} className="flex justify-between">
              <span className="text-textMuted">{lang}</span>
              <span className="text-primary">{word}</span>
            </div>
          ))}
          <button
            onClick={() => setPhase('chat')}
            className="mt-4 px-3 py-1 bg-primary text-background rounded hover:bg-secondary transition-colors"
          >
            Start Chat
          </button>
        </div>
      )}
      {/* Chat phase */}
      {phase === 'chat' && (
        <div className="flex flex-col h-80">
          <div className="flex-1 overflow-y-auto space-y-2 mb-2">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <span className={`px-2 py-1 rounded ${msg.sender === 'user' ? 'bg-secondary text-background' : 'bg-primary text-background'}`}>{msg.text}</span>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>
          <form onSubmit={sendMessage} className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-background border border-primary rounded-l px-2 py-1 text-textLight focus:outline-none"
            />
            <button type="submit" className="bg-primary text-background px-4 py-1 rounded-r hover:bg-secondary transition-colors">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}