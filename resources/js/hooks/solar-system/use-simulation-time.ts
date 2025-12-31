import { useFrame } from '@react-three/fiber';
import { useCallback, useRef, useState } from 'react';

export function useSimulationTime(initialDate: Date = new Date()) {
    const [date, setDate] = useState(initialDate);
    const [isPlaying, setIsPlaying] = useState(true);
    const [speed, setSpeed] = useState(100);
    const lastTimeRef = useRef<number>(0);

    useFrame((_, delta) => {
        if (!isPlaying) return;

        lastTimeRef.current += delta;

        if (lastTimeRef.current >= 0.016) {
            const msPerFrame =
                speed * 24 * 60 * 60 * 1000 * lastTimeRef.current;
            setDate((prev) => new Date(prev.getTime() + msPerFrame));
            lastTimeRef.current = 0;
        }
    });

    const play = useCallback(() => setIsPlaying(true), []);
    const pause = useCallback(() => setIsPlaying(false), []);
    const toggle = useCallback(() => setIsPlaying((prev) => !prev), []);
    const reset = useCallback(() => setDate(new Date()), []);
    const setSimulationSpeed = useCallback(
        (newSpeed: number) => setSpeed(newSpeed),
        [],
    );

    return {
        date,
        isPlaying,
        speed,
        play,
        pause,
        toggle,
        reset,
        setSpeed: setSimulationSpeed,
        setDate,
    };
}
