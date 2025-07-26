import React from 'react';
import { BentoGridEnhanced } from './BentoGridEnhanced';
import { tilePresets, createTileData } from './tiles/TileRenderer';
import type { TileData } from './tiles/types';

/**
 * BentoDemo - Comprehensive demo showcasing all tile types
 * Based on me-bento's approach with various content tiles
 */
export const BentoDemo: React.FC = () => {
  const demoTiles: TileData[] = [
    // Profile/About tile - Large centerpiece
    createTileData.custom({
      id: 'profile',
      colSpan: 2,
      rowSpan: 3,
      element: (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">ZS</span>
          </div>
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Ziks Artin
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Full Stack Developer
          </p>
          <div className="text-xs text-muted-foreground">
            Building digital experiences with passion
          </div>
        </div>
      )
    }),

    // GitHub tile with contributions
    tilePresets.github('ziksartin', {
      colSpan: 2,
      rowSpan: 2,
    }),

    // Spotify now playing
    tilePresets.spotifyNowPlaying({
      colSpan: 2,
      rowSpan: 1,
    }),

    // Social media links
    tilePresets.twitter('ziksartin', {
      colSpan: 1,
      rowSpan: 1,
    }),

    tilePresets.linkedin('ziksartin', {
      colSpan: 1,
      rowSpan: 1,
    }),

    tilePresets.devto('ziksartin', {
      colSpan: 1,
      rowSpan: 1,
    }),

    // Image tile
    tilePresets.profileImage(
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=600&fit=crop&crop=face',
      'Workspace',
      {
        colSpan: 1,
        rowSpan: 2,
      }
    ),

    // YouTube video tile
    tilePresets.youtubeVideo(
      'dQw4w9WgXcQ',
      'Never Gonna Give You Up',
      {
        colSpan: 2,
        rowSpan: 2,
      }
    ),

    // Custom tiles for additional content
    createTileData.custom({
      id: 'skills',
      colSpan: 1,
      rowSpan: 2,
      element: (
        <div className="p-4 h-full">
          <h4 className="text-sm font-medium text-card-foreground mb-3">
            Skills
          </h4>
          <div className="space-y-2">
            {[
              { name: 'React', level: 90 },
              { name: 'TypeScript', level: 85 },
              { name: 'Node.js', level: 80 },
              { name: 'Python', level: 75 }
            ].map((skill) => (
              <div key={skill.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{skill.name}</span>
                  <span className="text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }),

    // Status/availability tile
    createTileData.custom({
      id: 'status',
      colSpan: 1,
      rowSpan: 1,
      element: (
        <div className="p-4 h-full flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <div className="text-sm font-medium text-card-foreground">Available</div>
            <div className="text-xs text-muted-foreground">For new projects</div>
          </div>
        </div>
      )
    }),

    // Contact tile
    createTileData.custom({
      id: 'contact',
      colSpan: 1,
      rowSpan: 1,
      element: (
        <div className="p-4 h-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl mb-2">💬</div>
            <div className="text-xs font-medium text-card-foreground">Let's Talk</div>
          </div>
        </div>
      ),
      onClick: () => {
        window.open('mailto:hello@example.com', '_blank');
      }
    }),

    // Location tile
    createTileData.custom({
      id: 'location',
      colSpan: 1,
      rowSpan: 1,
      element: (
        <div className="p-4 h-full flex items-center space-x-3">
          <div className="text-lg">📍</div>
          <div>
            <div className="text-sm font-medium text-card-foreground">Location</div>
            <div className="text-xs text-muted-foreground">San Francisco</div>
          </div>
        </div>
      )
    }),
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Me-Bento Style Portfolio
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A modern, tile-based approach to showcasing your digital presence. 
            Inspired by Bento.me with enhanced animations and interactions.
          </p>
        </div>

        {/* Enhanced Bento Grid */}
        <BentoGridEnhanced
          tiles={demoTiles}
          columns={{ base: 1, md: 3, lg: 4 }}
          rowHeight={{ base: 120, md: 140, lg: 150 }}
          gap={6}
          className="mb-12"
          enableAnimations={true}
          staggerDelay={0.1}
        />

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Built with React, TypeScript, Tailwind CSS, and Framer Motion</p>
          <p className="mt-2">Integrated me-bento tile system for maximum flexibility</p>
        </div>
      </div>
    </div>
  );
};

export default BentoDemo;