import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTransition } from '../contexts/TransitionContext'
import BentoGridV2 from '../components/BentoGrid'
import { AboutMeCard } from '../components/cards/AboutMeCard'
import { FeedCard } from '../components/cards/FeedCard'
import { WritingCard } from '../components/cards/WritingCard'
import { ResourcesCard } from '../components/cards/ResourcesCard'
import { PhotosCard } from '../components/cards/PhotosCard'
import { DanaCard } from '../components/cards/DanaCard'
import { TerminalCard } from '../components/cards/TerminalCard'
import { ChatCard } from '../components/cards/ChatCard'

export const Home: React.FC = () => {
  const navigate = useNavigate()
  const { setTransition, isTransitioning } = useTransition()

  const handleCardClick = (route: string, cardId: string) => {
    if (isTransitioning) return // Prevent double clicks during transition
    
    setTransition(cardId)
    
    // Add slight delay to allow expansion animation to start
    setTimeout(() => {
      navigate(route)
    }, 300)
  }

  // Convert existing cards to new BentoGrid format
  const bentoItems = [
    {
      id: 'about',
      colSpan: 1 as const,
      rowSpan: 3 as const,
      element: <AboutMeCard onClick={() => handleCardClick('/about', 'about')} />,
    },
    {
      id: 'feed',
      colSpan: 1 as const,
      rowSpan: 1 as const,
      element: <FeedCard onClick={() => handleCardClick('/feed', 'feed')} />,
    },
    {
      id: 'writing',
      colSpan: 2 as const,
      rowSpan: 1 as const,
      element: <WritingCard onClick={() => handleCardClick('/writing', 'writing')} />,
    },
    {
      id: 'resources',
      colSpan: 1 as const,
      rowSpan: 1 as const,
      element: <ResourcesCard onClick={() => handleCardClick('/resources', 'resources')} />,
    },
    {
      id: 'photos',
      colSpan: 2 as const,
      rowSpan: 2 as const,
      element: <PhotosCard onClick={() => handleCardClick('/photos', 'photos')} />,
    },
    {
      id: 'terminal',
      colSpan: 1 as const,
      rowSpan: 1 as const,
      element: <TerminalCard onClick={() => handleCardClick('/terminal', 'terminal')} />,
    },
    {
      id: 'dana',
      colSpan: 2 as const,
      rowSpan: 1 as const,
      element: <DanaCard onClick={() => handleCardClick('/dana', 'dana')} />,
    },
    {
      id: 'chat',
      colSpan: 1 as const,
      rowSpan: 1 as const,
      element: <ChatCard onClick={() => handleCardClick('/chat', 'chat')} />,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <AnimatePresence>
        {!isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-6xl px-4 py-16"
          >
            <BentoGridV2 items={bentoItems} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}