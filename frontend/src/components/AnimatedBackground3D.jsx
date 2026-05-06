import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars, Box, Torus } from '@react-three/drei';
import { useScroll } from 'framer-motion';
import * as THREE from 'three';

const DigitalMarketingScene = ({ scrollYProgress }) => {
  const globeRef = useRef();
  const barsRef = useRef();
  const ringsRef = useRef();

  useFrame(() => {
    // get normalized scroll from 0 to 1 (0 is top, 1 is bottom)
    const progress = scrollYProgress.get();

    if (globeRef.current) {
      // Scrubbing: Globe rotates based exactly on scroll
      globeRef.current.rotation.y = progress * Math.PI * 4;
      // Globe scales down and moves up as you scroll down
      const scale = 1 - progress * 0.4;
      globeRef.current.scale.set(scale, scale, scale);
      globeRef.current.position.y = progress * 5;
    }

    if (barsRef.current) {
      // Scrubbing: Bars rise up smoothly from the bottom
      barsRef.current.position.y = -6 + progress * 8;
      // Bars rotate slowly around the scene
      barsRef.current.rotation.y = progress * Math.PI * 1.5;
    }

    if (ringsRef.current) {
      // Scrubbing: Target rings spin and tilt to face the user
      ringsRef.current.rotation.x = Math.PI / 2 + progress * Math.PI * 0.5;
      ringsRef.current.rotation.z = progress * Math.PI * 2;
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
          <meshBasicMaterial color="#4f46e5" wireframe transparent opacity={0.25} />
        </Sphere>
        <Sphere args={[2.48, 32, 32]}>
          <meshBasicMaterial color="#0f172a" transparent opacity={0.05} />
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
                <meshBasicMaterial color={color} transparent opacity={0.15} />
                <lineSegments>
                  <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.6, height, 0.6)]} />
                  <lineBasicMaterial attach="material" color={color} transparent opacity={0.5} />
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
  // useScroll hook automatically tracks the window scroll progress
  const { scrollYProgress } = useScroll();

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <fog attach="fog" args={['#f8fafc', 8, 25]} />
        <DigitalMarketingScene scrollYProgress={scrollYProgress} />
        {/* Subtle dark stars to be visible on light background */}
        <Stars radius={15} depth={50} count={1000} factor={4} saturation={1} fade speed={0.5} />
      </Canvas>
      {/* Light gradient overlay to ensure text readability */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.95) 100%)', zIndex: -1 }}></div>
    </div>
  );
};

export default AnimatedBackground3D;
