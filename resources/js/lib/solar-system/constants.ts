import { Body } from 'astronomy-engine';
import type { PlanetData } from './types';

export const SCALE = {
    distanceMultiplier: 8,
    sunRadius: 2.5,
    planetSizeMultiplier: 0.4,
    moonOrbitRadius: 0.3,
    moonSize: 0.08,
};

export const PLANETS: PlanetData[] = [
    {
        name: 'Mercury',
        body: Body.Mercury,
        color: '#b5b5b5',
        radius: 0.38,
        orbitColor: '#666666',
        description: 'Smallest planet, closest to the Sun',
    },
    {
        name: 'Venus',
        body: Body.Venus,
        color: '#e6c229',
        radius: 0.95,
        orbitColor: '#998833',
        description: 'Hottest planet, rotates backwards',
    },
    {
        name: 'Earth',
        body: Body.Earth,
        color: '#2d5f8a',
        radius: 1.0,
        orbitColor: '#446688',
        description: 'Our home, the blue marble',
    },
    {
        name: 'Mars',
        body: Body.Mars,
        color: '#c1440e',
        radius: 0.53,
        orbitColor: '#884422',
        description: 'The red planet, has the largest volcano',
    },
    {
        name: 'Jupiter',
        body: Body.Jupiter,
        color: '#d8ca9d',
        radius: 2.5,
        orbitColor: '#998866',
        description: 'Largest planet, Great Red Spot storm',
    },
    {
        name: 'Saturn',
        body: Body.Saturn,
        color: '#f4d59e',
        radius: 2.2,
        orbitColor: '#aa9955',
        description: 'Famous for its rings',
    },
    {
        name: 'Uranus',
        body: Body.Uranus,
        color: '#d1e7e7',
        radius: 1.6,
        orbitColor: '#668888',
        description: 'Ice giant, rotates on its side',
    },
    {
        name: 'Neptune',
        body: Body.Neptune,
        color: '#5b5ddf',
        radius: 1.5,
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
