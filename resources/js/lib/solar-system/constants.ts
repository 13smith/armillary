import { Body } from 'astronomy-engine';
import type { PlanetData } from './types';

// Base scale: sun radius in 3D units
const SUN_RADIUS_3D = 2.5;
const SUN_RADIUS_KM = 696000;
const KM_PER_UNIT = SUN_RADIUS_KM / SUN_RADIUS_3D; // 278,400 km per unit

// Real radii in kilometers
const REAL_RADII_KM = {
    sun: 696000,
    mercury: 2439.7,
    venus: 6051.8,
    earth: 6371,
    moon: 1737.4,
    mars: 3389.5,
    jupiter: 69911,
    saturn: 58232,
    uranus: 25362,
    neptune: 24622,
};

// Astronomical Unit in kilometers
export const AU_TO_KM = 149597870.7;

export const SCALE = {
    sunRadius: SUN_RADIUS_3D,
    kmPerUnit: KM_PER_UNIT,
    moonSize: REAL_RADII_KM.moon / KM_PER_UNIT,
    moonOrbitRadius: (0.00257 * AU_TO_KM) / KM_PER_UNIT, // Earth-Moon distance
};

export const PLANETS: PlanetData[] = [
    {
        name: 'Mercury',
        body: Body.Mercury,
        color: '#b5b5b5',
        radius: REAL_RADII_KM.mercury / KM_PER_UNIT,
        orbitColor: '#666666',
        description: 'Smallest planet, closest to the Sun',
    },
    {
        name: 'Venus',
        body: Body.Venus,
        color: '#e6c229',
        radius: REAL_RADII_KM.venus / KM_PER_UNIT,
        orbitColor: '#998833',
        description: 'Hottest planet, rotates backwards',
    },
    {
        name: 'Earth',
        body: Body.Earth,
        color: '#2d5f8a',
        radius: REAL_RADII_KM.earth / KM_PER_UNIT,
        orbitColor: '#446688',
        description: 'Our home, the blue marble',
    },
    {
        name: 'Mars',
        body: Body.Mars,
        color: '#c1440e',
        radius: REAL_RADII_KM.mars / KM_PER_UNIT,
        orbitColor: '#884422',
        description: 'The red planet, has the largest volcano',
    },
    {
        name: 'Jupiter',
        body: Body.Jupiter,
        color: '#d8ca9d',
        radius: REAL_RADII_KM.jupiter / KM_PER_UNIT,
        orbitColor: '#998866',
        description: 'Largest planet, Great Red Spot storm',
    },
    {
        name: 'Saturn',
        body: Body.Saturn,
        color: '#f4d59e',
        radius: REAL_RADII_KM.saturn / KM_PER_UNIT,
        orbitColor: '#aa9955',
        description: 'Famous for its rings',
    },
    {
        name: 'Uranus',
        body: Body.Uranus,
        color: '#d1e7e7',
        radius: REAL_RADII_KM.uranus / KM_PER_UNIT,
        orbitColor: '#668888',
        description: 'Ice giant, rotates on its side',
    },
    {
        name: 'Neptune',
        body: Body.Neptune,
        color: '#5b5ddf',
        radius: REAL_RADII_KM.neptune / KM_PER_UNIT,
        orbitColor: '#4444aa',
        description: 'Windiest planet, deep blue color',
    },
];

export const TIME_SPEEDS = [
    { label: '1x', value: 1 },
    { label: '10x', value: 10 },
    { label: '100x', value: 100 },
    { label: '1000x', value: 1000 },
];
