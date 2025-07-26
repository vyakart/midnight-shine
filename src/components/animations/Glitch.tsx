import React, { useState, useEffect, useRef } from 'react';

interface GlitchProps {
  children: React.ReactNode;
  isActive?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  duration?: number;
  trigger?: 'hover' | 'auto' | 'manual';
  className?: string;
  onGlitchStart?: () => void;
  onGlitchEnd?: () => void;
}

export const Glitch: React.FC<GlitchProps> = ({
  children,
  isActive = false,
  intensity = 'medium',
  duration = 2000,
  trigger = 'manual',
  className = '',
  onGlitchStart,
  onGlitchEnd
}) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [shouldGlitch, setShouldGlitch] = useState(isActive);
  const elementRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | undefined>(undefined);
  const intervalRef = useRef<number | undefined>(undefined);

  // Intensity settings
  const intensitySettings = {
    low: {
      clipHeight: 10,
      translateX: 2,
      translateY: 1,
      animationSpeed: 0.8,
      frequency: 80
    },
    medium: {
      clipHeight: 20,
      translateX: 4,
      translateY: 2,
      animationSpeed: 0.5,
      frequency: 50
    },
    high: {
      clipHeight: 40,
      translateX: 8,
      translateY: 4,
      animationSpeed: 0.3,
      frequency: 30
    }
  };

  const settings = intensitySettings[intensity];

  // Handle manual activation
  useEffect(() => {
    setShouldGlitch(isActive);
  }, [isActive]);

  // Auto trigger effect
  useEffect(() => {
    if (trigger === 'auto' && !isGlitching) {
      const randomDelay = Math.random() * 5000 + 2000; // 2-7 seconds
      timeoutRef.current = window.setTimeout(() => {
        startGlitch();
      }, randomDelay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [trigger, isGlitching]);

  const startGlitch = () => {
    if (isGlitching) return;
    
    setIsGlitching(true);
    onGlitchStart?.();

    // Stop glitch after duration
    timeoutRef.current = window.setTimeout(() => {
      setIsGlitching(false);
      onGlitchEnd?.();
      
      // Schedule next auto glitch
      if (trigger === 'auto') {
        const nextDelay = Math.random() * 8000 + 3000; // 3-11 seconds
        timeoutRef.current = window.setTimeout(() => {
          startGlitch();
        }, nextDelay);
      }
    }, duration);
  };

  // Handle hover trigger
  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      startGlitch();
    }
  };

  // Start glitching when shouldGlitch is true
  useEffect(() => {
    if (shouldGlitch && trigger === 'manual') {
      startGlitch();
    }
  }, [shouldGlitch, trigger]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const glitchStyles = isGlitching ? {
    animation: `glitch-skew ${settings.animationSpeed}s infinite linear alternate-reverse`,
  } : {};

  return (
    <div
      ref={elementRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      style={glitchStyles}
    >
      {children}
      
      {/* Glitch layers */}
      {isGlitching && (
        <>
          {/* Red/Cyan layer */}
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{
              animation: `glitch-1 ${settings.animationSpeed}s infinite linear alternate-reverse`,
              clipPath: `inset(${Math.random() * settings.clipHeight}% 0 ${Math.random() * settings.clipHeight}% 0)`,
            }}
          >
            <div 
              className="w-full h-full text-cyan-400 mix-blend-screen"
              style={{
                transform: `translate(-${settings.translateX}px, ${settings.translateY}px)`,
              }}
            >
              {children}
            </div>
          </div>
          
          {/* Blue/Magenta layer */}
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{
              animation: `glitch-2 ${settings.animationSpeed}s infinite linear alternate-reverse`,
              clipPath: `inset(${Math.random() * settings.clipHeight}% 0 ${Math.random() * settings.clipHeight}% 0)`,
            }}
          >
            <div 
              className="w-full h-full text-red-400 mix-blend-screen"
              style={{
                transform: `translate(${settings.translateX}px, -${settings.translateY}px)`,
              }}
            >
              {children}
            </div>
          </div>
          
          {/* Noise overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              animation: `noise ${settings.animationSpeed * 0.5}s infinite`,
            }}
          />
        </>
      )}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes glitch-skew {
            0% { transform: skew(0deg); }
            20% { transform: skew(${Math.random() * 2 - 1}deg); }
            40% { transform: skew(${Math.random() * 2 - 1}deg); }
            60% { transform: skew(${Math.random() * 2 - 1}deg); }
            80% { transform: skew(${Math.random() * 2 - 1}deg); }
            100% { transform: skew(0deg); }
          }

          @keyframes glitch-1 {
            0% { 
              clip-path: inset(${Math.random() * 40}% 0 ${Math.random() * 40}% 0);
              transform: translate(-${settings.translateX}px, ${settings.translateY}px);
            }
            20% { 
              clip-path: inset(${Math.random() * 40}% 0 ${Math.random() * 40}% 0);
              transform: translate(${settings.translateX}px, -${settings.translateY}px);
            }
            40% { 
              clip-path: inset(${Math.random() * 40}% 0 ${Math.random() * 40}% 0);
              transform: translate(-${settings.translateX}px, ${settings.translateY}px);
            }
            60% { 
              clip-path: inset(${Math.random() * 40}% 0 ${Math.random() * 40}% 0);
              transform: translate(${settings.translateX}px, -${settings.translateY}px);
            }
            80% { 
              clip-path: inset(${Math.random() * 40}% 0 ${Math.random() * 40}% 0);
              transform: translate(-${settings.translateX}px, ${settings.translateY}px);
            }
            100% { 
              clip-path: inset(${Math.random() * 40}% 0 ${Math.random() * 40}% 0);
              transform: translate(${settings.translateX}px, -${settings.translateY}px);
            }
          }

          @keyframes glitch-2 {
            0% { 
              clip-path: inset(${Math.random() * 40}% 0 ${Math.random() * 40}% 0);
              transform: translate(${settings.translateX}px, -${settings.translateY}px);
            }
            20% { 
              clip-path: inset(${Math.random() * 40}% 0 ${Math.random() * 40}% 0);
              transform: translate(-${settings.translateX}px, ${settings.translateY}px);
            }
            40% { 
              clip-path: inset(${Math.random() * 40}% 0 ${Math.random() * 40}% 0);
              transform: translate(${settings.translateX}px, -${settings.translateY}px);
            }
            60% { 
              clip-path: inset(${Math.random() * 40}% 0 ${Math.random() * 40}% 0);
              transform: translate(-${settings.translateX}px, ${settings.translateY}px);
            }
            80% { 
              clip-path: inset(${Math.random() * 40}% 0 ${Math.random() * 40}% 0);
              transform: translate(${settings.translateX}px, -${settings.translateY}px);
            }
            100% { 
              clip-path: inset(${Math.random() * 40}% 0 ${Math.random() * 40}% 0);
              transform: translate(-${settings.translateX}px, ${settings.translateY}px);
            }
          }

          @keyframes noise {
            0% { transform: translate(0, 0); }
            10% { transform: translate(-5%, -5%); }
            20% { transform: translate(-10%, 5%); }
            30% { transform: translate(5%, -10%); }
            40% { transform: translate(-5%, 15%); }
            50% { transform: translate(-10%, 5%); }
            60% { transform: translate(15%, 0); }
            70% { transform: translate(0, 10%); }
            80% { transform: translate(-15%, 0); }
            90% { transform: translate(10%, 5%); }
            100% { transform: translate(5%, 0); }
          }
        `}
      </style>
    </div>
  );
};

export default Glitch;