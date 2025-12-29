import type { Body } from 'astronomy-engine';

export interface PlanetData {
    name: string;
    body: Body;
    color: string;
    radius: number;
    orbitColor: string;
    description: string;
}

export interface PlanetPosition {
    name: string;
    x: number;
    y: number;
    z: number;
}

export interface MoonPosition {
    x: number;
    y: number;
    z: number;
}

export interface Alignment {
    body1: string;
    body2: string;
    date: Date;
    type: 'conjunction' | 'opposition';
}

export interface SimulationState {
    date: Date;
    isPlaying: boolean;
    speed: number;
}
