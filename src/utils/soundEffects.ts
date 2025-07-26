/**
 * Terminal Sound Effects Utility
 * 
 * Provides procedural sound generation for retro/sci-fi terminal aesthetic
 * using Web Audio API with performance optimization and accessibility support.
 */

// Sound profile types
export type SoundProfile = 'retro' | 'modern' | 'minimal';
export type SoundType = 'keystroke' | 'command' | 'error' | 'boot' | 'matrix' | 'notification';

// Sound configuration interfaces
export interface SoundConfig {
  volume: number;
  profile: SoundProfile;
  muted: boolean;
  respectsPreferences: boolean;
  poolSize: number;
}

export interface OscillatorParams {
  frequency: number;
  type: OscillatorType;
  gain: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export interface SoundParams {
  duration: number;
  frequencies: number[];
  envelope: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
  effects?: {
    vibrato?: { rate: number; depth: number };
    tremolo?: { rate: number; depth: number };
    filter?: { frequency: number; Q: number };
  };
}

// Sound pool for performance optimization
class SoundPool {
  private pool: Map<SoundType, AudioBuffer[]> = new Map();
  private maxSize: number;

  constructor(maxSize: number = 10) {
    this.maxSize = maxSize;
  }

  get(type: SoundType): AudioBuffer | null {
    const pool = this.pool.get(type);
    return pool && pool.length > 0 ? pool.pop()! : null;
  }

  release(type: SoundType, buffer: AudioBuffer): void {
    if (!this.pool.has(type)) {
      this.pool.set(type, []);
    }
    
    const pool = this.pool.get(type)!;
    if (pool.length < this.maxSize) {
      pool.push(buffer);
    }
  }

  clear(): void {
    this.pool.clear();
  }
}

/**
 * Main SoundEffects class
 */
export class SoundEffects {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private config: SoundConfig;
  private soundPool: SoundPool;
  private initialized: boolean = false;

  // Sound profiles with different aesthetic characteristics
  private profiles: Record<SoundProfile, Record<SoundType, SoundParams>> = {
    retro: {
      keystroke: {
        duration: 0.08,
        frequencies: [800, 1200],
        envelope: { attack: 0.01, decay: 0.02, sustain: 0.3, release: 0.05 }
      },
      command: {
        duration: 0.15,
        frequencies: [600, 900, 1200],
        envelope: { attack: 0.02, decay: 0.05, sustain: 0.4, release: 0.08 }
      },
      error: {
        duration: 0.25,
        frequencies: [200, 300],
        envelope: { attack: 0.05, decay: 0.1, sustain: 0.6, release: 0.1 },
        effects: { vibrato: { rate: 6, depth: 0.1 } }
      },
      boot: {
        duration: 2.0,
        frequencies: [440, 523, 659, 784],
        envelope: { attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.8 }
      },
      matrix: {
        duration: 0.12,
        frequencies: [1000, 1500, 2000],
        envelope: { attack: 0.01, decay: 0.03, sustain: 0.2, release: 0.08 },
        effects: { filter: { frequency: 2000, Q: 10 } }
      },
      notification: {
        duration: 0.2,
        frequencies: [880, 1760],
        envelope: { attack: 0.02, decay: 0.08, sustain: 0.3, release: 0.1 }
      }
    },
    modern: {
      keystroke: {
        duration: 0.06,
        frequencies: [1200, 1800],
        envelope: { attack: 0.005, decay: 0.015, sustain: 0.2, release: 0.04 }
      },
      command: {
        duration: 0.12,
        frequencies: [800, 1200, 1600],
        envelope: { attack: 0.01, decay: 0.03, sustain: 0.3, release: 0.08 }
      },
      error: {
        duration: 0.2,
        frequencies: [150, 250],
        envelope: { attack: 0.02, decay: 0.05, sustain: 0.5, release: 0.13 }
      },
      boot: {
        duration: 1.5,
        frequencies: [523, 659, 784, 988],
        envelope: { attack: 0.05, decay: 0.1, sustain: 0.8, release: 0.6 }
      },
      matrix: {
        duration: 0.1,
        frequencies: [1500, 2000, 2500],
        envelope: { attack: 0.005, decay: 0.02, sustain: 0.15, release: 0.065 }
      },
      notification: {
        duration: 0.15,
        frequencies: [1047, 2093],
        envelope: { attack: 0.01, decay: 0.05, sustain: 0.25, release: 0.09 }
      }
    },
    minimal: {
      keystroke: {
        duration: 0.04,
        frequencies: [1000],
        envelope: { attack: 0.005, decay: 0.01, sustain: 0.1, release: 0.025 }
      },
      command: {
        duration: 0.08,
        frequencies: [800, 1200],
        envelope: { attack: 0.01, decay: 0.02, sustain: 0.2, release: 0.05 }
      },
      error: {
        duration: 0.1,
        frequencies: [400],
        envelope: { attack: 0.02, decay: 0.03, sustain: 0.3, release: 0.05 }
      },
      boot: {
        duration: 0.5,
        frequencies: [523, 659],
        envelope: { attack: 0.05, decay: 0.1, sustain: 0.6, release: 0.25 }
      },
      matrix: {
        duration: 0.06,
        frequencies: [1200],
        envelope: { attack: 0.005, decay: 0.015, sustain: 0.1, release: 0.04 }
      },
      notification: {
        duration: 0.08,
        frequencies: [880],
        envelope: { attack: 0.01, decay: 0.02, sustain: 0.2, release: 0.05 }
      }
    }
  };

  constructor(config: Partial<SoundConfig> = {}) {
    this.config = {
      volume: 0.7,
      profile: 'retro',
      muted: false,
      respectsPreferences: true,
      poolSize: 10,
      ...config
    };
    
    this.soundPool = new SoundPool(this.config.poolSize);
  }

  /**
   * Initialize the audio context and check for user preferences
   */
  private async initialize(): Promise<boolean> {
    if (this.initialized) return true;

    // Check user preferences for reduced motion/sound
    if (this.config.respectsPreferences) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        console.log('SoundEffects: Respecting user preference for reduced motion/sound');
        return false;
      }
    }

    try {
      // Create audio context - handle browser autoplay policies
      this.audioContext = new AudioContext();
      
      // Resume context if suspended (required by some browsers)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Create master gain node
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this.config.volume;

      this.initialized = true;
      return true;
    } catch (error) {
      console.warn('SoundEffects: Failed to initialize audio context:', error);
      return false;
    }
  }

  /**
   * Create a procedural sound with specified parameters
   */
  private async createSound(type: SoundType, variation: number = 0): Promise<void> {
    if (!await this.initialize() || this.config.muted || !this.audioContext || !this.masterGain) {
      return;
    }

    const params = this.profiles[this.config.profile][type];
    const startTime = this.audioContext.currentTime;
    
    // Create oscillators for each frequency
    params.frequencies.forEach((baseFreq, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      
      // Apply frequency variation for more natural sound
      const frequency = baseFreq + (variation * (Math.random() - 0.5) * 50);
      oscillator.frequency.setValueAtTime(frequency, startTime);
      
      // Set oscillator type based on sound profile
      oscillator.type = this.config.profile === 'retro' ? 'square' : 
                       this.config.profile === 'modern' ? 'sawtooth' : 'sine';

      // Apply envelope (ADSR)
      const { attack, decay, sustain, release } = params.envelope;
      const peakGain = 0.3 / params.frequencies.length; // Normalize for multiple frequencies
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attack);
      gainNode.gain.linearRampToValueAtTime(peakGain * sustain, startTime + attack + decay);
      gainNode.gain.setValueAtTime(peakGain * sustain, startTime + params.duration - release);
      gainNode.gain.linearRampToValueAtTime(0, startTime + params.duration);

      // Apply effects if specified
      let effectNode: AudioNode = gainNode;
      
      if (params.effects?.vibrato) {
        const lfo = this.audioContext!.createOscillator();
        const lfoGain = this.audioContext!.createGain();
        
        lfo.frequency.value = params.effects.vibrato.rate;
        lfoGain.gain.value = params.effects.vibrato.depth * frequency;
        
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        
        lfo.start(startTime);
        lfo.stop(startTime + params.duration);
      }

      if (params.effects?.filter) {
        const filter = this.audioContext!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = params.effects.filter.frequency;
        filter.Q.value = params.effects.filter.Q;
        
        gainNode.connect(filter);
        effectNode = filter;
      }

      // Connect to master gain
      oscillator.connect(gainNode);
      effectNode.connect(this.masterGain!);

      // Start and stop the oscillator
      oscillator.start(startTime);
      oscillator.stop(startTime + params.duration);
    });
  }

  /**
   * Public API methods
   */

  /**
   * Play keystroke sound with slight variations for realism
   */
  async playKeystroke(): Promise<void> {
    await this.createSound('keystroke', Math.random() * 0.3);
  }

  /**
   * Play command execution confirmation sound
   */
  async playCommandExecute(): Promise<void> {
    await this.createSound('command');
  }

  /**
   * Play error notification sound
   */
  async playError(): Promise<void> {
    await this.createSound('error');
  }

  /**
   * Play boot sequence with ascending tones
   */
  async playBootSequence(): Promise<void> {
    if (!await this.initialize() || this.config.muted) return;

    const params = this.profiles[this.config.profile].boot;
    const noteDelay = params.duration / params.frequencies.length;

    // Play each frequency in sequence for boot sequence effect
    params.frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.createBootTone(freq, noteDelay);
      }, index * noteDelay * 1000 / 2); // Overlap notes slightly
    });
  }

  private async createBootTone(frequency: number, duration: number): Promise<void> {
    if (!this.audioContext || !this.masterGain) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const startTime = this.audioContext.currentTime;

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    // Smooth envelope for boot sequence
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.2, startTime + duration * 0.1);
    gainNode.gain.linearRampToValueAtTime(0.15, startTime + duration * 0.7);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }

  /**
   * Play matrix mode sound effect
   */
  async playMatrixMode(): Promise<void> {
    await this.createSound('matrix', Math.random() * 0.2);
  }

  /**
   * Play general notification sound
   */
  async playNotification(): Promise<void> {
    await this.createSound('notification');
  }

  /**
   * Control methods
   */

  /**
   * Set master volume (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.value = this.config.volume;
    }
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.config.volume;
  }

  /**
   * Mute all sounds
   */
  mute(): void {
    this.config.muted = true;
  }

  /**
   * Unmute sounds
   */
  unmute(): void {
    this.config.muted = false;
  }

  /**
   * Toggle mute state
   */
  toggleMute(): boolean {
    this.config.muted = !this.config.muted;
    return this.config.muted;
  }

  /**
   * Check if muted
   */
  isMuted(): boolean {
    return this.config.muted;
  }

  /**
   * Set sound profile
   */
  setProfile(profile: SoundProfile): void {
    this.config.profile = profile;
  }

  /**
   * Get current profile
   */
  getProfile(): SoundProfile {
    return this.config.profile;
  }

  /**
   * Get available profiles
   */
  getAvailableProfiles(): SoundProfile[] {
    return ['retro', 'modern', 'minimal'];
  }

  /**
   * Enable/disable user preference respect
   */
  setRespectsPreferences(respect: boolean): void {
    this.config.respectsPreferences = respect;
  }

  /**
   * Check if audio context is available and initialized
   */
  isAvailable(): boolean {
    return this.initialized && !!this.audioContext && this.audioContext.state === 'running';
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.soundPool.clear();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.masterGain = null;
    this.initialized = false;
  }

  /**
   * Background ambient sound (optional feature)
   */
  private ambientOscillator: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  /**
   * Start low-volume ambient background sound
   */
  async startAmbientSound(): Promise<void> {
    if (!await this.initialize() || this.config.muted || this.ambientOscillator) return;

    if (!this.audioContext || !this.masterGain) return;

    this.ambientOscillator = this.audioContext.createOscillator();
    this.ambientGain = this.audioContext.createGain();

    // Very low frequency, low volume ambient hum
    this.ambientOscillator.frequency.value = 60;
    this.ambientOscillator.type = 'sine';
    this.ambientGain.gain.value = 0.02; // Very quiet

    // Add subtle modulation
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    
    lfo.frequency.value = 0.1; // Very slow modulation
    lfoGain.gain.value = 2;
    
    lfo.connect(lfoGain);
    lfoGain.connect(this.ambientOscillator.frequency);

    this.ambientOscillator.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);

    this.ambientOscillator.start();
    lfo.start();
  }

  /**
   * Stop ambient background sound
   */
  stopAmbientSound(): void {
    if (this.ambientOscillator) {
      this.ambientOscillator.stop();
      this.ambientOscillator = null;
      this.ambientGain = null;
    }
  }
}

// Singleton instance for easy access throughout the application
let soundEffectsInstance: SoundEffects | null = null;

/**
 * Get the singleton SoundEffects instance
 */
export const getSoundEffects = (config?: Partial<SoundConfig>): SoundEffects => {
  if (!soundEffectsInstance) {
    soundEffectsInstance = new SoundEffects(config);
  }
  return soundEffectsInstance;
};

/**
 * Dispose of the singleton instance
 */
export const disposeSoundEffects = (): void => {
  if (soundEffectsInstance) {
    soundEffectsInstance.dispose();
    soundEffectsInstance = null;
  }
};

/**
 * Integration helpers for useTerminalEffects hook
 */

// Integration interface for terminal effects
export interface SoundIntegration {
  soundEffects: SoundEffects;
  playKeystroke: () => Promise<void>;
  playCommandExecute: () => Promise<void>;
  playError: () => Promise<void>;
  playBootSequence: () => Promise<void>;
  playMatrixMode: () => Promise<void>;
  playNotification: () => Promise<void>;
  setVolume: (volume: number) => void;
  mute: () => void;
  unmute: () => void;
  toggleMute: () => boolean;
  setProfile: (profile: SoundProfile) => void;
  isMuted: () => boolean;
  isAvailable: () => boolean;
  startAmbient: () => Promise<void>;
  stopAmbient: () => void;
}

/**
 * Create sound integration object for use in hooks
 */
export const createSoundIntegration = (config?: Partial<SoundConfig>): SoundIntegration => {
  const soundEffects = getSoundEffects(config);
  
  return {
    soundEffects,
    playKeystroke: () => soundEffects.playKeystroke(),
    playCommandExecute: () => soundEffects.playCommandExecute(),
    playError: () => soundEffects.playError(),
    playBootSequence: () => soundEffects.playBootSequence(),
    playMatrixMode: () => soundEffects.playMatrixMode(),
    playNotification: () => soundEffects.playNotification(),
    setVolume: (volume: number) => soundEffects.setVolume(volume),
    mute: () => soundEffects.mute(),
    unmute: () => soundEffects.unmute(),
    toggleMute: () => soundEffects.toggleMute(),
    setProfile: (profile: SoundProfile) => soundEffects.setProfile(profile),
    isMuted: () => soundEffects.isMuted(),
    isAvailable: () => soundEffects.isAvailable(),
    startAmbient: () => soundEffects.startAmbientSound(),
    stopAmbient: () => soundEffects.stopAmbientSound(),
  };
};

/**
 * Integration instructions for useTerminalEffects hook:
 * 
 * 1. Import the sound integration:
 *    import { createSoundIntegration, SoundIntegration, SoundProfile } from '../utils/soundEffects';
 * 
 * 2. Add sound integration to the hook state:
 *    const [soundIntegration] = useState<SoundIntegration>(() => 
 *      createSoundIntegration({ 
 *        volume: 0.7, 
 *        profile: 'retro',
 *        respectsPreferences: true 
 *      })
 *    );
 * 
 * 3. Update the EffectSettings interface to include sound settings:
 *    export interface EffectSettings {
 *      intensity: 'low' | 'medium' | 'high';
 *      speed: 'slow' | 'normal' | 'fast';
 *      soundEnabled: boolean;
 *      soundVolume: number;        // Add this (0.0 to 1.0)
 *      soundProfile: SoundProfile; // Add this ('retro' | 'modern' | 'minimal')
 *      accessibilityMode: boolean;
 *    }
 * 
 * 4. Update default settings:
 *    const defaultSettings: EffectSettings = {
 *      intensity: 'medium',
 *      speed: 'normal',
 *      soundEnabled: true,
 *      soundVolume: 0.7,     // Add this
 *      soundProfile: 'retro', // Add this
 *      accessibilityMode: false,
 *    };
 * 
 * 5. Add sound-related methods to the return object:
 *    return {
 *      effects,
 *      settings,
 *      // ... existing methods
 *      soundIntegration,
 *      playSoundEffect: (type: SoundType) => {
 *        if (settings.soundEnabled && !settings.accessibilityMode) {
 *          switch(type) {
 *            case 'keystroke': return soundIntegration.playKeystroke();
 *            case 'command': return soundIntegration.playCommandExecute();
 *            case 'error': return soundIntegration.playError();
 *            case 'boot': return soundIntegration.playBootSequence();
 *            case 'matrix': return soundIntegration.playMatrixMode();
 *            case 'notification': return soundIntegration.playNotification();
 *          }
 *        }
 *      },
 *      setSoundVolume: (volume: number) => {
 *        soundIntegration.setVolume(volume);
 *        setSettings(prev => ({ ...prev, soundVolume: volume }));
 *      },
 *      toggleSoundMute: () => {
 *        return soundIntegration.toggleMute();
 *      },
 *      setSoundProfile: (profile: SoundProfile) => {
 *        soundIntegration.setProfile(profile);
 *        setSettings(prev => ({ ...prev, soundProfile: profile }));
 *      },
 *      setSoundEnabled: (enabled: boolean) => {
 *        setSettings(prev => ({ ...prev, soundEnabled: enabled }));
 *      }
 *    };
 * 
 * 6. Integration with terminal events:
 *    - Call playSoundEffect('keystroke') on each key press in handleKeyDown
 *    - Call playSoundEffect('command') on command execution in executeCommand
 *    - Call playSoundEffect('error') when displaying error output
 *    - Call playSoundEffect('boot') during boot sequence in triggerBootSequence
 *    - Call playSoundEffect('matrix') when matrix effect is active
 *    - Call playSoundEffect('notification') for system notifications
 * 
 * 7. Example integration in Terminal component:
 *    const { playSoundEffect, settings } = useTerminalEffects();
 *    
 *    // In handleKeyDown:
 *    const handleKeyDown = (e: React.KeyboardEvent) => {
 *      if (settings.soundEnabled) {
 *        playSoundEffect('keystroke');
 *      }
 *      // ... rest of key handling
 *    };
 *    
 *    // In executeCommand:
 *    const executeCommand = async (input: string) => {
 *      if (settings.soundEnabled) {
 *        if (output.type === 'error') {
 *          playSoundEffect('error');
 *        } else {
 *          playSoundEffect('command');
 *        }
 *      }
 *      // ... rest of command execution
 *    };
 */
export default SoundEffects;