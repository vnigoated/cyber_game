'use client';

import { Stars, Cloud, Float } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

const SpaceEnvironment = () => {
    return (
        <group>
            {/* Deep Starfield */}
            <Stars radius={200} depth={100} count={8000} factor={6} saturation={0.5} fade speed={0.5} />

            {/* Nebulas (using Clouds for procedural look) */}
            <group position={[0, -20, -100]}>
                <Cloud opacity={0.3} color="#4400ff" bounds={[50, 5, 50]} />
            </group>
            <group position={[40, 10, -150]}>
                <Cloud opacity={0.2} color="#ff00aa" bounds={[40, 5, 40]} />
            </group>

            {/* Distant Planet 1 */}
            <Float speed={0.2} rotationIntensity={0.1} floatIntensity={0.1}>
                <mesh position={[-80, 40, -200]}>
                    <sphereGeometry args={[30, 64, 64]} />
                    <meshStandardMaterial
                        color="#201040"
                        emissive="#100520"
                        roughness={0.8}
                    />
                </mesh>
                {/* Ring */}
                <mesh position={[-80, 40, -200]} rotation={[0.5, 0, 0.2]}>
                    <ringGeometry args={[40, 55, 64]} />
                    <meshBasicMaterial color="#6644aa" transparent opacity={0.3} side={THREE.DoubleSide} />
                </mesh>
            </Float>

            {/* Distant Planet 2 (Sun-like) */}
            <mesh position={[100, -20, -300]}>
                <sphereGeometry args={[50, 64, 64]} />
                <meshBasicMaterial color="#ffaa00" />
            </mesh>

            <ambientLight intensity={0.2} />
            <directionalLight position={[100, 50, 100]} intensity={0.5} color="#4422ff" />
        </group>
    );
};

export default SpaceEnvironment;
