import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface NavigationLoadingState {
  isLoading: boolean
  previousPath: string | null
  currentPath: string
}

export function useNavigationLoading(minLoadingTime = 2000) {
  const location = useLocation()
  const [state, setState] = useState<NavigationLoadingState>({
    isLoading: false,
    previousPath: null,
    currentPath: location.pathname
  })
  
  useEffect(() => {
    // Check if this is a navigation change (not initial load)
    if (state.currentPath !== location.pathname) {
      // Only show loading for major route transitions
      if (shouldShowNavigationLoading(state.currentPath, location.pathname)) {
        setState(prev => ({
          isLoading: true,
          previousPath: prev.currentPath,
          currentPath: location.pathname
        }))
        
        // Minimum loading time for user experience
        const timer = setTimeout(() => {
          setState(prev => ({
            ...prev,
            isLoading: false
          }))
        }, minLoadingTime)
        
        return () => clearTimeout(timer)
      } else {
        // Update path without loading screen
        setState(prev => ({
          ...prev,
          previousPath: prev.currentPath,
          currentPath: location.pathname
        }))
      }
    }
  }, [location.pathname, minLoadingTime, state.currentPath])
  
  return state
}

// Helper function to determine if navigation should trigger loading
export function shouldShowNavigationLoading(fromPath: string, toPath: string): boolean {
  // Show loading for major page transitions
  const majorRoutes = ['/', '/about', '/writing', '/dana', '/resources']
  
  return majorRoutes.includes(fromPath) && majorRoutes.includes(toPath) && fromPath !== toPath
}