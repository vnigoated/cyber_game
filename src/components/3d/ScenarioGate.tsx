'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import * as THREE from 'three';

type ScenarioGateProps = {
    position: [number, number, number];
    type: 'Firewall' | 'Phishing' | 'Glitch';
    title: string;
    isCompleted: boolean;
    onEnter: () => void;
    playerPos: THREE.Vector3;
};

const ScenarioGate = ({ position, type, title, isCompleted, onEnter, playerPos }: ScenarioGateProps) => {
    const group = useRef<THREE.Group>(null);

    // Random rotation speed for the asteroid
    const rotSpeed = useMemo(() => ({
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5
    }), []);

    const TRIGGER_DISTANCE = 3.5; // Slightly larger for asteroids

    useFrame((state, delta) => {
        if (!group.current) return;

        // Tumble
        group.current.rotation.x += rotSpeed.x * delta;
        group.current.rotation.y += rotSpeed.y * delta;

        // Check distance
        const gatePos = new THREE.Vector3(position[0], position[1], position[2]);
        const dist = gatePos.distanceTo(playerPos);

        if (dist < TRIGGER_DISTANCE && !isCompleted) {
            onEnter();
        }
    });

    const color = useMemo(() => {
        if (isCompleted) return '#444444';
        switch (type) {
            case 'Firewall': return '#ff4444';
            case 'Phishing': return '#ffaa00';
            default: return '#00ffcc';
        }
    }, [type, isCompleted]);

    return (
        <group position={position}>
            <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
                <group ref={group}>
                    {/* Rock Geomerty */}
                    <mesh castShadow receiveShadow>
                        <dodecahedronGeometry args={[1.5, 0]} />
                        <meshStandardMaterial
                            color={isCompleted ? "#333" : "#665544"}
                            roughness={0.9}
                            metalness={0.1}
                            flatShading
                        />
                    </mesh>

                    {/* Tech "Ore" / Crystal Implant - The colored part */}
                    {!isCompleted && (
                        <mesh position={[0.8, 0.5, 0.5]}>
                            <icosahedronGeometry args={[0.5, 0]} />
                            <meshStandardMaterial
                                color={color}
                                emissive={color}
                                emissiveIntensity={2}
                                toneMapped={false}
                            />
                        </mesh>
                    )}
                </group>

                {/* HUD Label */}
                <Html position={[0, 2.5, 0]} center distanceFactor={12}>
                    <div className={`
                flex flex-col items-center
                ${isCompleted ? 'opacity-50' : 'opacity-100'}
            `}>
                        <div className={`
                    px-3 py-1 rounded-full border border-white/20 backdrop-blur-md 
                    ${isCompleted ? 'bg-gray-900/50 text-gray-500' : 'bg-black/60 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]'}
                    font-mono text-xs whitespace-nowrap select-none pointer-events-none transition-all
                `}>
                            {isCompleted ? 'MINED' : `⚠️ ${type.toUpperCase()}`}
                        </div>
                        {!isCompleted && <div className="text-[10px] text-primary bg-black/80 px-2 py-0.5 rounded mt-1">{title}</div>}
                    </div>
                </Html>
            </Float>
        </group>
    );
};

export default ScenarioGate;
