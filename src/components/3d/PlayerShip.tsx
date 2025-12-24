'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { Trail } from '@react-three/drei';
import * as THREE from 'three';

const PlayerShip = () => {
  const shipRef = useRef<THREE.Group>(null);
  const [targetX, setTargetX] = useState(0);

  // Lane logic: -3 (Left), 0 (Center), 3 (Right)
  const lanes = [-3, 0, 3];
  const [currentLaneIndex, setCurrentLaneIndex] = useState(1); // Start at Center

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setCurrentLaneIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setCurrentLaneIndex((prev) => Math.min(lanes.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useFrame((state: any, delta: number) => {
    if (!shipRef.current) return;

    // Smooth lerp to target lane
    const desiredX = lanes[currentLaneIndex];
    shipRef.current.position.x = THREE.MathUtils.lerp(shipRef.current.position.x, desiredX, delta * 10);

    // Tilt effect when moving
    const tilt = (shipRef.current.position.x - desiredX) * 0.5;
    shipRef.current.rotation.z = tilt;
  });

  return (
    <group ref={shipRef} position={[0, 0, 0]}>
      <Trail width={1} length={4} color={'#00ff00'} attenuation={(t: number) => t * t}>
        <mesh rotation={[0, 0, 0]}>
          <coneGeometry args={[0.5, 1.5, 3]} />
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={2} wireframe />
        </mesh>
      </Trail>
    </group>
  );
};

export default PlayerShip;
