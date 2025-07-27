import React from 'react';

const Dana: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Dana</h1>
        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed mb-6">
            Welcome to the Dana section of my portfolio. This space is dedicated to sharing
            insights and experiences.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Projects</h3>
              <p className="text-gray-700">
                Explore various projects and initiatives I've been involved with.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Collaborations</h3>
              <p className="text-gray-700">
                Discover collaborative work and partnerships.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dana;