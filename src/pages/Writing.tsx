import React from 'react';

const Writing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Writing</h1>
        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed mb-6">
            This is where I share my thoughts, experiences, and insights through written content.
          </p>
          <div className="space-y-8">
            <article className="border-l-4 border-gray-400 pl-6">
              <h3 className="text-xl font-semibold mb-2">Recent Articles</h3>
              <p className="text-gray-700">
                Explore my latest writings on technology, design, and personal growth.
              </p>
            </article>
            <article className="border-l-4 border-gray-400 pl-6">
              <h3 className="text-xl font-semibold mb-2">Technical Insights</h3>
              <p className="text-gray-700">
                Deep dives into programming concepts and development practices.
              </p>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Writing;