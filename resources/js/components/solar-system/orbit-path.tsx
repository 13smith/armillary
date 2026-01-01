import { getOrbitPoints } from '@/lib/solar-system/astronomy';
import { Line } from '@react-three/drei';
import type { Body } from 'astronomy-engine';
import { memo, useMemo } from 'react';

interface OrbitPathProps {
    body: Body;
    color: string;
}

export const OrbitPath = memo(function OrbitPath({
    body,
    color,
}: OrbitPathProps) {
    const points = useMemo(() => {
        const orbitPoints = getOrbitPoints(body, 180);
        return orbitPoints.map(
            (p) => [p.x, p.y, p.z] as [number, number, number],
        );
    }, [body]);

    return (
        <Line
            points={points}
            color={color}
            lineWidth={1}
            transparent
            opacity={0.4}
        />
    );
});
