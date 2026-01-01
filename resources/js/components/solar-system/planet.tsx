import type { PlanetData } from '@/lib/solar-system/types';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

interface PlanetProps {
    data: PlanetData;
    position: [number, number, number];
    isSelected: boolean;
    showLabel: boolean;
    onClick: () => void;
}

export function Planet({
    data,
    position,
    isSelected,
    showLabel,
    onClick,
}: PlanetProps) {
    const meshRef = useRef<Mesh>(null);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5;
        }
    });

    const radius = data.radius;

    return (
        <group position={position}>
            <mesh ref={meshRef} onClick={onClick}>
                <sphereGeometry args={[radius, 32, 32]} />
                <meshStandardMaterial
                    color={data.color}
                    roughness={0.8}
                    metalness={0.2}
                />
            </mesh>

            {isSelected && (
                <mesh>
                    <ringGeometry args={[radius * 1.5, radius * 1.6, 32]} />
                    <meshBasicMaterial
                        color="#ffffff"
                        transparent
                        opacity={0.5}
                        side={2}
                    />
                </mesh>
            )}

            {showLabel && (
                <Html
                    position={[0, radius + 0.5, 0]}
                    center
                    distanceFactor={15}
                >
                    <div className="pointer-events-none rounded bg-black/70 px-2 py-1 text-xs whitespace-nowrap text-white select-none">
                        {data.name}
                    </div>
                </Html>
            )}
        </group>
    );
}
