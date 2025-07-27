import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About</h1>
        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed mb-6">
            Welcome to my portfolio. I'm passionate about creating meaningful digital experiences
            and sharing knowledge through writing and code.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            This space serves as a collection of my thoughts, projects, and resources that I've
            found valuable along my journey in technology and design.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;