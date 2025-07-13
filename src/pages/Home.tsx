import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BentoGrid } from '../components/BentoGrid'
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

  const handleCardClick = (route: string) => {
    navigate(route)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <BentoGrid>
        {/* About Me - Large card */}
        <AboutMeCard onClick={() => handleCardClick('/about')} />
        
        {/* Feed - Small card */}
        <FeedCard onClick={() => handleCardClick('/feed')} />
        
        {/* Writing - Medium card */}
        <WritingCard onClick={() => handleCardClick('/writing')} />
        
        {/* Resources - Small card */}
        <ResourcesCard onClick={() => handleCardClick('/resources')} />
        
        {/* Photos - Large card */}
        <PhotosCard onClick={() => handleCardClick('/photos')} />
        
        {/* Terminal - Small card */}
        <TerminalCard onClick={() => handleCardClick('/terminal')} />
        
        {/* Dana - Medium card */}
        <DanaCard onClick={() => handleCardClick('/dana')} />
        
        {/* Chat - Small card */}
        <ChatCard onClick={() => handleCardClick('/chat')} />
      </BentoGrid>
    </div>
  )
} 