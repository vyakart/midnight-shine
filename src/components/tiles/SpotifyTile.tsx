import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import type { SpotifyTileData } from './types'

interface SpotifyTileProps extends Omit<SpotifyTileData, 'type'> {}

interface SpotifyTrack {
  name: string
  artist: string
  album: string
  image: string
  previewUrl?: string
  isPlaying?: boolean
}

export const SpotifyTile: React.FC<SpotifyTileProps> = ({
  trackId,
  playlistId,
  displayType = 'now-playing',
  className,
  onClick,
  colSpan = 2,
  rowSpan = 1,
}) => {
  const [track, setTrack] = useState<SpotifyTrack | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // Mock Spotify API call - in real implementation, use Spotify Web API
    const fetchSpotifyData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data - replace with actual Spotify API call
        setTrack({
          name: "Midnight City",
          artist: "M83",
          album: "Hurry Up, We're Dreaming",
          image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center",
          isPlaying: Math.random() > 0.5
        })
        setIsPlaying(Math.random() > 0.5)
      } catch (error) {
        console.error('Failed to fetch Spotify data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSpotifyData()
  }, [trackId, playlistId, displayType])

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (trackId) {
      window.open(`https://open.spotify.com/track/${trackId}`, '_blank', 'noopener,noreferrer')
    } else {
      window.open('https://open.spotify.com', '_blank', 'noopener,noreferrer')
    }
  }

  const getStatusText = () => {
    if (displayType === 'now-playing') {
      return isPlaying ? 'Now Playing' : 'Last Played'
    }
    return 'Top Track'
  }

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "group relative overflow-hidden rounded-lg",
        "bg-gradient-to-br from-green-500/10 to-green-600/5",
        "border border-border hover:border-green-500/30",
        "cursor-pointer transition-all duration-200",
        "hover:shadow-lg hover:shadow-green-500/10",
        "p-4",
        className
      )}
      onClick={handleClick}
    >
      {/* Spotify gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-green-500">
            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
          <div className="text-xs font-medium text-green-600 dark:text-green-400">
            Spotify
          </div>
        </div>
        
        {isPlaying && (
          <div className="flex items-center space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scaleY: [0.3, 1, 0.3],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1.2, 
                  repeat: Infinity,
                  delay: i * 0.2 
                }}
                className="w-0.5 h-3 bg-green-500 rounded-full"
              />
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="flex space-x-3">
            <div className="h-12 w-12 bg-muted rounded"></div>
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ) : track ? (
        <>
          <div className="flex items-start space-x-3">
            {/* Album Art */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <img
                src={track.image}
                alt={`${track.album} by ${track.artist}`}
                className="h-12 w-12 rounded object-cover shadow-sm"
              />
              {isPlaying && (
                <div className="absolute inset-0 rounded bg-black/20 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </motion.div>
                </div>
              )}
            </motion.div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-1">
                {getStatusText()}
              </div>
              <div className="text-sm font-medium text-card-foreground truncate">
                {track.name}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {track.artist}
              </div>
            </div>

            {/* External link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="text-muted-foreground group-hover:text-card-foreground"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </motion.div>
          </div>

          {/* Progress bar (fake) */}
          {isPlaying && (
            <div className="mt-3">
              <div className="h-0.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-green-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 3, ease: "linear" }}
                />
              </div>
            </div>
          )}
        </>
      ) : null}

      {/* Subtle Spotify pattern */}
      <div className="absolute bottom-0 right-0 w-16 h-16 opacity-5">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      </div>
    </motion.div>
  )
}