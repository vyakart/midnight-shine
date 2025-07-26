import React from 'react'
import type { TileData } from './types'
import { 
  SocialLinkTile, 
  GitHubTile, 
  SpotifyTile, 
  ImageTile, 
  VideoTile 
} from './index'

interface TileRendererProps {
  tileData: TileData
}

/**
 * TileRenderer - Maps tile data to appropriate tile components
 * Similar to me-bento's content mapping approach
 */
export const TileRenderer: React.FC<TileRendererProps> = ({ tileData }) => {
  switch (tileData.type) {
    case 'social-link':
      return <SocialLinkTile {...tileData} />
    
    case 'github':
      return <GitHubTile {...tileData} />
    
    case 'spotify':
      return <SpotifyTile {...tileData} />
    
    case 'image':
      return <ImageTile {...tileData} />
    
    case 'video':
      return <VideoTile {...tileData} />
    
    case 'custom':
      return <>{tileData.element}</>
    
    default:
      // Fallback for unknown tile types
      console.warn(`Unknown tile type: ${(tileData as any).type}`)
      return (
        <div className="flex items-center justify-center h-full bg-muted rounded-lg border border-border">
          <span className="text-muted-foreground text-sm">
            Unknown tile type
          </span>
        </div>
      )
  }
}

/**
 * Helper function to create tile data objects
 */
export const createTileData = {
  socialLink: (props: Omit<Extract<TileData, { type: 'social-link' }>, 'type'>): Extract<TileData, { type: 'social-link' }> => ({
    type: 'social-link',
    ...props
  }),
  
  github: (props: Omit<Extract<TileData, { type: 'github' }>, 'type'>): Extract<TileData, { type: 'github' }> => ({
    type: 'github',
    ...props
  }),
  
  spotify: (props: Omit<Extract<TileData, { type: 'spotify' }>, 'type'>): Extract<TileData, { type: 'spotify' }> => ({
    type: 'spotify',
    ...props
  }),
  
  image: (props: Omit<Extract<TileData, { type: 'image' }>, 'type'>): Extract<TileData, { type: 'image' }> => ({
    type: 'image',
    ...props
  }),
  
  video: (props: Omit<Extract<TileData, { type: 'video' }>, 'type'>): Extract<TileData, { type: 'video' }> => ({
    type: 'video',
    ...props
  }),
  
  custom: (props: Omit<Extract<TileData, { type: 'custom' }>, 'type'>): Extract<TileData, { type: 'custom' }> => ({
    type: 'custom',
    ...props
  })
}

/**
 * Predefined tile configurations for common use cases
 */
export const tilePresets = {
  // Social media presets
  github: (username: string, options?: Partial<Extract<TileData, { type: 'github' }>>) => 
    createTileData.github({
      id: `github-${username}`,
      username,
      colSpan: 2,
      rowSpan: 2,
      showContributions: true,
      showStats: true,
      ...options
    }),

  twitter: (username: string, options?: Partial<Extract<TileData, { type: 'social-link' }>>) =>
    createTileData.socialLink({
      id: `twitter-${username}`,
      platform: 'twitter',
      username,
      url: `https://twitter.com/${username}`,
      title: 'Twitter',
      colSpan: 1,
      rowSpan: 1,
      ...options
    }),

  linkedin: (username: string, options?: Partial<Extract<TileData, { type: 'social-link' }>>) =>
    createTileData.socialLink({
      id: `linkedin-${username}`,
      platform: 'linkedin',
      username,
      url: `https://linkedin.com/in/${username}`,
      title: 'LinkedIn',
      colSpan: 1,
      rowSpan: 1,
      ...options
    }),

  devto: (username: string, options?: Partial<Extract<TileData, { type: 'social-link' }>>) =>
    createTileData.socialLink({
      id: `devto-${username}`,
      platform: 'devto',
      username,
      url: `https://dev.to/${username}`,
      title: 'Dev.to',
      colSpan: 1,
      rowSpan: 1,
      ...options
    }),

  // Media presets
  spotifyNowPlaying: (options?: Partial<Extract<TileData, { type: 'spotify' }>>) =>
    createTileData.spotify({
      id: 'spotify-now-playing',
      displayType: 'now-playing',
      colSpan: 2,
      rowSpan: 1,
      ...options
    }),

  youtubeVideo: (videoId: string, title?: string, options?: Partial<Extract<TileData, { type: 'video' }>>) =>
    createTileData.video({
      id: `youtube-${videoId}`,
      videoId,
      platform: 'youtube',
      title,
      colSpan: 2,
      rowSpan: 2,
      ...options
    }),

  profileImage: (imageUrl: string, title?: string, options?: Partial<Extract<TileData, { type: 'image' }>>) =>
    createTileData.image({
      id: 'profile-image',
      src: imageUrl,
      alt: title || 'Profile image',
      title,
      colSpan: 1,
      rowSpan: 2,
      ...options
    })
}