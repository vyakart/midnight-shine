import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BentoCard } from '../BentoGrid'

interface PhotosCardProps {
  onClick?: () => void
}

export const PhotosCard: React.FC<PhotosCardProps> = ({ onClick }) => {
  // Mock photos data - will be replaced with real photo system
  const [currentPhotoSet, setCurrentPhotoSet] = useState(0)
  
  const photoSets = [
    {
      photos: [
        { id: 1, src: '/api/placeholder/150/150', alt: 'Photo 1' },
        { id: 2, src: '/api/placeholder/150/150', alt: 'Photo 2' },
        { id: 3, src: '/api/placeholder/150/150', alt: 'Photo 3' },
        { id: 4, src: '/api/placeholder/150/150', alt: 'Photo 4' }
      ],
      date: 'Today',
      location: 'San Francisco'
    },
    {
      photos: [
        { id: 5, src: '/api/placeholder/150/150', alt: 'Photo 5' },
        { id: 6, src: '/api/placeholder/150/150', alt: 'Photo 6' },
        { id: 7, src: '/api/placeholder/150/150', alt: 'Photo 7' },
        { id: 8, src: '/api/placeholder/150/150', alt: 'Photo 8' }
      ],
      date: 'Yesterday',
      location: 'New York'
    }
  ]

  // Simulate daily photo rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhotoSet((prev) => (prev + 1) % photoSets.length)
    }, 5000) // Change every 5 seconds for demo
    
    return () => clearInterval(interval)
  }, [])

  const currentSet = photoSets[currentPhotoSet]

  return (
    <BentoCard size="large" onClick={onClick} title="Photos" className="group">
      <div className="flex flex-col h-full">
        {/* Photo grid */}
        <div className="grid grid-cols-2 gap-2 flex-1 mb-4">
          {currentSet.photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700"
            >
              <div className="w-full h-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-blue-800 dark:via-purple-800 dark:to-pink-800 flex items-center justify-center">
                <span className="text-2xl">📸</span>
              </div>
              
              {/* Photo overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <span className="text-sm">🔍</span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Photo metadata */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <span>{currentSet.date}</span>
            <span>•</span>
            <span>{currentSet.location}</span>
          </div>
          <div className="flex space-x-1">
            {photoSets.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentPhotoSet 
                    ? 'bg-blue-500' 
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Gallery indicator */}
        <div className="absolute bottom-4 right-4 text-xs text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
          View gallery →
        </div>
      </div>
    </BentoCard>
  )
} 