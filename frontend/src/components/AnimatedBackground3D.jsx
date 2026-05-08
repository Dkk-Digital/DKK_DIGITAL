import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars, Box, Torus } from '@react-three/drei';
import { useScroll, useSpring } from 'framer-motion';
import { useTheme } from '@mui/material';
import * as THREE from 'three';

const DigitalMarketingScene = ({ smoothScrollY, isDark }) => {
  const globeRef = useRef();
  const barsRef = useRef();
  const ringsRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // get normalized scroll from 0 to 1 (0 is top, 1 is bottom)
    const progress = smoothScrollY.get();

    if (globeRef.current) {
      // Smooth continuous rotation + scrubbed rotation
      globeRef.current.rotation.y = time * 0.15 + progress * Math.PI * 4;
      // Globe scales down and moves up as you scroll down
      const scale = 1 - progress * 0.4;
      globeRef.current.scale.set(scale, scale, scale);
      globeRef.current.position.y = progress * 5;
    }

    if (barsRef.current) {
      // Scrubbing: Bars rise up smoothly from the bottom
      barsRef.current.position.y = -6 + progress * 8;
      // Bars rotate slowly around the scene
      barsRef.current.rotation.y = time * 0.05 + progress * Math.PI * 1.5;
    }

    if (ringsRef.current) {
      // Scrubbing: Target rings spin and tilt to face the user
      ringsRef.current.rotation.x = Math.PI / 2 + progress * Math.PI * 0.5;
      ringsRef.current.rotation.z = time * 0.1 + progress * Math.PI * 2;
      ringsRef.current.position.z = -5 + progress * 4;
    }
  });

  return (
    <group>
      {/* Target Rings (SEO/Targeting Concept) */}
      <group ref={ringsRef} position={[0, 0, -5]}>
        <Torus args={[4, 0.02, 16, 100]}>
          <meshBasicMaterial color="#d946ef" transparent opacity={0.3} />
        </Torus>
        <Torus args={[5, 0.02, 16, 100]}>
          <meshBasicMaterial color="#4f46e5" transparent opacity={0.2} />
        </Torus>
        <Torus args={[6, 0.05, 16, 100]}>
          <meshBasicMaterial color="#0ea5e9" wireframe transparent opacity={0.2} />
        </Torus>
      </group>

      {/* Global Network (Connectivity/Reach Concept) */}
      <group ref={globeRef} position={[0, 0, -2]}>
        <Sphere args={[2.5, 24, 24]}>
          <meshBasicMaterial color="#4f46e5" wireframe transparent opacity={isDark ? 0.35 : 0.15} />
        </Sphere>
        <Sphere args={[2.48, 32, 32]}>
          <meshBasicMaterial color={isDark ? "#050811" : "#f8fafc"} transparent opacity={0.8} />
        </Sphere>
      </group>

      {/* Growth Chart Bars (Analytics/Growth Concept) */}
      <group ref={barsRef} position={[0, -6, -3]}>
        {[...Array(10)].map((_, i) => {
          const height = 1 + i * 0.8;
          const x = -4.5 + i * 1;
          const color = i % 3 === 0 ? "#4f46e5" : i % 3 === 1 ? "#d946ef" : "#0ea5e9";
          return (
            <group key={i} position={[x, height / 2, Math.sin(i * 2) * 2]}>
              <Box args={[0.6, height, 0.6]}>
                <meshBasicMaterial color={color} transparent opacity={isDark ? 0.2 : 0.1} />
                <lineSegments>
                  <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.6, height, 0.6)]} />
                  <lineBasicMaterial attach="material" color={color} transparent opacity={isDark ? 0.6 : 0.3} />
                </lineSegments>
              </Box>
              {/* Floating Data Node on top of bar */}
              <Sphere args={[0.15, 16, 16]} position={[0, height / 2 + 0.3, 0]}>
                 <meshBasicMaterial color={color} />
              </Sphere>
            </group>
          );
        })}
      </group>
    </group>
  );
};

const AnimatedBackground3D = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  // useScroll hook automatically tracks the window scroll progress
  const { scrollYProgress } = useScroll();
  
  // Smooth out the scroll progress for much smoother 3D animations
  const smoothScrollY = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <fog attach="fog" args={[isDark ? '#050811' : '#f8fafc', 8, 25]} />
        <DigitalMarketingScene smoothScrollY={smoothScrollY} isDark={isDark} />
        {/* Subtle stars to be visible based on background */}
        <Stars 
          radius={15} 
          depth={50} 
          count={isDark ? 1500 : 500} 
          factor={isDark ? 4 : 2} 
          saturation={1} 
          fade 
          speed={0.5} 
        />
      </Canvas>
      {/* Light gradient overlay to ensure text readability */}
      <div style={{ 
        position: 'absolute', 
        top: 0, left: 0, width: '100%', height: '100%', 
        background: isDark 
          ? 'linear-gradient(180deg, rgba(5,8,17,0.1) 0%, rgba(5,8,17,0.85) 100%)'
          : 'linear-gradient(180deg, rgba(248,250,252,0.4) 0%, rgba(248,250,252,0.95) 100%)', 
        zIndex: -1 
      }}></div>
    </div>
  );
};

export default AnimatedBackground3D;
