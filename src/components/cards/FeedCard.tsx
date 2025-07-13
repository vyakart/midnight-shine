import React from 'react'
import { motion } from 'framer-motion'
import { BentoCard } from '../BentoGrid'

interface FeedCardProps {
  onClick?: () => void
}

export const FeedCard: React.FC<FeedCardProps> = ({ onClick }) => {
  // Mock tweet data - will be replaced with real Twitter API
  const mockTweet = {
    text: "Just shipped a new feature! Excited to share it with everyone 🚀",
    timestamp: "2h ago",
    likes: 12,
    retweets: 3
  }

  return (
    <BentoCard size="small" onClick={onClick} title="Feed" className="group">
      <div className="flex flex-col h-full">
        {/* Tweet content */}
        <div className="flex-1 mb-4">
          <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">
            {mockTweet.text}
          </p>
        </div>

        {/* Tweet metadata */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{mockTweet.timestamp}</span>
          <div className="flex space-x-3">
            <span>♥ {mockTweet.likes}</span>
            <span>⟲ {mockTweet.retweets}</span>
          </div>
        </div>

        {/* Live indicator */}
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-4 right-4 w-2 h-2 bg-green-500 rounded-full"
        />

        {/* Update indicator */}
        <div className="absolute bottom-4 right-4 text-xs text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
          Live feed
        </div>
      </div>
    </BentoCard>
  )
} 