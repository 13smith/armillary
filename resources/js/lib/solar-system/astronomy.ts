import type { Body } from 'astronomy-engine';
import * as Astronomy from 'astronomy-engine';
import { AU_TO_KM, PLANETS, SCALE } from './constants';
import type { MoonPosition, PlanetPosition } from './types';

export function getPlanetPosition(
    body: Body,
    date: Date,
): { x: number; y: number; z: number } {
    const time = Astronomy.MakeTime(date);
    const vec = Astronomy.HelioVector(body, time); // Returns position in AU

    // Convert AU to 3D units using realistic scale
    const auTo3D = AU_TO_KM / SCALE.kmPerUnit;

    return {
        x: vec.x * auTo3D,
        y: vec.z * auTo3D,
        z: -vec.y * auTo3D,
    };
}

export function getAllPlanetPositions(date: Date): PlanetPosition[] {
    return PLANETS.map((planet) => ({
        name: planet.name,
        ...getPlanetPosition(planet.body, date),
    }));
}

export function getMoonPosition(
    date: Date,
    earthPosition: { x: number; y: number; z: number },
): MoonPosition {
    const time = Astronomy.MakeTime(date);
    const moon = Astronomy.GeoMoon(time);

    const moonScale = SCALE.moonOrbitRadius / 0.00257;

    return {
        x: earthPosition.x + moon.x * moonScale,
        y: earthPosition.y + moon.z * moonScale,
        z: earthPosition.z - moon.y * moonScale,
    };
}

export function getOrbitPoints(
    body: Body,
    numPoints: number = 360,
): { x: number; y: number; z: number }[] {
    const points: { x: number; y: number; z: number }[] = [];
    const now = new Date();

    const orbitalPeriods: Record<string, number> = {
        Mercury: 88,
        Venus: 225,
        Earth: 365,
        Mars: 687,
        Jupiter: 4333,
        Saturn: 10759,
        Uranus: 30687,
        Neptune: 60190,
    };

    const bodyName = Astronomy.Body[body] as string;
    const period = orbitalPeriods[bodyName] || 365;

    for (let i = 0; i <= numPoints; i++) {
        const dayOffset = (i / numPoints) * period;
        const date = new Date(now.getTime() + dayOffset * 24 * 60 * 60 * 1000);
        points.push(getPlanetPosition(body, date));
    }

    return points;
}

export function findUpcomingAlignments(
    startDate: Date,
    daysAhead: number = 90,
): { body1: string; body2: string; date: Date; angleDeg: number }[] {
    const alignments: {
        body1: string;
        body2: string;
        date: Date;
        angleDeg: number;
    }[] = [];
    const threshold = 5;

    for (let day = 0; day < daysAhead; day += 1) {
        const checkDate = new Date(
            startDate.getTime() + day * 24 * 60 * 60 * 1000,
        );
        const positions = getAllPlanetPositions(checkDate);

        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                const p1 = positions[i]!;
                const p2 = positions[j]!;

                const angle1 = Math.atan2(p1.z, p1.x);
                const angle2 = Math.atan2(p2.z, p2.x);
                let diff = Math.abs(angle1 - angle2) * (180 / Math.PI);
                if (diff > 180) diff = 360 - diff;

                if (diff < threshold) {
                    const existing = alignments.find(
                        (a) =>
                            a.body1 === p1.name &&
                            a.body2 === p2.name &&
                            Math.abs(a.date.getTime() - checkDate.getTime()) <
                                7 * 24 * 60 * 60 * 1000,
                    );
                    if (!existing) {
                        alignments.push({
                            body1: p1.name,
                            body2: p2.name,
                            date: checkDate,
                            angleDeg: diff,
                        });
                    }
                }
            }
        }
    }

    return alignments.sort((a, b) => a.date.getTime() - b.date.getTime());
}
