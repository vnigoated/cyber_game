'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type SpeedRingProps = {
    position: [number, number, number];
    onEnter: () => void;
    playerPos: THREE.Vector3;
};

const SpeedRing = ({ position, onEnter, playerPos }: SpeedRingProps) => {
    const group = useRef<THREE.Group>(null);
    const [active, setActive] = useState(true);

    useFrame((state, delta) => {
        if (!group.current || !active) return;

        // Rotate ring
        group.current.rotation.z -= delta * 2;

        // Check collision
        const ringPos = new THREE.Vector3(position[0], position[1], position[2]);
        if (ringPos.distanceTo(playerPos) < 2.5) {
            onEnter();
            setActive(false);
            // Maybe play sound or particle effect here?
        }
    });

    return (
        <group ref={group} position={position} scale={active ? 1 : 0}>
            {/* Outer Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2, 0.1, 16, 100]} />
                <meshBasicMaterial color="#00ffaa" transparent opacity={0.8} />
            </mesh>

            {/* Inner Glow/Forcefield */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[1.8, 32]} />
                <meshBasicMaterial
                    color="#00ffaa"
                    transparent
                    opacity={0.1}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Chevron Arrows indicating speed */}
            <group rotation={[0, 0, Math.PI / 2]}>
                <mesh position={[0, 1, 0]}>
                    <coneGeometry args={[0.2, 0.5, 3]} />
                    <meshBasicMaterial color="#ffffff" />
                </mesh>
                <mesh position={[0, -1, 0]} rotation={[0, 0, Math.PI]}>
                    <coneGeometry args={[0.2, 0.5, 3]} />
                    <meshBasicMaterial color="#ffffff" />
                </mesh>
            </group>
        </group>
    );
};

export default SpeedRing;
