import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Post {
  id: string
  content: string
  timestamp: Date
  likes: number
  retweets: number
  replies: number
  liked?: boolean
  retweeted?: boolean
}

export const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Mock posts data - will be replaced with real Twitter API
  const mockPosts: Post[] = [
    {
      id: '1',
      content: 'Just shipped a new feature for the bento grid portfolio! The smooth card-to-page transitions feel so satisfying 🚀 #webdev #design',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      likes: 24,
      retweets: 8,
      replies: 3
    },
    {
      id: '2',
      content: 'Astrophotography session last night at Nandi Hills was incredible! The Milky Way was so clear. Sometimes you need to step away from the screen to find inspiration ✨ #astrophotography #photography',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      likes: 45,
      retweets: 12,
      replies: 7
    },
    {
      id: '3',
      content: 'Working on quantifying journalism impact with LLMs at VoiceDeck. It\'s fascinating how AI can help us understand the ripple effects of good reporting 📊 #journalism #AI #impact',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      likes: 38,
      retweets: 15,
      replies: 9
    },
    {
      id: '4',
      content: 'Reflections on EAGxIndia \'24: Leading production for a $100k conference taught me so much about stakeholder alignment and crisis management. The community energy was incredible! 🇮🇳',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      likes: 67,
      retweets: 23,
      replies: 15
    },
    {
      id: '5',
      content: 'Learning Japanese (currently N5) is teaching me so much about different ways of thinking. Language shapes perspective in subtle but profound ways 🇯🇵 #learning #japanese #perspective',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      likes: 31,
      retweets: 6,
      replies: 12
    }
  ]

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
    return timestamp.toLocaleDateString()
  }

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          }
        : post
    ))
  }

  const handleRetweet = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            retweeted: !post.retweeted,
            retweets: post.retweeted ? post.retweets - 1 : post.retweets + 1
          }
        : post
    ))
  }

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setPosts(mockPosts)
      setIsLoading(false)
    }, 1000)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 lg:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Feed
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            My thoughts, updates, and insights. A real-time window into what I'm working on and thinking about.
          </p>
        </motion.div>

        {/* New Post Composer */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">V</span>
              </div>
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's happening?"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 rounded-xl border-none resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                  rows={3}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {280 - newPost.length} characters remaining
                  </span>
                  <button
                    disabled={!newPost.trim() || newPost.length > 280}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-xl font-medium transition-colors disabled:cursor-not-allowed"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 animate-pulse">
                  <div className="flex space-x-4">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex space-x-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">V</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center space-x-2 mb-3">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                          Vyakart
                        </h3>
                        <span className="text-slate-500 dark:text-slate-400 text-sm">
                          @vyakart
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 text-sm">
                          •
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 text-sm">
                          {formatTimeAgo(post.timestamp)}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="mb-4">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {post.content}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-6 text-slate-500 dark:text-slate-400">
                        <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors group">
                          <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                            💬
                          </div>
                          <span className="text-sm">{post.replies}</span>
                        </button>

                        <button 
                          onClick={() => handleRetweet(post.id)}
                          className={`flex items-center space-x-2 hover:text-green-500 transition-colors group ${
                            post.retweeted ? 'text-green-500' : ''
                          }`}
                        >
                          <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
                            🔄
                          </div>
                          <span className="text-sm">{post.retweets}</span>
                        </button>

                        <button 
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-2 hover:text-red-500 transition-colors group ${
                            post.liked ? 'text-red-500' : ''
                          }`}
                        >
                          <div className="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
                            {post.liked ? '❤️' : '🤍'}
                          </div>
                          <span className="text-sm">{post.likes}</span>
                        </button>

                        <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors group">
                          <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                            📤
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Load More */}
        <motion.div variants={itemVariants} className="mt-8 text-center">
          <button className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors">
            Load More Posts
          </button>
        </motion.div>

        {/* Feed Info */}
        <motion.div variants={itemVariants} className="mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Stay Connected
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              This feed will be connected to my real social media for live updates. For now, enjoy these curated thoughts and insights!
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="https://twitter.com/vyakart" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Follow on Twitter
              </a>
              <a 
                href="mailto:vyakart@tuta.io"
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
              >
                Email Me
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}