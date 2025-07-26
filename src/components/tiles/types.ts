import type { ReactNode } from 'react'

/**
 * Base interface for all tile types
 * Extends the existing BentoItem interface with specialized tile data
 */
export interface BaseTileProps {
  id: string | number
  colSpan?: 1 | 2 | 3
  rowSpan?: 1 | 2 | 3
  className?: string
  onClick?: () => void
}

export interface SocialLinkTileData extends BaseTileProps {
  type: 'social-link'
  platform: 'github' | 'twitter' | 'linkedin' | 'devto' | 'instagram' | 'youtube'
  username?: string
  url: string
  title: string
  subtitle?: string
}

export interface GitHubTileData extends BaseTileProps {
  type: 'github'
  username: string
  showContributions?: boolean
  showStats?: boolean
}

export interface TwitterTileData extends BaseTileProps {
  type: 'twitter'
  tweetId?: string
  username?: string
  embedType?: 'tweet' | 'timeline'
}

export interface SpotifyTileData extends BaseTileProps {
  type: 'spotify'
  trackId?: string
  playlistId?: string
  displayType?: 'track' | 'playlist' | 'now-playing'
}

export interface ImageTileData extends BaseTileProps {
  type: 'image'
  src: string
  alt: string
  title?: string
  subtitle?: string
}

export interface VideoTileData extends BaseTileProps {
  type: 'video'
  videoId: string
  platform?: 'youtube' | 'vimeo'
  title?: string
  autoplay?: boolean
}

export interface CustomTileData extends BaseTileProps {
  type: 'custom'
  element: ReactNode
}

export type TileData = 
  | SocialLinkTileData 
  | GitHubTileData 
  | TwitterTileData 
  | SpotifyTileData 
  | ImageTileData 
  | VideoTileData 
  | CustomTileData

/**
 * Platform-specific configurations
 */
export const SOCIAL_PLATFORMS = {
  github: {
    name: 'GitHub',
    icon: '🐱',
    color: 'bg-gray-900',
    baseUrl: 'https://github.com/'
  },
  twitter: {
    name: 'Twitter',
    icon: '🐦',
    color: 'bg-blue-500',
    baseUrl: 'https://twitter.com/'
  },
  linkedin: {
    name: 'LinkedIn',
    icon: '💼',
    color: 'bg-blue-600',
    baseUrl: 'https://linkedin.com/in/'
  },
  devto: {
    name: 'Dev.to',
    icon: '👨‍💻',
    color: 'bg-black',
    baseUrl: 'https://dev.to/'
  },
  instagram: {
    name: 'Instagram',
    icon: '📸',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    baseUrl: 'https://instagram.com/'
  },
  youtube: {
    name: 'YouTube',
    icon: '🎥',
    color: 'bg-red-600',
    baseUrl: 'https://youtube.com/@'
  }
} as const