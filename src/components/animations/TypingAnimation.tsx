import React, { useState, useEffect, useRef } from 'react';

interface TypingAnimationProps {
  text: string | string[];
  speed?: number;
  startDelay?: number;
  cursor?: boolean;
  cursorChar?: string;
  loop?: boolean;
  pauseBetween?: number;
  onComplete?: () => void;
  onLineComplete?: (lineIndex: number) => void;
  className?: string;
  preserveWhitespace?: boolean;
}

export const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  speed = 50,
  startDelay = 0,
  cursor = true,
  cursorChar = '█',
  loop = false,
  pauseBetween = 1000,
  onComplete,
  onLineComplete,
  className = '',
  preserveWhitespace = false
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(cursor);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const timeoutRef = useRef<number | undefined>(undefined);
  const intervalRef = useRef<number | undefined>(undefined);

  const textArray = Array.isArray(text) ? text : [text];
  const currentLine = textArray[currentLineIndex] || '';

  // Cursor blinking effect
  useEffect(() => {
    if (!cursor) return;

    const blinkInterval = window.setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(blinkInterval);
  }, [cursor]);

  // Main typing animation
  useEffect(() => {
    const startTyping = () => {
      if (currentLineIndex >= textArray.length) {
        if (loop) {
          // Reset for loop
          setCurrentLineIndex(0);
          setCurrentCharIndex(0);
          setDisplayText('');
          setIsComplete(false);
          setIsPaused(true);
          
          timeoutRef.current = window.setTimeout(() => {
            setIsPaused(false);
          }, pauseBetween);
          return;
        } else {
          // Animation complete
          setIsComplete(true);
          onComplete?.();
          return;
        }
      }

      if (isPaused) return;

      if (currentCharIndex <= currentLine.length) {
        const char = currentLine[currentCharIndex];
        
        if (char) {
          setDisplayText(prev => prev + char);
        }

        setCurrentCharIndex(prev => prev + 1);

        // Variable speed based on character type
        let charSpeed = speed;
        if (char === '.' || char === '!' || char === '?') {
          charSpeed = speed * 3; // Pause longer at sentence endings
        } else if (char === ',' || char === ';') {
          charSpeed = speed * 2; // Pause at commas
        } else if (char === ' ') {
          charSpeed = speed * 0.5; // Faster on spaces
        }

        timeoutRef.current = window.setTimeout(startTyping, charSpeed);
      } else {
        // Line complete
        onLineComplete?.(currentLineIndex);
        
        if (currentLineIndex < textArray.length - 1) {
          // Add line break and move to next line
          setDisplayText(prev => prev + '\n');
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
          setIsPaused(true);
          
          timeoutRef.current = window.setTimeout(() => {
            setIsPaused(false);
            startTyping();
          }, pauseBetween / 2);
        } else {
          // All lines complete
          setIsComplete(true);
          onComplete?.();
        }
      }
    };

    // Initial delay before starting
    if (currentLineIndex === 0 && currentCharIndex === 0 && !isPaused) {
      timeoutRef.current = window.setTimeout(startTyping, startDelay);
    } else if (!isPaused) {
      startTyping();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentLineIndex, currentCharIndex, isPaused, textArray, speed, startDelay, loop, pauseBetween, onComplete, onLineComplete]);

  // Cleanup on unmount
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

  const formattedText = preserveWhitespace ? (
    <pre className={className}>{displayText}</pre>
  ) : (
    <span className={className}>
      {displayText.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < displayText.split('\n').length - 1 && <br />}
        </React.Fragment>
      ))}
    </span>
  );

  return (
    <span className="inline-block">
      {formattedText}
      {cursor && (showCursor || !isComplete) && (
        <span 
          className={`inline-block ${showCursor ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            transition: 'opacity 0.1s ease-in-out',
            color: 'inherit'
          }}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
};

// Preset typing speeds
export const TypingSpeed = {
  VERY_SLOW: 150,
  SLOW: 100,
  NORMAL: 50,
  FAST: 25,
  VERY_FAST: 10,
  INSTANT: 0,
} as const;

export default TypingAnimation;