import React, { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { HomeNameAnimation } from './HomeNameAnimation'

/* ---------- GLSL Shader Material ---------- */
const GradientMaterial = shaderMaterial(
  { uTime: 0, uPage: 0, uResolution: new THREE.Vector2() },
  /* vertex */
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  /* fragment */
  /* glsl */ `
    #define PI 3.1415926538
    uniform float uTime;
    uniform vec2  uResolution;
    varying vec2  vUv;

    void main() {
      vec2 st = vUv;
      st = vec2(tan(st.x), sin(st.y));

      st.x += (sin(uTime/2.1)+2.0)*0.12*sin(sin(st.y*st.x+uTime/6.0)*8.2);
      st.y -= (cos(uTime/1.73)+2.0)*0.12*cos(st.x*st.y*5.1-uTime/4.0);

      vec3 c1 = vec3(1.0, 0.235, 0.525);   // hot pink
      vec3 c2 = vec3(0.0, 1.0, 0.6);       // neon green
      vec3 c3 = vec3(0.0, 0.82, 1.0);      // cyan
      vec3 bg = vec3(0.02);

      float m = smoothstep(0.0, 0.8, distance(st, vec2(sin(uTime/5.0)+0.5, sin(uTime/6.1)+0.5)));
      vec3 col = mix(c1, bg, m);

      m = smoothstep(0.1, 0.9, distance(st, vec2(sin(uTime/3.94)+0.7, sin(uTime/4.2)-0.1)));
      col = mix(c2, col, m);

      m = smoothstep(0.1, 0.8, distance(st, vec2(sin(uTime/3.43)+0.2, sin(uTime/3.2)+0.45)));
      col = mix(c3, col, m);

      gl_FragColor = vec4(col, 1.0);
    }
  `
)

/* ---------- Animated Gradient Component ---------- */
const AnimatedGradient = () => {
  const mat = useRef<THREE.ShaderMaterial>(null!)
  const { size } = useThree()
  
  useFrame(({ clock }) => {
    if (mat.current) {
      mat.current.uniforms.uTime.value = clock.elapsedTime
      mat.current.uniforms.uResolution.value.set(size.width, size.height)
    }
  })
  
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      {/* @ts-ignore */}
      <gradientMaterial ref={mat} />
    </mesh>
  )
}

/* ---------- Main Hero Component ---------- */
export default function Hero() {
  return (
    <section className="relative isolate h-screen w-full overflow-hidden">
      {/* WebGL animated background */}
      <Canvas
        className="absolute inset-0"
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
        style={{ userSelect: 'none' }}
      >
        <AnimatedGradient />
      </Canvas>

      {/* Fallback static image for reduced motion */}
      <img
        src="/images/hero-background.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover motion-reduce:block hidden"
      />

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-neutral-900/80" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center">
        
        {/* Character figure - placeholder for now */}
        <div className="w-64 md:w-80 lg:w-96 mb-8 motion-safe:animate-float">
          {/* Placeholder for character figure */}
          <div className="w-full aspect-square bg-white/10 rounded-full border-2 border-white/20 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white/60 text-sm">Character figure placeholder</span>
          </div>
        </div>

        {/* Multilingual name animation with minimal styling */}
        <div className="bg-neutral-900/40 px-6 py-4 rounded-lg backdrop-blur-sm">
          <HomeNameAnimation />
        </div>

        {/* Tagline with limited text hierarchy */}
        <p className="mt-6 max-w-prose text-lg font-normal text-neutral-200">
          A creative space showcasing my journey through design, development, 
          and the intersection of art and technology.
        </p>

        {/* CTA Button with primary color */}
        <button className="mt-8 rounded-full bg-primary px-8 py-3 text-white font-bold shadow-lg shadow-black/20 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent">
          Get in touch
        </button>
      </div>

      {/* Optional subtle grain overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay bg-noise"></div>
    </section>
  )
} 