import { useAlignments } from '@/hooks/solar-system/use-alignments';
import { usePlanetPositions } from '@/hooks/solar-system/use-planet-positions';
import { PLANETS } from '@/lib/solar-system/constants';
import type {
    Alignment,
    MoonPosition,
    PlanetPosition,
} from '@/lib/solar-system/types';
import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useCallback, useRef, useState } from 'react';
import { AlignmentIndicator } from './alignment-indicator';
import { AlignmentsPanel } from './alignments-panel';
import { ControlsPanel } from './controls-panel';
import { Moon } from './moon';
import { OrbitPath } from './orbit-path';
import { Planet } from './planet';
import { PlanetInfoCard } from './planet-info-card';
import { Sun } from './sun';

interface SimulationControllerProps {
    isPlaying: boolean;
    speed: number;
    onDateChange: (date: Date) => void;
    dateRef: React.MutableRefObject<Date>;
}

function SimulationController({
    isPlaying,
    speed,
    onDateChange,
    dateRef,
}: SimulationControllerProps) {
    const lastTimeRef = useRef(0);

    useFrame((_, delta) => {
        if (!isPlaying) return;

        lastTimeRef.current += delta;
        if (lastTimeRef.current >= 0.016) {
            const msPerFrame =
                speed * 24 * 60 * 60 * 1000 * lastTimeRef.current;
            const newDate = new Date(dateRef.current.getTime() + msPerFrame);
            dateRef.current = newDate;
            onDateChange(newDate);
            lastTimeRef.current = 0;
        }
    });

    return null;
}

interface SceneContentProps {
    date: Date;
    showOrbits: boolean;
    showLabels: boolean;
    selectedPlanet: string | null;
    onSelectPlanet: (name: string | null) => void;
    isPlaying: boolean;
    speed: number;
    onDateChange: (date: Date) => void;
    dateRef: React.MutableRefObject<Date>;
    planets: PlanetPosition[];
    moon: MoonPosition;
    alignments: Alignment[];
}

function SceneContent({
    date,
    showOrbits,
    showLabels,
    selectedPlanet,
    onSelectPlanet,
    isPlaying,
    speed,
    onDateChange,
    dateRef,
    planets,
    moon,
    alignments,
}: SceneContentProps) {
    const currentAlignments = alignments.filter(
        (a) =>
            Math.abs(a.date.getTime() - date.getTime()) < 24 * 60 * 60 * 1000,
    );

    return (
        <>
            <SimulationController
                isPlaying={isPlaying}
                speed={speed}
                onDateChange={onDateChange}
                dateRef={dateRef}
            />

            <ambientLight intensity={0.1} />
            <Stars
                radius={300}
                depth={60}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={1}
            />

            <Sun />

            {showOrbits &&
                PLANETS.map((planet) => (
                    <OrbitPath
                        key={`orbit-${planet.name}`}
                        body={planet.body}
                        color={planet.orbitColor}
                    />
                ))}

            {planets.map((pos) => {
                const planetData = PLANETS.find((p) => p.name === pos.name)!;
                return (
                    <Planet
                        key={pos.name}
                        data={planetData}
                        position={[pos.x, pos.y, pos.z]}
                        isSelected={selectedPlanet === pos.name}
                        showLabel={showLabels}
                        onClick={() =>
                            onSelectPlanet(
                                pos.name === selectedPlanet ? null : pos.name,
                            )
                        }
                    />
                );
            })}

            <Moon position={[moon.x, moon.y, moon.z]} showLabel={showLabels} />

            {currentAlignments.map((alignment, i) => {
                const pos1 = planets.find((p) => p.name === alignment.body1);
                const pos2 = planets.find((p) => p.name === alignment.body2);
                if (!pos1 || !pos2) return null;
                return (
                    <AlignmentIndicator
                        key={i}
                        position1={pos1}
                        position2={pos2}
                    />
                );
            })}

            <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={50}
                maxDistance={20000}
            />
        </>
    );
}

export function SolarSystemScene() {
    const [date, setDate] = useState(() => new Date());
    const [isPlaying, setIsPlaying] = useState(true);
    const [speed, setSpeed] = useState(100);
    const [showOrbits, setShowOrbits] = useState(true);
    const [showLabels, setShowLabels] = useState(true);
    const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

    const dateRef = useRef(date);

    const handleDateChange = useCallback((newDate: Date) => {
        setDate(newDate);
    }, []);

    const handleReset = useCallback(() => {
        const now = new Date();
        dateRef.current = now;
        setDate(now);
    }, []);

    const { planets } = usePlanetPositions(date);
    const alignments = useAlignments(date);

    const selectedPlanetData = PLANETS.find((p) => p.name === selectedPlanet);
    const selectedPlanetPosition = planets.find(
        (p) => p.name === selectedPlanet,
    );

    return (
        <div className="relative h-full w-full bg-black">
            <ControlsPanel
                date={date}
                isPlaying={isPlaying}
                speed={speed}
                showOrbits={showOrbits}
                showLabels={showLabels}
                onTogglePlay={() => setIsPlaying((v) => !v)}
                onReset={handleReset}
                onSpeedChange={setSpeed}
                onToggleOrbits={() => setShowOrbits((v) => !v)}
                onToggleLabels={() => setShowLabels((v) => !v)}
            />

            {selectedPlanetData && selectedPlanetPosition && (
                <PlanetInfoCard
                    planet={selectedPlanetData}
                    position={selectedPlanetPosition}
                    onClose={() => setSelectedPlanet(null)}
                />
            )}

            <AlignmentsPanel alignments={alignments} currentDate={date} />

            <Canvas camera={{ position: [0, 500, 1000], fov: 60 }}>
                <Suspense fallback={null}>
                    <SceneContent
                        date={date}
                        showOrbits={showOrbits}
                        showLabels={showLabels}
                        selectedPlanet={selectedPlanet}
                        onSelectPlanet={setSelectedPlanet}
                        isPlaying={isPlaying}
                        speed={speed}
                        onDateChange={handleDateChange}
                        dateRef={dateRef}
                        planets={planets}
                        moon={moon}
                        alignments={alignments}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
