'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type WarpGateProps = {
    position: [number, number, number];
};

const WarpGate = ({ position }: WarpGateProps) => {
    const ringRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (ringRef.current) {
            ringRef.current.rotation.z -= delta;
        }
    });

    return (
        <group position={position}>
            {/* Massive Outer Ring */}
            <mesh ref={ringRef}>
                <torusGeometry args={[10, 1, 16, 100]} />
                <meshStandardMaterial color="#444444" roughness={0.2} metalness={0.9} />
            </mesh>

            {/* Event Horizon / Water effect */}
            <mesh>
                <circleGeometry args={[9, 64]} />
                <meshBasicMaterial color="#0088ff" transparent opacity={0.4} side={THREE.DoubleSide} />
            </mesh>

            {/* Lights */}
            <pointLight position={[0, 0, 5]} intensity={2} color="#0088ff" distance={20} />
        </group>
    );
};

export default WarpGate;
