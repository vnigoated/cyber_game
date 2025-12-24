'use client';

import { Canvas } from '@react-three/fiber';
import { Stars, KeyboardControls } from '@react-three/drei';
import { useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import CyberAvatar from './CyberAvatar';
import ScenarioGate from './ScenarioGate';
import InfiniteGrid from './InfiniteGrid';
import type { Scenario } from '@/lib/types';

import CombatSystem, { Enemy } from './CombatSystem';
import Radar from '@/components/ui/Radar';
import SpaceEnvironment from './SpaceEnvironment';
import DebrisField from './DebrisField';
import BlackHole from './BlackHole';
import SpeedRing from './SpeedRing';
import WarpGate from './WarpGate';


// Map generic scenarios to spatial positions
// We'll arrange them in a path or scattered
// For now, let's put them in a straight line for easy "adventure"
const SCENARIO_SPACING = 30;

type AdventureSceneProps = {
    scenarios: Scenario[];
    completedScenarioIds: number[];
    onScenarioTrigger: (scenarioId: number) => void;
};

const AdventureScene = ({ scenarios, completedScenarioIds, onScenarioTrigger }: AdventureSceneProps) => {
    const [playerPos, setPlayerPos] = useState(new THREE.Vector3(0, 0, 0));
    const [playerRot, setPlayerRot] = useState(new THREE.Quaternion());
    const [isFiring, setIsFiring] = useState(false);
    const [enemies, setEnemies] = useState<Enemy[]>([]);

    // Ultimate Update States
    const [weaponType, setWeaponType] = useState<'blaster' | 'spread' | 'missile'>('blaster');
    const [cockpitMode, setCockpitMode] = useState(false);
    const [timeScale, setTimeScale] = useState(1);

    // Key Listeners
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const listDown = (e: KeyboardEvent) => {
                if (e.code === 'Space') setIsFiring(true);
                if (e.key === '1') setWeaponType('blaster');
                if (e.key === '2') setWeaponType('spread');
                if (e.key === '3') setWeaponType('missile');
                if (e.code === 'KeyC') setCockpitMode(prev => !prev);
                if (e.code === 'KeyT') setTimeScale(0.2); // Bullet Time ON
            };
            const listUp = (e: KeyboardEvent) => {
                if (e.code === 'Space') setIsFiring(false);
                if (e.code === 'KeyT') setTimeScale(1); // Bullet Time OFF
            };
            window.addEventListener('keydown', listDown);
            window.addEventListener('keyup', listUp);

            return () => {
                window.removeEventListener('keydown', listDown);
                window.removeEventListener('keyup', listUp);
            };
        }
    }, []);


    const handlePlayerUpdate = (pos: THREE.Vector3, rot: THREE.Quaternion) => {
        setPlayerPos(pos);
        setPlayerRot(rot);
    };

    // Generate fixed positions for scenarios based on their index
    // Note: changing scenario order (shuffling) might change positions if we use index
    // but for gameplay variety that might be good.
    const gates = useMemo(() => {
        return scenarios.map((scenario, index) => ({
            scenario,
            // Zig-zag path: Forward Z, alternate X left/right
            position: [
                (index % 2 === 0 ? 10 : -10),
                1,
                -(index + 1) * SCENARIO_SPACING
            ] as [number, number, number],
            type: index % 3 === 0 ? 'Firewall' : index % 3 === 1 ? 'Phishing' : 'Glitch' as any
        }));
    }, [scenarios]);

    return (
        <div className="w-full h-screen absolute top-0 left-0 -z-10 bg-black">
            <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
                <KeyboardControls
                    map={[
                        { name: 'Forward', keys: ['ArrowUp', 'KeyW'] },
                        { name: 'Backward', keys: ['ArrowDown', 'KeyS'] },
                        { name: 'Left', keys: ['ArrowLeft', 'KeyA'] },
                        { name: 'Right', keys: ['ArrowRight', 'KeyD'] },
                    ]}
                >
                    <color attach="background" args={['#000510']} />
                    <fog attach="fog" args={['#000510', 10, 80]} />

                    <ambientLight intensity={0.4} />
                    <directionalLight
                        position={[10, 20, 10]}
                        intensity={1}
                        castShadow
                        shadow-mapSize={[1024, 1024]}
                    />

                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    {/* The World Ground */}
                    <InfiniteGrid />

                    {/* The Player */}
                    <CyberAvatar
                        position={[0, 0, 0]}
                        onUpdate={handlePlayerUpdate}
                        timeScale={timeScale}
                        cockpitMode={cockpitMode}
                        shieldActive={true}
                    />

                    {/* COMBAT SYSTEM */}
                    <CombatSystem
                        playerPos={playerPos}
                        playerRot={playerRot}
                        isFiring={isFiring}
                        onEnemyHit={() => console.log("Enemy Hit! +50")} // TODO: connect to score
                        onPlayerHit={() => console.log("Player Hit! Logic needed")} // TODO: connect to health
                        enemies={enemies}
                        setEnemies={setEnemies}
                        weaponType={weaponType}
                        timeScale={timeScale}
                    />

                    {/* The Objectives */}
                    {gates.map((gate) => (
                        <ScenarioGate
                            key={gate.scenario.id}
                            position={gate.position}
                            type={gate.type}
                            title={gate.scenario.title}
                            isCompleted={completedScenarioIds.includes(gate.scenario.id)}
                            playerPos={playerPos}
                            onEnter={() => onScenarioTrigger(gate.scenario.id)}
                        />
                    ))}
                </KeyboardControls>
            </Canvas>

            {/* HUD Hint */}
            <div className="absolute top-4 left-4 text-primary font-mono text-sm pointer-events-none opacity-70">
                <div>CONTROLS: W A S D / ARROWS to Move</div>
                <div>SPACE to Fire | HOLD SHIFT for Turbo</div>
                <div>KEYS 1-3: {weaponType.toUpperCase()} | HOLD T: Bullet Time</div>
                <div>KEY C: {cockpitMode ? 'EXIT COCKPIT' : 'ENTER COCKPIT'}</div>
                <div>OBJECTIVE: LOCATE & SECURE NODES</div>
            </div>

            <Radar
                playerPos={playerPos}
                playerRot={playerRot}
                enemies={enemies}
                objectives={gates.map(g => ({ position: g.position, isCompleted: g.scenario.id !== undefined && completedScenarioIds.includes(g.scenario.id) }))}
            />
        </div>
    );
};

export default AdventureScene;
