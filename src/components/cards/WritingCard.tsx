import React from 'react'
import { motion } from 'framer-motion'
import { BentoCard } from '../BentoGrid'

interface WritingCardProps {
  onClick?: () => void
}

export const WritingCard: React.FC<WritingCardProps> = ({ onClick }) => {
  // Mock posts data - will be replaced with real blog data
  const mockPosts = [
    {
      title: "Building Modern Web Applications",
      date: "Dec 15, 2024",
      readTime: "5 min read"
    },
    {
      title: "The Future of AI Development",
      date: "Dec 10, 2024",
      readTime: "3 min read"
    },
    {
      title: "Design Systems at Scale",
      date: "Dec 5, 2024",
      readTime: "7 min read"
    }
  ]

  return (
    <BentoCard size="medium" onClick={onClick} title="Writing" className="group">
      <div className="flex flex-col h-full">
        {/* Posts list */}
        <div className="space-y-3 flex-1">
          {mockPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-slate-100 dark:border-slate-700 pb-3 last:border-b-0"
            >
              <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">
                {post.title}
              </h4>
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-2">
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View all indicator */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {mockPosts.length} recent posts
          </span>
          <div className="text-xs text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
            View all →
          </div>
        </div>
      </div>
    </BentoCard>
  )
} 