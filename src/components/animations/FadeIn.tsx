import React, { useState, useEffect, useRef } from 'react';

interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  triggerOnce?: boolean;
  threshold?: number;
  className?: string;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  duration = 600,
  delay = 0,
  direction = 'up',
  distance = 20,
  triggerOnce = true,
  threshold = 0.1,
  className = '',
  onAnimationStart,
  onAnimationComplete
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Get initial transform based on direction
  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return `translateY(${distance}px)`;
      case 'down':
        return `translateY(-${distance}px)`;
      case 'left':
        return `translateX(${distance}px)`;
      case 'right':
        return `translateX(-${distance}px)`;
      default:
        return 'none';
    }
  };

  // Set up intersection observer
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setIsVisible(true);
          setHasTriggered(true);
          onAnimationStart?.();
          
          // Trigger completion callback after animation duration
          setTimeout(() => {
            onAnimationComplete?.();
          }, duration + delay);
        } else if (!triggerOnce && !entry.isIntersecting && hasTriggered) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '10px'
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, triggerOnce, hasTriggered, duration, delay, onAnimationStart, onAnimationComplete]);

  return (
    <div
      ref={elementRef}
      className={`transition-all ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0) translateY(0)' : getInitialTransform(),
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// Preset fade configurations
export const FadePresets = {
  FAST: { duration: 300, delay: 0 },
  NORMAL: { duration: 600, delay: 0 },
  SLOW: { duration: 1000, delay: 0 },
  STAGGER_FAST: { duration: 300, delay: 100 },
  STAGGER_NORMAL: { duration: 600, delay: 200 },
  STAGGER_SLOW: { duration: 1000, delay: 300 },
} as const;

export default FadeIn;