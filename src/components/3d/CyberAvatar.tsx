'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { Trail } from '@react-three/drei';
import * as THREE from 'three';

const CyberAvatar = ({ position = [0, 0, 0], onUpdate, speedMultiplier = 1, cockpitMode = false, shieldActive = false, timeScale = 1 }: { position?: [number, number, number], onUpdate?: (pos: THREE.Vector3, rot: THREE.Quaternion) => void, speedMultiplier?: number, cockpitMode?: boolean, shieldActive?: boolean, timeScale?: number }) => {
    const group = useRef<THREE.Group>(null);

    // Internal state for smooth movement
    const currentVelocity = useRef(new THREE.Vector3());
    const baseSpeed = 15;

    // Key state logic
    const keys = useRef<{ [key: string]: boolean }>({});

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.code] = true; };
        const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.code] = false; };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame((state, delta) => {
        if (!group.current) return;

        const { Forward, Backward, Left, Right, Turbo } = {
            Forward: keys.current['KeyW'] || keys.current['ArrowUp'],
            Backward: keys.current['KeyS'] || keys.current['ArrowDown'],
            Left: keys.current['KeyA'] || keys.current['ArrowLeft'],
            Right: keys.current['KeyD'] || keys.current['ArrowRight'],
            Turbo: keys.current['ShiftLeft'] || keys.current['ShiftRight']
        };

        const isMoving = Forward || Backward || Left || Right;
        const currentSpeed = (Turbo && isMoving ? 40 : baseSpeed) * speedMultiplier;

        // Camera FOV Warp
        const targetFov = (Turbo || speedMultiplier > 1) && isMoving ? 85 : 60;
        if ((state.camera as any).isPerspectiveCamera) {
            const cam = state.camera as THREE.PerspectiveCamera;
            cam.fov = THREE.MathUtils.lerp(cam.fov, targetFov, delta * 2);
            cam.updateProjectionMatrix();
        }

        const direction = new THREE.Vector3();
        if (Forward) direction.z -= 1;
        if (Backward) direction.z += 1;
        if (Left) direction.x -= 1;
        if (Right) direction.x += 1;

        if (direction.length() > 0) direction.normalize();

        // Smooth velocity
        currentVelocity.current.lerp(direction.multiplyScalar(currentSpeed), delta * 5);

        // Position update
        group.current.position.addScaledVector(currentVelocity.current, delta);

        // BANKING Logic: Tilt sideways when turning
        const targetRotationZ = -currentVelocity.current.x * 0.05; // Bank based on X velocity
        const targetRotationX = currentVelocity.current.z * 0.02; // Pitch slightly based on speed

        group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetRotationZ, delta * 5);
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotationX, delta * 5);

        // Camera Follow
        const cameraOffset = cockpitMode
            ? new THREE.Vector3(0, 0, -2) // Inside Cockpit
            : new THREE.Vector3(0, 6, 12); // Third Person

        // Look At
        const lookAtOffset = cockpitMode
            ? new THREE.Vector3(0, 0, -50)
            : new THREE.Vector3(0, 0, -5);

        // Add Screen Shake on Turbo
        // Only in 3rd person? Or both? Both is cooler.
        if (Turbo && isMoving) {
            cameraOffset.x += (Math.random() - 0.5) * 0.2;
            cameraOffset.y += (Math.random() - 0.5) * 0.2;
        }

        const targetCameraPos = group.current.position.clone().add(cameraOffset.applyQuaternion(group.current.quaternion));

        // If Cockpit, snap instantly (no lerp lag)
        if (cockpitMode) {
            state.camera.position.copy(targetCameraPos);
            state.camera.quaternion.copy(group.current.quaternion);
        } else {
            // 3rd Person Lag
            const idealPos = group.current.position.clone().add(new THREE.Vector3(0, 6, 12)); // Force world axis offset for 3rd person stability?
            // Actually, previous logic was strictly local z? No, it was global vector added.
            // Let's stick to global offset for stable camera, but 'applyQuaternion' makes it local to ship.
            // My previous code: group.current.position.clone().add(cameraOffset) -> This was GLOBAL offset.
            // If I want local offset (behind ship regardless of rotation), I need applyQuaternion.
            // BUT: CyberAvatar doesn't really rotate Y fully yet (only banking).
            state.camera.position.lerp(idealPos, (delta * 5) * timeScale);
            state.camera.lookAt(group.current.position.clone().add(lookAtOffset));
        }

        if (onUpdate) onUpdate(group.current.position, group.current.quaternion);
    });

    const isTurbo = keys.current['ShiftLeft'] || keys.current['ShiftRight'];

    return (
        <group ref={group} position={position}>
            {/* Spaceship Group */}
            <group rotation={[-Math.PI / 2, 0, 0]}>

                {/* Main Fuselage */}
                <mesh castShadow receiveShadow>
                    <coneGeometry args={[0.8, 4, 8]} />
                    <meshStandardMaterial color={isTurbo ? "#ff00ff" : "#00aaff"} roughness={0.3} metalness={0.8} />
                </mesh>

                {/* Cockpit */}
                <mesh position={[0, 0.5, 0.6]}>
                    <capsuleGeometry args={[0.3, 1, 4, 8]} />
                    <meshStandardMaterial color="#222" roughness={0.2} metalness={1} />
                </mesh>

                {/* Wings */}
                <mesh position={[0, -1, 0]}>
                    <boxGeometry args={[3, 0.1, 1.5]} />
                    <meshStandardMaterial color="#0088cc" roughness={0.5} metalness={0.7} />
                </mesh>

                {/* Engine Glow */}
                <mesh position={[0, -2, 0]}>
                    <cylinderGeometry args={[0.4 + (isTurbo ? 0.2 : 0), 0.2, 0.5, 8]} />
                    <meshBasicMaterial color={isTurbo ? "#ff00ff" : "#00ffff"} />
                </mesh>

                {/* Engine Trail */}
                <Trail width={isTurbo ? 3 : 1.5} length={isTurbo ? 12 : 6} color={isTurbo ? "#ff00ff" : "#00ffff"} attenuation={(t) => t * t}>
                    <mesh position={[0, -2.5, 0]}>
                        <sphereGeometry args={[0.1]} />
                        <meshBasicMaterial color="#00ffff" transparent opacity={0} />
                    </mesh>
                </Trail>

                {/* Energy Shield */}
                {shieldActive && (
                    <mesh>
                        <sphereGeometry args={[2.5, 32, 32]} />
                        <meshBasicMaterial
                            color="#0088ff"
                            transparent
                            opacity={0.2}
                            side={THREE.DoubleSide}
                            depthWrite={false}
                        />
                    </mesh>
                )}

            </group>
        </group>
    );
};

export default CyberAvatar;
