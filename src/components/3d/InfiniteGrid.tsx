'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const InfiniteGrid = () => {
  const grid1 = useRef<THREE.Group>(null);
  const grid2 = useRef<THREE.Group>(null);
  const speed = 20;

  useFrame((state: any, delta: number) => {
    if (!grid1.current || !grid2.current) return;

    // Move grids towards camera
    grid1.current.position.z += speed * delta;
    grid2.current.position.z += speed * delta;

    // Reset position when out of view (Looping logic)
    if (grid1.current.position.z > 50) {
      grid1.current.position.z = -150;
    }
    if (grid2.current.position.z > 50) {
      grid2.current.position.z = -150;
    }
  });

  return (
    <group>
      <group ref={grid1} position={[0, -2, 0]}>
        <gridHelper args={[100, 50, 0x00ff00, 0x003300]} position={[0, 0, 0]} />
        <gridHelper args={[100, 50, 0x00ff00, 0x003300]} position={[0, 0, -100]} />
      </group>
      <group ref={grid2} position={[0, -2, -200]}>
        <gridHelper args={[100, 50, 0x00ff00, 0x003300]} position={[0, 0, 0]} />
        <gridHelper args={[100, 50, 0x00ff00, 0x003300]} position={[0, 0, -100]} />
      </group>
    </group>
  );
};

export default InfiniteGrid;
