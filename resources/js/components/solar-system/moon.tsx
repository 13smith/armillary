import { SCALE } from '@/lib/solar-system/constants';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

interface MoonProps {
    position: [number, number, number];
    showLabel: boolean;
}

export function Moon({ position, showLabel }: MoonProps) {
    const meshRef = useRef<Mesh>(null);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <group position={position}>
            <mesh ref={meshRef}>
                <sphereGeometry args={[SCALE.moonSize, 16, 16]} />
                <meshStandardMaterial
                    color="#c0c0c0"
                    roughness={0.9}
                    metalness={0.1}
                />
            </mesh>

            {showLabel && (
                <Html
                    position={[0, SCALE.moonSize + 0.2, 0]}
                    center
                    distanceFactor={15}
                >
                    <div className="pointer-events-none rounded bg-black/70 px-2 py-1 text-xs whitespace-nowrap text-white select-none">
                        Moon
                    </div>
                </Html>
            )}
        </group>
    );
}
