import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'
import type { GitHubTileData } from './types'

interface GitHubTileProps extends Omit<GitHubTileData, 'type'> {}

interface GitHubStats {
  followers: number
  following: number
  publicRepos: number
  totalStars: number
}

export const GitHubTile: React.FC<GitHubTileProps> = ({
  username,
  showContributions = true,
  showStats = true,
  className,
  onClick,
  colSpan = 2,
  rowSpan = 2,
}) => {
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock GitHub API call - in real implementation, use GitHub API
    const fetchGitHubData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data - replace with actual GitHub API call
        setStats({
          followers: 1234,
          following: 567,
          publicRepos: 89,
          totalStars: 4567
        })
      } catch (error) {
        console.error('Failed to fetch GitHub data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGitHubData()
  }, [username])

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      window.open(`https://github.com/${username}`, '_blank', 'noopener,noreferrer')
    }
  }

  // Mock contribution data (in real implementation, parse GitHub contribution graph)
  const contributionData = Array.from({ length: 365 }, (_, i) => ({
    date: new Date(Date.now() - (364 - i) * 24 * 60 * 60 * 1000),
    contributions: Math.floor(Math.random() * 5)
  }))

  const getContributionColor = (count: number) => {
    if (count === 0) return 'bg-muted'
    if (count <= 1) return 'bg-chart-1/30'
    if (count <= 2) return 'bg-chart-1/60'
    if (count <= 3) return 'bg-chart-1/80'
    return 'bg-chart-1'
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
        "p-4",
        className
      )}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </div>
        <div>
          <div className="text-sm font-medium text-card-foreground">GitHub</div>
          <div className="text-xs text-muted-foreground">@{username}</div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="ml-auto text-muted-foreground group-hover:text-card-foreground"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </motion.div>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {loading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-3 bg-muted rounded mb-1"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              ))}
            </>
          ) : stats ? (
            <>
              <div>
                <div className="text-xs text-muted-foreground">Repos</div>
                <div className="text-sm font-medium">{stats.publicRepos}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Stars</div>
                <div className="text-sm font-medium">{stats.totalStars}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Followers</div>
                <div className="text-sm font-medium">{stats.followers}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Following</div>
                <div className="text-sm font-medium">{stats.following}</div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Contribution Graph */}
      {showContributions && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Contributions</div>
          <div className="grid grid-cols-12 gap-0.5">
            {contributionData.slice(-84).map((day, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.005 }}
                className={cn(
                  "h-1.5 w-1.5 rounded-sm",
                  getContributionColor(day.contributions)
                )}
                title={`${day.contributions} contributions on ${day.date.toDateString()}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Less</span>
            <span>More</span>
          </div>
        </div>
      )}

      {/* Subtle background pattern */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </div>
    </motion.div>
  )
}