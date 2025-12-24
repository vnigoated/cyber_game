'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import InfiniteGrid from './InfiniteGrid';
import PlayerShip from './PlayerShip';

const GameScene = () => {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 2, 5]} />
            
            {/* Environment */}
            <color attach="background" args={['#000500']} />
            <fog attach="fog" args={['#000500', 5, 30]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#00ff00" />
            
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <InfiniteGrid />
            <PlayerShip />
        </>
    );
};

export default GameScene;
