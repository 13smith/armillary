import { SCALE } from '@/lib/solar-system/constants';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

export function Sun() {
    const meshRef = useRef<Mesh>(null);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <group>
            <pointLight
                position={[0, 0, 0]}
                intensity={2}
                distance={1000}
                decay={0.5}
            />
            <mesh ref={meshRef}>
                <sphereGeometry args={[SCALE.sunRadius, 32, 32]} />
                <meshBasicMaterial color="#ffd700" />
            </mesh>
        </group>
    );
}
