import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Plane, shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'
import { useGradient } from '../contexts/GradientContext'

// Custom shader material for dynamic gradients
const GradientMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(1, 1),
    primary: new THREE.Color(),
    secondary: new THREE.Color(),
    accent: new THREE.Color(),
    background: new THREE.Color(),
    intensity: 1.0,
    speed: 1.0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec2 resolution;
    uniform vec3 primary;
    uniform vec3 secondary;
    uniform vec3 accent;
    uniform vec3 background;
    uniform float intensity;
    uniform float speed;
    
    varying vec2 vUv;
    
    // Noise function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    
    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      
      vec2 u = f * f * (3.0 - 2.0 * f);
      
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    
    void main() {
      vec2 st = vUv;
      
      // Create flowing gradients
      float t = time * speed * 0.1;
      
      // Multiple gradient layers
      vec2 pos1 = st + vec2(sin(t * 0.8) * 0.3, cos(t * 0.6) * 0.2);
      vec2 pos2 = st + vec2(cos(t * 1.2) * 0.2, sin(t * 0.9) * 0.3);
      vec2 pos3 = st + vec2(sin(t * 1.5) * 0.1, cos(t * 1.1) * 0.1);
      
      // Noise-based color mixing
      float n1 = noise(pos1 * 3.0 + t);
      float n2 = noise(pos2 * 2.0 + t * 1.3);
      float n3 = noise(pos3 * 4.0 + t * 0.7);
      
      // Radial gradient from center
      float dist = distance(st, vec2(0.5));
      float radial = 1.0 - smoothstep(0.0, 0.8, dist);
      
      // Blend colors based on noise and position
      vec3 color1 = mix(primary, secondary, n1);
      vec3 color2 = mix(secondary, accent, n2);
      vec3 color3 = mix(accent, background, n3);
      
      // Final color mixing
      vec3 finalColor = mix(
        mix(color1, color2, st.x + n2 * 0.3),
        color3,
        st.y + n3 * 0.2
      );
      
      // Apply radial gradient and intensity
      finalColor = mix(background, finalColor, radial * intensity);
      
      // Add subtle shimmer
      float shimmer = sin(t * 3.0 + st.x * 10.0 + st.y * 8.0) * 0.05 + 0.95;
      finalColor *= shimmer;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
)

// Extend the material to make it available in JSX
extend({ GradientMaterial })

// Declare the extended material for TypeScript
declare module '@react-three/fiber' {
  interface ThreeElements {
    gradientMaterial: any
  }
}

interface GradientPlaneProps {
  primary: string
  secondary: string
  accent: string
  background: string
  intensity: number
  speed: number
  time: number
}

const GradientPlane: React.FC<GradientPlaneProps> = ({
  primary,
  secondary,
  accent,
  background,
  intensity,
  speed,
  time
}) => {
  const materialRef = useRef<any>()

  const colors = useMemo(() => ({
    primary: new THREE.Color(primary),
    secondary: new THREE.Color(secondary),
    accent: new THREE.Color(accent),
    background: new THREE.Color(background),
  }), [primary, secondary, accent, background])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = time
      materialRef.current.primary = colors.primary
      materialRef.current.secondary = colors.secondary
      materialRef.current.accent = colors.accent
      materialRef.current.background = colors.background
      materialRef.current.intensity = intensity
      materialRef.current.speed = speed
      materialRef.current.resolution.set(state.size.width, state.size.height)
    }
  })

  return (
    <Plane args={[2, 2]} position={[0, 0, -1]}>
      <gradientMaterial
        ref={materialRef}
        key={`${primary}-${secondary}-${accent}-${background}`}
      />
    </Plane>
  )
}

interface GradientBackgroundProps {
  className?: string
  opacity?: number
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ 
  className = '',
  opacity = 1 
}) => {
  const { 
    primaryColor, 
    secondaryColor, 
    accentColor, 
    backgroundColor,
    gradientConfig,
    time,
    isAnimated
  } = useGradient()

  return (
    <div 
      className={`fixed inset-0 -z-10 ${className}`}
      style={{ opacity }}
    >
      <Canvas
        camera={{ position: [0, 0, 1], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
        dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
      >
        <GradientPlane
          primary={primaryColor}
          secondary={secondaryColor}
          accent={accentColor}
          background={backgroundColor}
          intensity={gradientConfig.intensity}
          speed={isAnimated ? gradientConfig.speed : 0}
          time={time}
        />
      </Canvas>
    </div>
  )
} 