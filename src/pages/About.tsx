import React, { useState } from 'react';
import { ChatTerminal } from '../components/ChatTerminal';

const About: React.FC = () => {
  const [showTerminal, setShowTerminal] = useState(false);
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">About Me</h1>
        
        <div className="space-y-8">
            {/* Profile Section */}
            <section>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">VY</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Vyakart</h2>
                  <p className="text-gray-600 dark:text-gray-400">Digital Creator & Developer</p>
                </div>
              </div>
            </section>

            {/* Bio Section */}
            <section>
              <h3 className="text-xl font-semibold mb-3">Biography</h3>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Welcome to my portfolio. I'm passionate about creating meaningful digital experiences
                  and sharing knowledge through writing and code.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  This space serves as a collection of my thoughts, projects, and resources that I've
                  found valuable along my journey in technology and design.
                </p>
              </div>
            </section>

            {/* Skills Section */}
            <section>
              <h3 className="text-xl font-semibold mb-3">Skills & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Node.js', 'Python', 'Three.js', 'Next.js', 'Tailwind CSS'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Stats Section */}
            <section>
              <h3 className="text-xl font-semibold mb-3">Quick Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Years Experience', value: '5+' },
                  { label: 'Projects', value: '50+' },
                  { label: 'Technologies', value: '20+' },
                  { label: 'Coffee Cups', value: '∞' }
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-cyberpunk-primary">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Terminal Section */}
            <section>
              <h3 className="text-xl font-semibold mb-3">Chat with AI Assistant</h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Want to learn more about me? Chat with my AI assistant Nishito!
                  You can ask questions about my experience, skills, or just have a conversation.
                </p>
                <button
                  onClick={() => setShowTerminal(!showTerminal)}
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  {showTerminal ? 'Hide Terminal' : 'Open Terminal'}
                </button>
              </div>
              
              {showTerminal && (
                <div className="mt-4">
                  <ChatTerminal
                    className="h-[500px]"
                    initialTheme="dark"
                    soundEnabled={true}
                  />
                </div>
              )}
            </section>

            {/* Actions Section */}
            <section className="flex flex-wrap gap-4 mt-8">
              <button className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Download Resume
              </button>
              <div className="flex items-center space-x-2">
                {['GitHub', 'LinkedIn', 'Twitter'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </section>
          </div>
      </div>
    </div>
  );
};

export default About;