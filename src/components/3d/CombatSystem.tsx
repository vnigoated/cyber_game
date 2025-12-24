'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

export type Enemy = {
    id: string;
    position: THREE.Vector3;
    heatlh: number;
};

type Laser = {
    id: string;
    position: THREE.Vector3;
    direction: THREE.Vector3;
    life: number; // Destroy after N seconds
};

type CombatSystemProps = {
    playerPos: THREE.Vector3;
    playerRot: THREE.Quaternion; // We need rotation to know where to shoot
    isFiring: boolean;
    onEnemyHit: () => void;
    onPlayerHit: () => void;

    enemies: Enemy[];
    setEnemies: React.Dispatch<React.SetStateAction<Enemy[]>>;
    weaponType: 'blaster' | 'spread' | 'missile';
    timeScale: number;
};

const SPAWN_RATE = 2000; // ms
const ENEMY_SPEED = 4;
const LASER_SPEED = 40;

const CombatSystem = ({ playerPos, playerRot, isFiring, onEnemyHit, onPlayerHit, enemies, setEnemies, weaponType = 'blaster', timeScale = 1 }: CombatSystemProps) => {
    // const [enemies, setEnemies] = useState<Enemy[]>([]); // Lifted up
    const [lasers, setLasers] = useState<Laser[]>([]);
    const lastFireTime = useRef(0);
    const lastSpawnTime = useRef(0);

    // Audio refs (placeholders to avoid errors if missing, but ideally we'd have sound)

    useFrame((state, delta) => {
        const now = state.clock.elapsedTime * 1000;

        const scaledDelta = delta * timeScale;

        // --- SPWAN ENEMIES ---
        if (now - lastSpawnTime.current > SPAWN_RATE / timeScale) {
            // Spawn random enemy around player
            const angle = Math.random() * Math.PI * 2;
            const dist = 30 + Math.random() * 20;
            const spawnPos = new THREE.Vector3(
                playerPos.x + Math.sin(angle) * dist,
                0, // Keep on same plane for simplicity, or vary Y
                playerPos.z + Math.cos(angle) * dist
            );

            setEnemies(prev => [...prev, {
                id: Math.random().toString(36),
                position: spawnPos,
                heatlh: 1
            }]);
            lastSpawnTime.current = now;
        }

        // --- FIRE LASERS ---
        if (isFiring && now - lastFireTime.current > (weaponType === 'blaster' ? 200 : weaponType === 'spread' ? 400 : 800) / timeScale) {
            // Calculate forward direction from Quat
            const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(playerRot);

            if (weaponType === 'blaster') {
                setLasers(prev => [...prev, {
                    id: Math.random().toString(36),
                    position: playerPos.clone().add(forward.clone().multiplyScalar(2)),
                    direction: forward,
                    life: 2.0
                }]);
            } else if (weaponType === 'spread') {
                // 3 Spread
                for (let i = -1; i <= 1; i++) {
                    const spreadDir = forward.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), i * 0.2);
                    setLasers(prev => [...prev, {
                        id: Math.random().toString(36),
                        position: playerPos.clone().add(spreadDir.clone().multiplyScalar(2)),
                        direction: spreadDir,
                        life: 1.5
                    }]);
                }
            } else if (weaponType === 'missile') {
                // Missile - Logic handled in update? For now just visual difference
                // Or maybe slower but homing?
                setLasers(prev => [...prev, {
                    id: Math.random().toString(36),
                    position: playerPos.clone().add(forward.clone().multiplyScalar(2)),
                    direction: forward,
                    life: 4.0 // Longer range
                }]);
            }

            lastFireTime.current = now;
        }

        // --- UPDATE LASERS ---
        setLasers(prev => prev.map(laser => ({
            ...laser,
            position: laser.position.add(laser.direction.clone().multiplyScalar(LASER_SPEED * scaledDelta)),
            life: laser.life - scaledDelta
        })).filter(l => l.life > 0));

        // --- UPDATE ENEMIES ---
        // Simple Chase Logic
        setEnemies(prev => {
            const nextEnemies: Enemy[] = [];
            prev.forEach(enemy => {
                const dir = playerPos.clone().sub(enemy.position).normalize();
                enemy.position.add(dir.multiplyScalar(ENEMY_SPEED * scaledDelta));

                // Check Collision with Player
                if (enemy.position.distanceTo(playerPos) < 2) {
                    onPlayerHit();
                    // Enemy destroyed on impact
                    return;
                }
                nextEnemies.push(enemy);
            });
            return nextEnemies;
        });

        // --- LASER vs ENEMY COLLISION ---
        // Needs careful array mutation handling
        // Naive O(N*M) is fine for low counts
        setEnemies(currentEnemies => {
            const survivingEnemies: Enemy[] = [];

            currentEnemies.forEach(enemy => {
                let hit = false;
                // Check against all lasers (this is slightly hacky inside the loop state update, 
                // but we need to remove lasers too. 
                // Better to do collision detection in a separate pass? Yes.
                // But for React state, let's keep it simple: Lasers are cheap, don't delete immediately?
                // VISUAL ONLY:
                // We just need to filter enemies. laser deletion is harder here without double state update.
                // Let's just create a "Lasers to remove" list?

                // Simpler: Just check if any laser is close
                const hittingLaser = lasers.find(l => l.position.distanceTo(enemy.position) < 2);
                if (hittingLaser) {
                    onEnemyHit();
                    // We *should* remove the laser too, but letting it pass through (piercing) is a "feature" ;)
                    // Or we can just let it timeout.
                    hit = true;
                }

                if (!hit) survivingEnemies.push(enemy);
            });
            return survivingEnemies;
        });
    });

    return (
        <group>
            {/* Render Lasers */}
            {lasers.map(laser => (
                <mesh key={laser.id} position={laser.position}>
                    <boxGeometry args={[0.2, 0.2, 2]} />
                    <meshBasicMaterial color="#00ff00" />
                    {/* Orient laser to direction */}
                    <primitive object={new THREE.ArrowHelper(laser.direction, new THREE.Vector3(0, 0, 0), 0).line} visible={false} />
                    {/* LookAt is tricky in map loop without refs. 
                    Simple hack: since laser is box, rotation doesn't matter much if it's long? 
                    Actually it looks weird if sideways.
                    Correct way: Use lookAt. 
                */}
                </mesh>
            ))}

            {/* Render Enemies */}
            {enemies.map(enemy => (
                <group key={enemy.id} position={enemy.position}>
                    {/* Spike Virus Shape */}
                    <mesh>
                        <octahedronGeometry args={[1, 0]} />
                        <meshStandardMaterial color="#ff0000" emissive="#550000" roughness={0.4} />
                    </mesh>
                    <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                        <octahedronGeometry args={[0.8, 0]} />
                        <meshStandardMaterial color="#aa0000" wireframe />
                    </mesh>

                    {/* Health Bar (Optional) */}
                </group>
            ))}
        </group>
    );
};

export default CombatSystem;
