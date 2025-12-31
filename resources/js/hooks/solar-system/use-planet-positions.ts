import {
    getAllPlanetPositions,
    getMoonPosition,
} from '@/lib/solar-system/astronomy';
import type { MoonPosition, PlanetPosition } from '@/lib/solar-system/types';
import { useMemo } from 'react';

export function usePlanetPositions(date: Date): {
    planets: PlanetPosition[];
    moon: MoonPosition;
} {
    const dateTime = date.getTime();

    return useMemo(() => {
        const planets = getAllPlanetPositions(date);
        const earth = planets.find((p) => p.name === 'Earth');
        const moon = getMoonPosition(date, earth ?? { x: 0, y: 0, z: 0 });
        return { planets, moon };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateTime]);
}
