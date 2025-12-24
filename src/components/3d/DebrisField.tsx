'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Instanced Mesh for performance
const COUNT = 100;

type DebrisFieldProps = {
    playerPos: THREE.Vector3;
    onCollision: () => void;
};

const DebrisField = ({ playerPos, onCollision }: DebrisFieldProps) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);

    // Generate random data for instances
    const { positions, rotations, scales } = useMemo(() => {
        const p = new Float32Array(COUNT * 3);
        const r = new Float32Array(COUNT * 3);
        const s = new Float32Array(COUNT * 3);

        for (let i = 0; i < COUNT; i++) {
            // Spread wide
            p[i * 3] = (Math.random() - 0.5) * 400;     // X
            p[i * 3 + 1] = (Math.random() - 0.5) * 50;  // Y
            p[i * 3 + 2] = (Math.random() - 0.5) * 400 - 100; // Z

            r[i * 3] = Math.random() * Math.PI;
            r[i * 3 + 1] = Math.random() * Math.PI;
            r[i * 3 + 2] = Math.random() * Math.PI;

            const scale = 0.5 + Math.random() * 2;
            s[i * 3] = scale;
            s[i * 3 + 1] = scale;
            s[i * 3 + 2] = scale;
        }
        return { positions: p, rotations: r, scales: s };
    }, []);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // We can't easily check collision for ALL 100 instances every frame in JS 
        // without some optimization. 
        // Optimization: Only check if player > Z - something. 
        // Or just check distance to EACH logic. 
        // Let's do a simple loop since COUNT=100 is small.

        // Animate rotation (optional, tricky with InstancedMesh in loop)
        // For static debris, it's fine.

        // Collision Check
        const dummy = new THREE.Object3D();
        for (let i = 0; i < COUNT; i++) {
            const debrisPos = new THREE.Vector3(
                positions[i * 3],
                positions[i * 3 + 1],
                positions[i * 3 + 2]
            );

            const dist = debrisPos.distanceTo(playerPos);
            const scale = scales[i * 3];

            if (dist < scale + 1.5) { // Radius + Ship Radius
                // HIT
                onCollision();
                // Maybe hide this debris? Hard with instanced.
                // Just triggering damage is enough for now.
            }
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#555555" roughness={0.8} />

            {/* Set transforms once */}
            {/* We need to do this in useLayoutEffect or just loop here if safe */}
            {useMemo(() => {
                if (!meshRef.current) return null;
                const temp = new THREE.Object3D();
                for (let i = 0; i < COUNT; i++) {
                    temp.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
                    temp.rotation.set(rotations[i * 3], rotations[i * 3 + 1], rotations[i * 3 + 2]);
                    temp.scale.set(scales[i * 3], scales[i * 3 + 1], scales[i * 3 + 2]);
                    temp.updateMatrix();
                    meshRef.current.setMatrixAt(i, temp.matrix);
                }
                meshRef.current.instanceMatrix.needsUpdate = true;
            }, [positions, rotations, scales]) as any}
        </instancedMesh>
    );
};

export default DebrisField;
