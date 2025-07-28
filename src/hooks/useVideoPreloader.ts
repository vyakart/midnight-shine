import { useState, useEffect, useRef, useCallback } from 'react'

export interface LoadingVideo {
  id: string
  src: string
  name: string
  theme: 'zen' | 'active' | 'martial'
}

export interface VideoPreloaderOptions {
  video: LoadingVideo
  autoPlay?: boolean
  preloadStrategy?: 'metadata' | 'auto' | 'none'
  timeout?: number
}

export interface VideoPreloaderState {
  isLoading: boolean
  progress: number
  error: string | null
  videoElement: HTMLVideoElement | null
  canPlay: boolean
  buffered: number
  isReady: boolean
}

export function useVideoPreloader(options: VideoPreloaderOptions): VideoPreloaderState {
  const { video, autoPlay = false, preloadStrategy = 'metadata', timeout = 10000 } = options
  
  const [state, setState] = useState<VideoPreloaderState>({
    isLoading: true,
    progress: 0,
    error: null,
    videoElement: null,
    canPlay: false,
    buffered: 0,
    isReady: false
  })
  
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const progressIntervalRef = useRef<number | null>(null)
  
  const updateBufferedProgress = useCallback(() => {
    const video = videoRef.current
    if (!video || !video.buffered.length) return
    
    const buffered = video.buffered.end(video.buffered.length - 1)
    const duration = video.duration || 0
    const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0
    
    setState(prev => ({
      ...prev,
      buffered: bufferedPercent,
      progress: Math.min(bufferedPercent, 90) // Reserve 10% for final setup
    }))
  }, [])
  
  const handleLoadStart = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true, progress: 10 }))
  }, [])
  
  const handleLoadedMetadata = useCallback(() => {
    setState(prev => ({ ...prev, progress: 30 }))
    updateBufferedProgress()
  }, [updateBufferedProgress])
  
  const handleLoadedData = useCallback(() => {
    setState(prev => ({ ...prev, progress: 60 }))
  }, [])
  
  const handleCanPlay = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      canPlay: true,
      progress: 80,
      isLoading: false
    }))
  }, [])
  
  const handleCanPlayThrough = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      canPlay: true,
      progress: 100,
      isLoading: false,
      isReady: true
    }))
    
    // Clear timeout since video is ready
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }
  }, [])
  
  const handleError = useCallback((error: ErrorEvent | Event) => {
    const errorMessage = error instanceof ErrorEvent 
      ? `Video loading failed: ${error.message}`
      : 'Video loading failed'
      
    setState(prev => ({
      ...prev,
      error: errorMessage,
      isLoading: false,
      progress: 0
    }))
    
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }
  }, [])
  
  const handleProgress = useCallback(() => {
    updateBufferedProgress()
  }, [updateBufferedProgress])
  
  useEffect(() => {
    if (!video?.src) return
    
    // Create video element
    const videoElement = document.createElement('video')
    videoRef.current = videoElement
    
    // Set video properties with better compatibility
    videoElement.preload = preloadStrategy
    videoElement.muted = true // Required for autoplay
    videoElement.playsInline = true
    videoElement.loop = true
    videoElement.autoplay = autoPlay
    videoElement.controls = false
    
    // Set additional attributes for better browser support
    videoElement.setAttribute('webkit-playsinline', 'true')
    videoElement.setAttribute('playsinline', 'true')
    videoElement.setAttribute('muted', 'true')
    
    // Set source after all properties are configured
    videoElement.src = video.src
    
    // Add event listeners
    videoElement.addEventListener('loadstart', handleLoadStart)
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata)
    videoElement.addEventListener('loadeddata', handleLoadedData)
    videoElement.addEventListener('canplay', handleCanPlay)
    videoElement.addEventListener('canplaythrough', handleCanPlayThrough)
    videoElement.addEventListener('error', handleError)
    videoElement.addEventListener('progress', handleProgress)
    
    // Set up timeout
    timeoutRef.current = window.setTimeout(() => {
      setState(prev => ({
        ...prev,
        error: 'Video loading timeout',
        isLoading: false
      }))
    }, timeout)
    
    // Set up progress polling
    progressIntervalRef.current = window.setInterval(updateBufferedProgress, 500)
    
    // Update state with video element
    setState(prev => ({
      ...prev,
      videoElement,
      isLoading: true,
      progress: 0,
      error: null
    }))
    
    // Start loading
    videoElement.load()
    
    return () => {
      // Cleanup
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
      
      if (progressIntervalRef.current !== null) {
        window.clearInterval(progressIntervalRef.current)
      }
      
      videoElement.removeEventListener('loadstart', handleLoadStart)
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
      videoElement.removeEventListener('loadeddata', handleLoadedData)
      videoElement.removeEventListener('canplay', handleCanPlay)
      videoElement.removeEventListener('canplaythrough', handleCanPlayThrough)
      videoElement.removeEventListener('error', handleError)
      videoElement.removeEventListener('progress', handleProgress)
      
      // Dispose of video element
      videoElement.src = ''
      videoElement.load()
    }
  }, [
    video?.src,
    autoPlay,
    preloadStrategy,
    timeout,
    handleLoadStart,
    handleLoadedMetadata,
    handleLoadedData,
    handleCanPlay,
    handleCanPlayThrough,
    handleError,
    handleProgress,
    updateBufferedProgress
  ])
  
  return state
}

// Utility function to select a random video
export function getRandomVideo(): LoadingVideo {
  const videos: LoadingVideo[] = [
    {
      id: 'meditation',
      src: '/assets/videos/loading/meditation.mp4',
      name: 'Meditation',
      theme: 'zen'
    },
    {
      id: 'swimming',
      src: '/assets/videos/loading/swimming.mp4',
      name: 'Swimming',
      theme: 'active'
    },
    {
      id: 'jiujitsu',
      src: '/assets/videos/loading/jiujitsu.mp4',
      name: 'Jiu-Jitsu',
      theme: 'martial'
    }
  ]
  
  const randomIndex = Math.floor(Math.random() * videos.length)
  return videos[randomIndex]
}

// Utility function for time-based selection
export function getTimeBasedVideo(): LoadingVideo {
  const videos: LoadingVideo[] = [
    {
      id: 'meditation',
      src: '/assets/videos/loading/meditation.mp4',
      name: 'Meditation',
      theme: 'zen'
    },
    {
      id: 'swimming',
      src: '/assets/videos/loading/swimming.mp4',
      name: 'Swimming',
      theme: 'active'
    },
    {
      id: 'jiujitsu',
      src: '/assets/videos/loading/jiujitsu.mp4',
      name: 'Jiu-Jitsu',
      theme: 'martial'
    }
  ]
  
  const hour = new Date().getHours()
  
  // Morning (6-12): Meditation
  if (hour >= 6 && hour < 12) {
    return videos.find(v => v.id === 'meditation')!
  }
  
  // Afternoon (12-18): Swimming
  if (hour >= 12 && hour < 18) {
    return videos.find(v => v.id === 'swimming')!
  }
  
  // Evening/Night (18-6): Jiu-Jitsu
  return videos.find(v => v.id === 'jiujitsu')!
}

// Utility function for sequential rotation
export function getSequentialVideo(): LoadingVideo {
  const videos: LoadingVideo[] = [
    {
      id: 'meditation',
      src: '/assets/videos/loading/meditation.mp4',
      name: 'Meditation',
      theme: 'zen'
    },
    {
      id: 'swimming',
      src: '/assets/videos/loading/swimming.mp4',
      name: 'Swimming',
      theme: 'active'
    },
    {
      id: 'jiujitsu',
      src: '/assets/videos/loading/jiujitsu.mp4',
      name: 'Jiu-Jitsu',
      theme: 'martial'
    }
  ]
  
  const lastIndex = parseInt(localStorage.getItem('lastVideoIndex') || '0')
  const nextIndex = (lastIndex + 1) % videos.length
  localStorage.setItem('lastVideoIndex', nextIndex.toString())
  
  return videos[nextIndex]
}