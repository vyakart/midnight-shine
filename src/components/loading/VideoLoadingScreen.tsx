import { useEffect, useRef, useState } from 'react'
import { SpiralAnimation } from '../SpiralAnimation'
import { useVideoPreloader, getRandomVideo, type LoadingVideo } from '../../hooks/useVideoPreloader'

interface VideoLoadingScreenProps {
  isLoading: boolean
  onComplete?: () => void
  selectionStrategy?: 'random' | 'time-based' | 'sequential'
}

interface LoadingState {
  phase: 'initializing' | 'video-loading' | 'video-ready' | 'complete'
  message: string
  progress: number
}

export function VideoLoadingScreen({ 
  isLoading, 
  onComplete,
  selectionStrategy = 'random'
}: VideoLoadingScreenProps) {
  const [selectedVideo, setSelectedVideo] = useState<LoadingVideo | null>(null)
  const [loadingState, setLoadingState] = useState<LoadingState>({
    phase: 'initializing',
    message: 'Initializing...',
    progress: 0
  })
  const [fadeOut, setFadeOut] = useState(false)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  
  // Initialize video selection
  useEffect(() => {
    if (isLoading && !selectedVideo) {
      // Small delay to show the spiral animation first
      const timer = setTimeout(() => {
        const video = getRandomVideo() // We'll implement other strategies later
        setSelectedVideo(video)
        setLoadingState({
          phase: 'video-loading',
          message: `Loading ${video.name}...`,
          progress: 5
        })
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [isLoading, selectedVideo])
  
  // Video preloader
  const videoState = useVideoPreloader({
    video: selectedVideo!,
    autoPlay: true,
    preloadStrategy: 'auto'
  })
  
  // Handle video loading progress
  useEffect(() => {
    if (!selectedVideo) return
    
    if (videoState.error) {
      setLoadingState({
        phase: 'video-ready',
        message: 'Continuing without video...',
        progress: 90
      })
    } else if (videoState.isReady) {
      setLoadingState({
        phase: 'video-ready',
        message: 'Experience ready...',
        progress: 100
      })
      
      // Small delay before transitioning
      const timer = setTimeout(() => {
        setLoadingState(prev => ({
          ...prev,
          phase: 'complete'
        }))
      }, 1500)
      
      return () => clearTimeout(timer)
    } else if (videoState.isLoading) {
      setLoadingState({
        phase: 'video-loading',
        message: `Loading ${selectedVideo.name}... ${Math.round(videoState.progress)}%`,
        progress: Math.max(10, videoState.progress * 0.8) // Scale to 80% of total
      })
    }
  }, [videoState, selectedVideo])
  
  // Handle completion
  useEffect(() => {
    if (loadingState.phase === 'complete') {
      setFadeOut(true)
      const timer = setTimeout(() => {
        onComplete?.()
      }, 800)
      
      return () => clearTimeout(timer)
    }
  }, [loadingState.phase, onComplete])
  
  // Setup video background when ready
  useEffect(() => {
    if (videoState.videoElement && videoState.canPlay && videoContainerRef.current) {
      const container = videoContainerRef.current
      const video = videoState.videoElement
      
      // Style the video element
      video.style.position = 'absolute'
      video.style.top = '0'
      video.style.left = '0'
      video.style.width = '100%'
      video.style.height = '100%'
      video.style.objectFit = 'cover'
      video.style.zIndex = '1'
      
      // Add to container
      container.appendChild(video)
      
      // Start playing
      video.play().catch(console.warn)
      
      return () => {
        if (container.contains(video)) {
          container.removeChild(video)
        }
      }
    }
  }, [videoState.videoElement, videoState.canPlay])
  
  if (!isLoading && !fadeOut) {
    return null
  }
  
  return (
    <div className={`fixed inset-0 z-50 bg-black transition-opacity duration-800 ${
      fadeOut ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Video Background Container */}
      <div 
        ref={videoContainerRef}
        className="absolute inset-0"
        style={{ 
          opacity: videoState.canPlay && !videoState.error ? 0.6 : 0,
          transition: 'opacity 1s ease-in-out'
        }}
      />
      
      {/* Spiral Animation Overlay */}
      <div className="absolute inset-0 z-10">
        <SpiralAnimation />
      </div>
      
      {/* Loading UI Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
        {/* Loading Content */}
        <div className="text-center max-w-md mx-auto px-6">
          {/* Selected Video Theme Message */}
          {selectedVideo && (
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-light mb-2">
                {getThemeMessage(selectedVideo.theme)}
              </h1>
              <p className="text-lg text-gray-300">
                {selectedVideo.name}
              </p>
            </div>
          )}
          
          {/* Loading Message */}
          <div className="mb-8">
            <p className="text-lg font-light">
              {loadingState.message}
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full max-w-xs mx-auto">
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
                style={{ width: `${loadingState.progress}%` }}
              />
            </div>
            
            {/* Progress Percentage */}
            <div className="text-sm text-gray-400 text-center">
              {Math.round(loadingState.progress)}%
            </div>
          </div>
          
          {/* Error Message */}
          {videoState.error && (
            <div className="mt-4 text-sm text-yellow-400">
              Video unavailable - continuing with animation
            </div>
          )}
        </div>
        
        {/* Skip Option */}
        <div className="absolute bottom-8 right-8">
          <button 
            onClick={() => {
              setLoadingState({
                phase: 'complete',
                message: 'Skipping...',
                progress: 100
              })
            }}
            className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 border border-gray-600 rounded-md hover:border-gray-400"
          >
            Skip Loading
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper function to get theme-based messages
function getThemeMessage(theme: 'zen' | 'active' | 'martial'): string {
  switch (theme) {
    case 'zen':
      return 'Find Your Center'
    case 'active':
      return 'Dive Into Flow'
    case 'martial':
      return 'Embrace The Art'
    default:
      return 'Preparing Experience'
  }
}

export default VideoLoadingScreen