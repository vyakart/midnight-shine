import { useState, useCallback, useRef } from 'react';

export interface TerminalEffectsState {
  matrixRain: boolean;
  scanLines: boolean;
  particleField: boolean;
  glitchText: boolean;
  screenFlicker: boolean;
  bootSequence: boolean;
  ambientGlow: boolean;
}

export interface EffectSettings {
  intensity: 'low' | 'medium' | 'high';
  speed: 'slow' | 'normal' | 'fast';
  soundEnabled: boolean;
  accessibilityMode: boolean;
}

export interface UseTerminalEffectsReturn {
  effects: TerminalEffectsState;
  settings: EffectSettings;
  toggleEffect: (effect: keyof TerminalEffectsState) => void;
  enableEffect: (effect: keyof TerminalEffectsState) => void;
  disableEffect: (effect: keyof TerminalEffectsState) => void;
  setEffectIntensity: (intensity: 'low' | 'medium' | 'high') => void;
  setEffectSpeed: (speed: 'slow' | 'normal' | 'fast') => void;
  enableAllEffects: () => void;
  disableAllEffects: () => void;
  triggerScreenFlicker: (duration?: number) => void;
  triggerBootSequence: () => void;
  isPerformanceMode: boolean;
  setPerformanceMode: (enabled: boolean) => void;
}

const defaultEffectsState: TerminalEffectsState = {
  matrixRain: false,
  scanLines: true,
  particleField: false,
  glitchText: false,
  screenFlicker: false,
  bootSequence: false,
  ambientGlow: true,
};

const defaultSettings: EffectSettings = {
  intensity: 'medium',
  speed: 'normal',
  soundEnabled: true,
  accessibilityMode: false,
};

export const useTerminalEffects = (): UseTerminalEffectsReturn => {
  const [effects, setEffects] = useState<TerminalEffectsState>(defaultEffectsState);
  const [settings, setSettings] = useState<EffectSettings>(defaultSettings);
  const [isPerformanceMode, setIsPerformanceMode] = useState(false);
  
  const flickerTimeoutRef = useRef<number | undefined>(undefined);
  const bootSequenceTimeoutRef = useRef<number | undefined>(undefined);

  // Check if device has limited performance capabilities
  const checkPerformanceCapabilities = useCallback(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const hasWebGL = !!gl;
    
    // Basic performance heuristics
    const isLowPerformance = 
      !hasWebGL ||
      navigator.hardwareConcurrency <= 2 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    return !isLowPerformance;
  }, []);

  const setPerformanceMode = useCallback((enabled: boolean) => {
    setIsPerformanceMode(enabled);
    
    if (enabled) {
      // Disable performance-heavy effects in performance mode
      setEffects(prev => ({
        ...prev,
        matrixRain: false,
        particleField: false,
        glitchText: false,
      }));
      
      setSettings(prev => ({
        ...prev,
        intensity: 'low',
        speed: 'slow',
      }));
    }
  }, []);

  const toggleEffect = useCallback((effect: keyof TerminalEffectsState) => {
    if (settings.accessibilityMode && ['screenFlicker', 'glitchText'].includes(effect)) {
      return; // Don't enable potentially problematic effects in accessibility mode
    }

    setEffects(prev => ({
      ...prev,
      [effect]: !prev[effect]
    }));
  }, [settings.accessibilityMode]);

  const enableEffect = useCallback((effect: keyof TerminalEffectsState) => {
    if (settings.accessibilityMode && ['screenFlicker', 'glitchText'].includes(effect)) {
      return;
    }

    setEffects(prev => ({
      ...prev,
      [effect]: true
    }));
  }, [settings.accessibilityMode]);

  const disableEffect = useCallback((effect: keyof TerminalEffectsState) => {
    setEffects(prev => ({
      ...prev,
      [effect]: false
    }));
  }, []);

  const setEffectIntensity = useCallback((intensity: 'low' | 'medium' | 'high') => {
    setSettings(prev => ({
      ...prev,
      intensity
    }));
  }, []);

  const setEffectSpeed = useCallback((speed: 'slow' | 'normal' | 'fast') => {
    setSettings(prev => ({
      ...prev,
      speed
    }));
  }, []);

  const enableAllEffects = useCallback(() => {
    if (!checkPerformanceCapabilities()) {
      setPerformanceMode(true);
      return;
    }

    const newEffects: TerminalEffectsState = {
      matrixRain: false, // Keep matrix rain off by default
      scanLines: true,
      particleField: !isPerformanceMode,
      glitchText: !settings.accessibilityMode,
      screenFlicker: false, // Keep flicker off by default
      bootSequence: false,
      ambientGlow: true,
    };

    setEffects(newEffects);
  }, [checkPerformanceCapabilities, isPerformanceMode, settings.accessibilityMode]);

  const disableAllEffects = useCallback(() => {
    setEffects({
      matrixRain: false,
      scanLines: false,
      particleField: false,
      glitchText: false,
      screenFlicker: false,
      bootSequence: false,
      ambientGlow: false,
    });
  }, []);

  const triggerScreenFlicker = useCallback((duration: number = 500) => {
    if (settings.accessibilityMode) return;

    setEffects(prev => ({ ...prev, screenFlicker: true }));
    
    if (flickerTimeoutRef.current) {
      clearTimeout(flickerTimeoutRef.current);
    }
    
    flickerTimeoutRef.current = window.setTimeout(() => {
      setEffects(prev => ({ ...prev, screenFlicker: false }));
    }, duration);
  }, [settings.accessibilityMode]);

  const triggerBootSequence = useCallback(() => {
    setEffects(prev => ({ ...prev, bootSequence: true }));
    
    if (bootSequenceTimeoutRef.current) {
      clearTimeout(bootSequenceTimeoutRef.current);
    }
    
    bootSequenceTimeoutRef.current = window.setTimeout(() => {
      setEffects(prev => ({ ...prev, bootSequence: false }));
    }, 3000); // Boot sequence lasts 3 seconds
  }, []);

  return {
    effects,
    settings,
    toggleEffect,
    enableEffect,
    disableEffect,
    setEffectIntensity,
    setEffectSpeed,
    enableAllEffects,
    disableAllEffects,
    triggerScreenFlicker,
    triggerBootSequence,
    isPerformanceMode,
    setPerformanceMode,
  };
};

export default useTerminalEffects;