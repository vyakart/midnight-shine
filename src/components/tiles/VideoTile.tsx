import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import type { VideoTileData } from './types'

interface VideoTileProps extends Omit<VideoTileData, 'type'> {}

export const VideoTile: React.FC<VideoTileProps> = ({
  videoId,
  platform = 'youtube',
  title,
  autoplay = false,
  className,
  onClick,
  colSpan = 2,
  rowSpan = 2,
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const getEmbedUrl = () => {
    if (platform === 'youtube') {
      const params = new URLSearchParams({
        enablejsapi: '1',
        origin: window.location.origin,
        ...(autoplay && { autoplay: '1', mute: '1' })
      })
      return `https://www.youtube.com/embed/${videoId}?${params}`
    } else if (platform === 'vimeo') {
      const params = new URLSearchParams({
        ...(autoplay && { autoplay: '1', muted: '1' })
      })
      return `https://player.vimeo.com/video/${videoId}?${params}`
    }
    return ''
  }

  const getThumbnailUrl = () => {
    if (platform === 'youtube') {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }
    // For Vimeo, we'd need to use their API to get thumbnail
    return 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=480&h=270&fit=crop'
  }

  const getExternalUrl = () => {
    if (platform === 'youtube') {
      return `https://www.youtube.com/watch?v=${videoId}`
    } else if (platform === 'vimeo') {
      return `https://vimeo.com/${videoId}`
    }
    return ''
  }

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      window.open(getExternalUrl(), '_blank', 'noopener,noreferrer')
    }
  }

  const getPlatformIcon = () => {
    if (platform === 'youtube') {
      return (
        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    } else {
      return (
        <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.977 6.416c-.105 2.338-1.382 5.981-2.357 8.564-1.028 2.720-2.016 4.95-2.016 4.95s-.673.861-1.608.861c-.934 0-1.608-.861-1.608-.861s-.988-2.23-2.016-4.95c-.975-2.583-2.252-6.226-2.357-8.564C11.889 3.953 11.996 1.5 12 1.5s.111 2.453-.015 4.916z"/>
        </svg>
      )
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "group relative overflow-hidden rounded-lg",
        "bg-card border border-border",
        "cursor-pointer transition-all duration-200",
        "hover:shadow-lg hover:border-ring/50",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Video container */}
      <div className="relative w-full h-full">
        {/* Video thumbnail/iframe */}
        {!isLoaded || !isHovered ? (
          <div className="relative w-full h-full">
            <img
              src={getThumbnailUrl()}
              alt={title || 'Video thumbnail'}
              className="w-full h-full object-cover"
              onLoad={() => setIsLoaded(true)}
            />
            
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center justify-center w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full"
              >
                <motion.svg
                  className="h-6 w-6 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ scale: isHovered ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
                >
                  <path d="M8 5v14l11-7z"/>
                </motion.svg>
              </motion.div>
            </div>
          </div>
        ) : (
          <iframe
            src={getEmbedUrl()}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        )}

        {/* Platform indicator */}
        <div className="absolute top-3 left-3 flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
          {getPlatformIcon()}
          <span className="text-xs font-medium text-white capitalize">
            {platform}
          </span>
        </div>

        {/* External link indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full p-1.5"
        >
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </motion.div>

        {/* Title overlay */}
        {title && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
          >
            <div className="text-sm font-medium text-white line-clamp-2">
              {title}
            </div>
          </motion.div>
        )}

        {/* Loading state */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Shimmer loading effect */}
        {!isLoaded && (
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        )}
      </div>

      {/* Subtle border accent */}
      <div className="absolute inset-0 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  )
}