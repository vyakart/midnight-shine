import React from 'react';

const Resources: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Resources</h1>
        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed mb-6">
            A curated collection of tools, articles, and resources that I've found valuable
            throughout my journey in technology and design.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Development</h3>
              <p className="text-gray-700 text-sm">
                Essential tools and libraries for modern web development.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Design</h3>
              <p className="text-gray-700 text-sm">
                Resources for UI/UX design and visual creativity.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Learning</h3>
              <p className="text-gray-700 text-sm">
                Books, courses, and articles for continuous growth.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Productivity</h3>
              <p className="text-gray-700 text-sm">
                Apps and workflows to optimize daily work.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Inspiration</h3>
              <p className="text-gray-700 text-sm">
                Sources of creative inspiration and motivation.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Community</h3>
              <p className="text-gray-700 text-sm">
                Forums, Discord servers, and communities to join.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;