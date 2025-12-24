'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { LocateFixed } from 'lucide-react';

type RadarProps = {
    playerPos: THREE.Vector3;
    playerRot: THREE.Quaternion;
    enemies: { position: THREE.Vector3 }[];
    objectives: { position: [number, number, number], isCompleted: boolean }[];
};

const RANGE = 80; // Detection range
const SIZE = 140; // Pixel size of radar

const Radar = ({ playerPos, playerRot, enemies, objectives }: RadarProps) => {

    // Calculate blips
    // We want the radar to rotate with the player? Usually yes.
    // Or Fixed North? Fixed North is easier for orientation in an infinite grid.
    // Let's do Fixed Start (North up) for now, simpler to navigate.

    const blips = useMemo(() => {
        // 1. Objectives (Blue)
        const objs = objectives.filter(o => !o.isCompleted).map((obj, i) => {
            const dx = obj.position[0] - playerPos.x;
            const dz = obj.position[2] - playerPos.z;

            // Scale to radar size
            // If dist > RANGE, clamp to edge
            let x = (dx / RANGE) * (SIZE / 2);
            let y = (dz / RANGE) * (SIZE / 2); // Z is usually up/down in 2D map

            // Clamp
            const dist = Math.sqrt(x * x + y * y);
            if (dist > SIZE / 2) {
                const angle = Math.atan2(y, x);
                x = Math.cos(angle) * (SIZE / 2);
                y = Math.sin(angle) * (SIZE / 2);
            }

            return (
                <div
                    key={`obj-${i}`}
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_5px_#00ffff]"
                    style={{
                        left: SIZE / 2 + x - 2,
                        top: SIZE / 2 + y - 2, // +Y in 2D is usually down, but +Z is 'South' in 3D. 
                        // If Forward is -Z, then -Z should be 'Up' on Radar.
                        // So logic: y = (dz / RANGE) ... if dz is negative (forward), y is negative (up). Correct.
                    }}
                />
            );
        });

        // 2. Enemies (Red)
        const enems = enemies.map((enem, i) => {
            const dx = enem.position.x - playerPos.x;
            const dz = enem.position.z - playerPos.z;

            // Scale
            let x = (dx / RANGE) * (SIZE / 2);
            let y = (dz / RANGE) * (SIZE / 2);

            const dist = Math.sqrt(x * x + y * y);
            if (dist > SIZE / 2) {
                const angle = Math.atan2(y, x);
                x = Math.cos(angle) * (SIZE / 2);
                y = Math.sin(angle) * (SIZE / 2);
            }

            return (
                <div
                    key={`enem-${i}`}
                    className="absolute w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"
                    style={{
                        left: SIZE / 2 + x - 2,
                        top: SIZE / 2 + y - 2
                    }}
                />
            );
        });

        return [...objs, ...enems];
    }, [playerPos, enemies, objectives]);

    return (
        <div className="absolute top-4 right-4 pointer-events-none select-none">
            <div
                className="rounded-full bg-black/50 border border-primary/50 relative backdrop-blur-sm overflow-hidden"
                style={{ width: SIZE, height: SIZE }}
            >
                {/* Grid Lines */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle, transparent 60%, var(--primary) 60%), linear-gradient(0deg, transparent 49%, var(--primary) 50%, transparent 51%), linear-gradient(90deg, transparent 49%, var(--primary) 50%, transparent 51%)',
                        backgroundSize: '100% 100%, 100% 100%, 100% 100%'
                    }}
                />

                {/* Scanning Line */}
                <div className="absolute inset-0 animate-spin-slow origin-center">
                    <div className="w-1/2 h-full bg-gradient-to-l from-transparent to-primary/20" style={{ transformOrigin: 'right center', transform: 'rotate(0deg)' }} />
                </div>

                {/* Player Marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
                    <LocateFixed className="w-4 h-4 text-white" />
                </div>

                {/* Blips */}
                {blips}
            </div>
            <div className="text-right mt-1 text-xs font-mono text-primary/70">RADAR ACTIVE</div>
        </div>
    );
};

export default Radar;
