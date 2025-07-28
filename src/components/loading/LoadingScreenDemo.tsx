import { useState, useEffect } from 'react'
import VideoLoadingScreen from './VideoLoadingScreen'

export function LoadingScreenDemo() {
  const [isLoading, setIsLoading] = useState(false)
  const [showDemo, setShowDemo] = useState(true)
  
  const startDemo = () => {
    setIsLoading(true)
    setShowDemo(false)
  }
  
  const handleLoadingComplete = () => {
    setIsLoading(false)
    // Reset demo after a delay
    setTimeout(() => {
      setShowDemo(true)
    }, 2000)
  }
  
  return (
    <>
      <VideoLoadingScreen 
        isLoading={isLoading}
        onComplete={handleLoadingComplete}
        selectionStrategy="random"
      />
      
      {showDemo && !isLoading && (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-8">
          <div className="max-w-2xl text-center text-white">
            <h1 className="text-4xl md:text-6xl font-light mb-8">
              Loading Screen Demo
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed">
              Experience your personalized loading screen with randomized video backgrounds 
              and the beautiful colorful spiral animation.
            </p>
            
            <div className="space-y-6">
              <button
                onClick={startDemo}
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-medium hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Launch Loading Experience
              </button>
              
              <div className="text-sm text-gray-400 space-y-2">
                <p>🎥 Features random video selection from your collection</p>
                <p>✨ Colorful spiral particle animation overlay</p>
                <p>📊 Real-time loading progress tracking</p>
                <p>🎭 Theme-based messages (Zen, Active, Martial)</p>
                <p>🔄 Graceful fallback if video fails to load</p>
                <p>📱 Responsive design for all devices</p>
              </div>
            </div>
            
            <div className="mt-12 text-sm text-gray-500">
              <p>Videos: Meditation • Swimming • Jiu-Jitsu</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LoadingScreenDemo