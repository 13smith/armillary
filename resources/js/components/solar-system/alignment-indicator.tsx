import type { PlanetPosition } from '@/lib/solar-system/types';
import { Line } from '@react-three/drei';

interface AlignmentIndicatorProps {
    position1: PlanetPosition;
    position2: PlanetPosition;
}

export function AlignmentIndicator({
    position1,
    position2,
}: AlignmentIndicatorProps) {
    const points: [number, number, number][] = [
        [position1.x, position1.y, position1.z],
        [position2.x, position2.y, position2.z],
    ];

    return (
        <Line
            points={points}
            color="#ffff00"
            lineWidth={2}
            transparent
            opacity={0.6}
            dashed
            dashSize={0.5}
            gapSize={0.3}
        />
    );
}
