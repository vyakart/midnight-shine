import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import type { SocialLinkTileData } from './types'
import { SOCIAL_PLATFORMS } from './types'

interface SocialLinkTileProps extends Omit<SocialLinkTileData, 'type'> {}

export const SocialLinkTile: React.FC<SocialLinkTileProps> = ({
  platform,
  username,
  url,
  title,
  subtitle,
  className,
  onClick,
  id,
  colSpan,
  rowSpan,
}) => {
  const platformConfig = SOCIAL_PLATFORMS[platform]
  const displayUrl = username ? `${platformConfig.baseUrl}${username}` : url

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      window.open(displayUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "group relative overflow-hidden rounded-lg",
        "bg-card border border-border",
        "cursor-pointer transition-all duration-200",
        "hover:shadow-lg hover:border-ring/50",
        className
      )}
      onClick={handleClick}
    >
      {/* Background gradient overlay */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300",
        platformConfig.color
      )} />
      
      {/* Content */}
      <div className="relative flex items-center space-x-3 p-4">
        {/* Platform icon */}
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg text-lg",
          "bg-muted transition-colors group-hover:bg-accent"
        )}>
          {platformConfig.icon}
        </div>
        
        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-card-foreground truncate">
            {title || platformConfig.name}
          </div>
          {subtitle && (
            <div className="text-xs text-muted-foreground truncate">
              {subtitle}
            </div>
          )}
          {username && (
            <div className="text-xs text-muted-foreground truncate mt-0.5">
              @{username}
            </div>
          )}
        </div>
        
        {/* External link icon */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted-foreground group-hover:text-card-foreground"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </motion.div>
      </div>
      
      {/* Subtle shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      </div>
    </motion.div>
  )
}