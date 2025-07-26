import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import type { ImageTileData } from './types'

interface ImageTileProps extends Omit<ImageTileData, 'type'> {}

export const ImageTile: React.FC<ImageTileProps> = ({
  src,
  alt,
  title,
  subtitle,
  className,
  onClick,
  colSpan = 1,
  rowSpan = 2,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "group relative overflow-hidden rounded-lg",
        "bg-card border border-border",
        "cursor-pointer transition-all duration-200",
        "hover:shadow-lg hover:border-ring/50",
        className
      )}
      onClick={handleClick}
    >
      {/* Image container with aspect ratio */}
      <div className="relative h-full w-full">
        {!imageError ? (
          <>
            {/* Loading placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Main image */}
            <motion.img
              src={src}
              alt={alt}
              className={cn(
                "h-full w-full object-cover transition-all duration-300",
                "group-hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ 
                scale: imageLoaded ? 1 : 1.1, 
                opacity: imageLoaded ? 1 : 0 
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />

            {/* Overlay gradient for text readability */}
            {(title || subtitle) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}

            {/* Text overlay */}
            {(title || subtitle) && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 right-0 p-4 text-white"
              >
                {title && (
                  <div className="text-sm font-medium mb-1 truncate">
                    {title}
                  </div>
                )}
                {subtitle && (
                  <div className="text-xs opacity-80 truncate">
                    {subtitle}
                  </div>
                )}
              </motion.div>
            )}

            {/* Click indicator */}
            {onClick && (
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
            )}

            {/* Loading shimmer effect */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            )}
          </>
        ) : (
          /* Error state */
          <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center space-y-2">
            <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="text-xs text-muted-foreground text-center px-2">
              Failed to load image
            </div>
          </div>
        )}
      </div>

      {/* Decorative corner accent */}
      <div className="absolute top-0 left-0 w-8 h-8 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
        <div className="absolute top-2 left-2 w-4 h-0.5 bg-white rounded-full" />
        <div className="absolute top-2 left-2 w-0.5 h-4 bg-white rounded-full" />
      </div>
    </motion.div>
  )
}