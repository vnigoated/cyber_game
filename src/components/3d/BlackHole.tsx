'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

type BlackHoleProps = {
    position: [number, number, number];
    playerPos: THREE.Vector3;
    onSuckedIn: () => void;
};

const BlackHole = ({ position, playerPos, onSuckedIn }: BlackHoleProps) => {
    const group = useRef<THREE.Group>(null);
    const GRAVITY_RANGE = 25;
    const KILL_RADIUS = 3;

    useFrame((state, delta) => {
        if (!group.current) return;

        // Spin accretion disk
        group.current.rotation.y += delta * 0.5;

        // Check distance
        const holePos = new THREE.Vector3(position[0], position[1], position[2]);
        const dist = holePos.distanceTo(playerPos);

        if (dist < GRAVITY_RANGE) {
            // Apply Gravity Pull
            // We can't modify playerPos directly here since it's just a prop value from state.
            // But we can trigger an effect? 
            // In a real physics engine, we'd apply force.
            // Here, we can perhaps just have the visual effect or kill triggering.
            // Applying force requires callback to update velocity.
            // For now, let's just do the KILL check. Gravity simulation needs Ref access or onUpdate callback.
        }

        if (dist < KILL_RADIUS) {
            onSuckedIn();
        }
    });

    return (
        <group ref={group} position={position}>
            {/* Dark Sphere (Event Horizon) */}
            <mesh>
                <sphereGeometry args={[2, 32, 32]} />
                <meshBasicMaterial color="black" />
            </mesh>

            {/* Accretion Disk */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[2.2, 6, 64]} />
                <meshBasicMaterial
                    color="#ff4400"
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.8}
                />
            </mesh>
            {/* Outer Glow */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[6, 9, 64]} />
                <meshBasicMaterial
                    color="#aa0000"
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.2}
                />
            </mesh>
        </group>
    );
};

export default BlackHole;
