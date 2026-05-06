import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars, Box, Torus, Cylinder, Line } from '@react-three/drei';
import { useScroll } from 'framer-motion';

const PALETTE = {
  indigo: '#4f46e5',
  magenta: '#c45ad8',
  sky: '#0ea5e9',
  deepViolet: '#a21caf',
  slate: '#475569',
};

const DigitalMarketingScene = ({ scrollYProgress }) => {
  const funnelRef = useRef();
  const audienceRef = useRef();
  const chartRef = useRef();
  const pulseRef = useRef();
  const chartLineRef = useRef();
  const haloRef = useRef();

  const audienceNodes = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      return {
        position: [Math.cos(angle) * 4.4, Math.sin(angle * 1.4) * 0.95, Math.sin(angle) * 2.2],
        radius: i % 4 === 0 ? 0.16 : 0.1,
        color: i % 3 === 0 ? PALETTE.indigo : i % 3 === 1 ? PALETTE.magenta : PALETTE.sky,
      };
    });
  }, []);

  const trendPoints = useMemo(
    () => [
      [-4.8, -1.9, 0.3],
      [-3.3, -1.2, 0.7],
      [-2.2, -1.0, 1.0],
      [-1.0, -0.3, 1.2],
      [0.3, 0.1, 1.1],
      [1.6, 0.8, 0.8],
      [2.6, 1.2, 0.3],
      [3.9, 1.8, -0.1],
    ],
    [],
  );

  const connectionLines = useMemo(
    () => [
      [
        [-4.4, -0.2, -1.6],
        [-2.4, 0.35, -2.0],
      ],
      [
        [-2.2, 0.7, -1.5],
        [0.1, 1.1, -2.6],
      ],
      [
        [0.4, 1.0, -1.7],
        [2.2, 0.4, -2.2],
      ],
      [
        [2.3, -0.1, -1.4],
        [4.2, -0.8, -1.8],
      ],
    ],
    [],
  );

  useFrame(() => {
    const progress = scrollYProgress.get();
    const t = performance.now() * 0.0002;

    if (funnelRef.current) {
      funnelRef.current.rotation.y = progress * Math.PI * 1.0 + t * 0.45;
      funnelRef.current.position.y = -0.9 + progress * 2.0;
      const scale = 1 - progress * 0.14;
      funnelRef.current.scale.set(scale, scale, scale);
    }

    if (audienceRef.current) {
      audienceRef.current.rotation.y = -progress * Math.PI * 1.3 + t * 0.32;
      audienceRef.current.rotation.x = Math.sin(t * 1.2) * 0.06;
      audienceRef.current.position.y = Math.sin(t * 1.35) * 0.14;
    }

    if (chartRef.current) {
      chartRef.current.position.y = -3.7 + progress * 2.8;
      chartRef.current.rotation.y = 0.22 + progress * 0.3;
    }

    if (pulseRef.current) {
      const pulse = 1 + Math.sin(t * 2.1 + progress * 2.5) * 0.035;
      pulseRef.current.scale.set(pulse, pulse, pulse);
      pulseRef.current.rotation.z = t * 0.25;
    }

    if (chartLineRef.current) {
      chartLineRef.current.material.opacity = 0.24 + progress * 0.42;
    }

    if (haloRef.current) {
      haloRef.current.rotation.y = t * 0.22;
      haloRef.current.rotation.x = Math.sin(t * 1.1) * 0.08;
    }
  });

  return (
    <group>
      <group ref={pulseRef} position={[0.5, 0.6, -4.4]}>
        <Torus args={[3.8, 0.05, 12, 90]}>
          <meshBasicMaterial color={PALETTE.magenta} transparent opacity={0.2} />
        </Torus>
        <Torus args={[4.6, 0.03, 12, 90]}>
          <meshBasicMaterial color={PALETTE.sky} transparent opacity={0.14} />
        </Torus>
      </group>

      <group ref={haloRef} position={[0.3, -0.2, -4.8]}>
        <Torus args={[5.3, 0.02, 12, 120]}>
          <meshBasicMaterial color={PALETTE.indigo} transparent opacity={0.1} />
        </Torus>
      </group>

      <group ref={funnelRef} position={[0, -0.5, -3]}>
        <Cylinder args={[2.4, 3.3, 0.8, 42, 1, true]}>
          <meshBasicMaterial color={PALETTE.indigo} wireframe transparent opacity={0.22} />
        </Cylinder>
        <Cylinder args={[1.5, 2.4, 0.8, 42, 1, true]} position={[0, -0.9, 0]}>
          <meshBasicMaterial color={PALETTE.magenta} wireframe transparent opacity={0.2} />
        </Cylinder>
        <Cylinder args={[0.75, 1.5, 1.0, 42, 1, true]} position={[0, -1.85, 0]}>
          <meshBasicMaterial color={PALETTE.sky} wireframe transparent opacity={0.2} />
        </Cylinder>
        <Sphere args={[0.32, 20, 20]} position={[0, -2.5, 0]}>
          <meshBasicMaterial color={PALETTE.deepViolet} transparent opacity={0.88} />
        </Sphere>
      </group>

      <group ref={audienceRef} position={[0, 0.5, -3.4]}>
        {audienceNodes.map((node, i) => (
          <Sphere key={i} args={[node.radius, 16, 16]} position={node.position}>
            <meshBasicMaterial color={node.color} transparent opacity={0.9} />
          </Sphere>
        ))}

        {connectionLines.map((points, i) => (
          <Line
            key={`link-${i}`}
            points={points}
            color={PALETTE.indigo}
            lineWidth={1}
            transparent
            opacity={0.24}
          />
        ))}
      </group>

      <group ref={chartRef} position={[0, -4, -1.8]}>
        {[0.9, 1.2, 1.8, 2.6, 3.2, 3.9].map((height, i) => {
          const color = i < 2 ? PALETTE.indigo : i < 4 ? PALETTE.magenta : PALETTE.sky;
          return (
            <Box key={i} args={[0.45, height, 0.45]} position={[-4.4 + i * 1.65, -1.4 + height / 2, 1.25]}>
              <meshBasicMaterial color={color} transparent opacity={0.24} />
            </Box>
          );
        })}

        <Line
          ref={chartLineRef}
          points={trendPoints}
          color={PALETTE.sky}
          lineWidth={2.2}
          transparent
          opacity={0.32}
        />

        {trendPoints.map((point, i) => (
          <Sphere key={`point-${i}`} args={[0.12, 16, 16]} position={point}>
            <meshBasicMaterial color={PALETTE.sky} transparent opacity={0.85} />
          </Sphere>
        ))}

        <Box args={[1.8, 0.85, 0.24]} position={[4.8, 2.25, -0.2]}>
          <meshBasicMaterial color={PALETTE.deepViolet} transparent opacity={0.16} />
        </Box>
        <Box args={[1.4, 0.64, 0.24]} position={[4.8, 1.2, -0.2]}>
          <meshBasicMaterial color={PALETTE.indigo} transparent opacity={0.16} />
        </Box>
      </group>

      {[[-5.7, 1.8, -4], [5.9, -1.6, -3.8], [-6.2, -2.4, -3.1], [6.4, 2.3, -4.2]].map((position, i) => (
        <Sphere key={`ambient-${i}`} args={[0.22, 16, 16]} position={position}>
          <meshBasicMaterial color={i % 2 === 0 ? PALETTE.magenta : PALETTE.sky} transparent opacity={0.3} />
        </Sphere>
      ))}
    </group>
  );
};

const AnimatedBackground3D = () => {
  const { scrollYProgress } = useScroll();

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 11], fov: 46 }}>
        <color attach="background" args={['#f7f7ff']} />
        <fog attach="fog" args={['#f7f7ff', 8, 30]} />
        <ambientLight intensity={0.55} color="#ffffff" />
        <pointLight intensity={1.0} position={[8, 5, 8]} color="#8a84f0" />
        <pointLight intensity={0.75} position={[-7, -4, 6]} color="#d79be3" />
        <pointLight intensity={0.5} position={[0, 7, -4]} color="#7bc8f3" />
        <DigitalMarketingScene scrollYProgress={scrollYProgress} />
        <Stars radius={18} depth={42} count={520} factor={2.1} saturation={0.82} fade speed={0.14} />
      </Canvas>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(circle at 14% 20%, rgba(79,70,229,0.13) 0%, rgba(255,255,255,0.04) 42%), radial-gradient(circle at 78% 74%, rgba(196,90,216,0.08) 0%, rgba(255,255,255,0.04) 46%), linear-gradient(180deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.91) 100%)',
          zIndex: -1,
        }}
      />
    </div>
  );
};

export default AnimatedBackground3D;
