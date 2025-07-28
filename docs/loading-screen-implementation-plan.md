# Loading Screen Implementation Plan

## Overview
Implement a sophisticated loading screen system with video backgrounds using the provided assets (jiujitsu.mp4, meditation.mp4, swimming.mp4) combined with the existing colorful spiral animation.

## Asset Organization Structure

### Required Folder Structure
```
public/
├── assets/
│   ├── videos/
│   │   ├── loading/
│   │   │   ├── jiujitsu.mp4
│   │   │   ├── meditation.mp4
│   │   │   └── swimming.mp4
│   │   └── compressed/
│   │       ├── jiujitsu-720p.mp4
│   │       ├── meditation-720p.mp4
│   │       └── swimming-720p.mp4
│   ├── images/
│   │   └── loading/
│   │       ├── fallback-bg.jpg
│   │       └── logo.svg
│   └── fonts/
└── vite.svg (existing)
```

### Video Optimization Guidelines
- **Primary Format**: MP4 with H.264 codec
- **Resolution**: 1920x1080 (primary), 1280x720 (fallback)
- **Target File Size**: <5MB per video
- **Encoding Settings**:
  - Bitrate: 2-4 Mbps for 1080p, 1-2 Mbps for 720p
  - Frame Rate: 30fps
  - Audio: Optional (can be removed for loading screens)

## Technical Architecture

### 1. Video Selection System
```typescript
interface LoadingVideo {
  id: string;
  src: string;
  srcLowRes: string;
  name: string;
  theme: 'zen' | 'active' | 'martial';
  fallbackImage: string;
}

const loadingVideos: LoadingVideo[] = [
  {
    id: 'meditation',
    src: '/assets/videos/loading/meditation.mp4',
    srcLowRes: '/assets/videos/compressed/meditation-720p.mp4',
    name: 'Meditation',
    theme: 'zen',
    fallbackImage: '/assets/images/loading/meditation-fallback.jpg'
  },
  {
    id: 'swimming',
    src: '/assets/videos/loading/swimming.mp4',
    srcLowRes: '/assets/videos/compressed/swimming-720p.mp4',
    name: 'Swimming',
    theme: 'active',
    fallbackImage: '/assets/images/loading/swimming-fallback.jpg'
  },
  {
    id: 'jiujitsu',
    src: '/assets/videos/loading/jiujitsu.mp4',
    srcLowRes: '/assets/videos/compressed/jiujitsu-720p.mp4',
    name: 'Jiu-Jitsu',
    theme: 'martial',
    fallbackImage: '/assets/images/loading/jiujitsu-fallback.jpg'
  }
];
```

### 2. Component Architecture

#### A. VideoLoadingScreen Component
- **Location**: `src/components/loading/VideoLoadingScreen.tsx`
- **Purpose**: Main container with video background and overlay management
- **Features**:
  - Fullscreen video background
  - Automatic video selection (random/time-based/sequential)
  - Responsive design
  - Fallback to static images

#### B. LoadingVideoPreloader Hook
- **Location**: `src/hooks/useVideoPreloader.ts`
- **Purpose**: Handle video preloading and progress tracking
- **Features**:
  - Progressive loading with buffering detection  
  - Network-aware quality selection
  - Error handling and retries
  - Memory management

#### C. LoadingProgress Component
- **Location**: `src/components/loading/LoadingProgress.tsx`
- **Purpose**: Progress visualization with spiral animation overlay
- **Features**:
  - Animated progress bar
  - Loading stage text updates
  - Integration with existing SpiralAnimation

### 3. Selection Strategies

#### Option A: Random Selection (Recommended)
```typescript
const getRandomVideo = (): LoadingVideo => {
  const randomIndex = Math.floor(Math.random() * loadingVideos.length);
  return loadingVideos[randomIndex];
};
```

#### Option B: Time-based Selection
```typescript
const getTimeBasedVideo = (): LoadingVideo => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return loadingVideos.find(v => v.id === 'meditation')!;
  if (hour >= 12 && hour < 18) return loadingVideos.find(v => v.id === 'swimming')!;
  return loadingVideos.find(v => v.id === 'jiujitsu')!;
};
```

#### Option C: Sequential Rotation
```typescript
const getSequentialVideo = (): LoadingVideo => {
  const lastIndex = parseInt(localStorage.getItem('lastVideoIndex') || '0');
  const nextIndex = (lastIndex + 1) % loadingVideos.length;
  localStorage.setItem('lastVideoIndex', nextIndex.toString());
  return loadingVideos[nextIndex];
};
```

## Implementation Components

### 1. Video Preloader Hook
```typescript
// src/hooks/useVideoPreloader.ts
interface VideoPreloaderOptions {
  video: LoadingVideo;
  autoPlay?: boolean;
  preloadStrategy?: 'metadata' | 'auto' | 'none';
}

interface VideoPreloaderState {
  isLoading: boolean;
  progress: number;
  error: string | null;
  videoElement: HTMLVideoElement | null;
  canPlay: boolean;
  buffered: number;
}

export function useVideoPreloader(options: VideoPreloaderOptions): VideoPreloaderState
```

### 2. Loading Screen States
```typescript
type LoadingState = 
  | 'initializing'      // Selecting video, showing spiral
  | 'preloading'        // Loading video, showing progress
  | 'video-ready'       // Video loaded, transitioning to video bg
  | 'loading-assets'    // Loading other app assets
  | 'complete'          // Ready to show main app
```

### 3. Progressive Loading Strategy
1. **Phase 1 (0-20%)**: Initialize spiral animation, select video
2. **Phase 2 (20-60%)**: Preload selected video, show buffering progress
3. **Phase 3 (60-80%)**: Video ready, fade in background, continue with other assets
4. **Phase 4 (80-100%)**: Finalize loading, prepare transition

## Performance Optimizations

### 1. Network-Aware Loading
```typescript
// Detect connection speed and choose appropriate quality
const getOptimalVideoSrc = (video: LoadingVideo): string => {
  const connection = (navigator as any).connection;
  if (connection?.effectiveType === '4g') return video.src;
  return video.srcLowRes || video.src;
};
```

### 2. Memory Management
- Dispose video elements after transition
- Preload only selected video initially
- Lazy load other videos if needed

### 3. Fallback Strategies
- Network timeout → fallback to images
- Video decode error → fallback to images  
- Slow connection → show spiral only
- No JavaScript → static CSS background

## Responsive Design Considerations

### Mobile Optimizations
- Prefer lower resolution videos on mobile
- Touch-friendly progress indicators
- Reduced motion options for accessibility
- Portrait/landscape orientation handling

### Desktop Enhancements
- Higher quality videos
- Subtle parallax effects
- Keyboard navigation support
- Multi-monitor awareness

## Integration Steps

### Phase 1: Setup Structure
1. Create folder structure in public/assets/
2. Move video files to appropriate locations
3. Create placeholder fallback images

### Phase 2: Core Components
1. Implement useVideoPreloader hook
2. Create VideoLoadingScreen component
3. Create LoadingProgress component

### Phase 3: Integration
1. Integrate with existing SpiralAnimation
2. Add to main App component
3. Configure preloading strategy

### Phase 4: Optimization
1. Add responsive breakpoints
2. Implement fallback handling
3. Performance testing and tuning

## Error Handling Strategy

### Video Loading Failures
```typescript
const errorHandlingFlow = {
  'network-error': 'retry → fallback-image',
  'decode-error': 'fallback-image',
  'timeout': 'fallback-image → spiral-only',
  'not-supported': 'fallback-image'
};
```

### Graceful Degradation
1. **Full Experience**: Video + Spiral + Progress
2. **Reduced**: Image + Spiral + Progress  
3. **Minimal**: Spiral only
4. **Fallback**: Static loading text

## Testing Strategy

### Test Scenarios
- [ ] Fast connection (video loads quickly)
- [ ] Slow connection (progressive loading)
- [ ] Connection timeout (fallback handling)
- [ ] Mobile devices (touch interaction)
- [ ] Different screen sizes (responsive)
- [ ] Video decode errors (error handling)
- [ ] JavaScript disabled (graceful degradation)

### Performance Metrics
- Time to first video frame
- Total loading time
- Memory usage
- Network bandwidth utilization

## Accessibility Considerations

### Features to Include
- `prefers-reduced-motion` support
- Screen reader friendly progress announcements
- Keyboard navigation
- High contrast mode support
- Focus management during loading

### ARIA Implementation
```html
<div 
  role="progressbar" 
  aria-valuenow={progress} 
  aria-valuemin="0" 
  aria-valuemax="100"
  aria-label="Loading application resources"
>
```

## Next Steps

1. **Switch to Code Mode** to implement the folder structure
2. **Move video assets** from `loading screen/` to `public/assets/videos/loading/`
3. **Create optimization scripts** for video compression
4. **Implement core components** following this architecture
5. **Test and iterate** based on performance metrics

This plan provides a comprehensive foundation for implementing a professional-grade loading screen system that showcases your videos while maintaining excellent performance and user experience.