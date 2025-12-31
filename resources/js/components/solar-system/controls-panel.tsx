import { Button } from '@/components/ui/button';
import { TIME_SPEEDS } from '@/lib/solar-system/constants';
import { Eye, EyeOff, Pause, Play, RotateCcw, Tag } from 'lucide-react';

interface ControlsPanelProps {
    date: Date;
    isPlaying: boolean;
    speed: number;
    showOrbits: boolean;
    showLabels: boolean;
    onTogglePlay: () => void;
    onReset: () => void;
    onSpeedChange: (speed: number) => void;
    onToggleOrbits: () => void;
    onToggleLabels: () => void;
}

export function ControlsPanel({
    date,
    isPlaying,
    speed,
    showOrbits,
    showLabels,
    onTogglePlay,
    onReset,
    onSpeedChange,
    onToggleOrbits,
    onToggleLabels,
}: ControlsPanelProps) {
    return (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-3 rounded-lg bg-black/60 p-4 backdrop-blur-sm">
            <div className="text-sm font-medium text-white">
                {date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                })}
            </div>

            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={onTogglePlay}
                    title={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? (
                        <Pause className="size-4" />
                    ) : (
                        <Play className="size-4" />
                    )}
                </Button>
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={onReset}
                    title="Reset to today"
                >
                    <RotateCcw className="size-4" />
                </Button>
            </div>

            <div className="flex flex-wrap gap-1">
                {TIME_SPEEDS.map((s) => (
                    <Button
                        key={s.value}
                        size="sm"
                        variant={speed === s.value ? 'default' : 'secondary'}
                        onClick={() => onSpeedChange(s.value)}
                        className="min-w-10 text-xs"
                    >
                        {s.label}
                    </Button>
                ))}
            </div>

            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant={showOrbits ? 'default' : 'secondary'}
                    onClick={onToggleOrbits}
                    title="Toggle orbits"
                >
                    {showOrbits ? (
                        <Eye className="size-4" />
                    ) : (
                        <EyeOff className="size-4" />
                    )}
                    <span className="ml-1 text-xs">Orbits</span>
                </Button>
                <Button
                    size="sm"
                    variant={showLabels ? 'default' : 'secondary'}
                    onClick={onToggleLabels}
                    title="Toggle labels"
                >
                    <Tag className="size-4" />
                    <span className="ml-1 text-xs">Labels</span>
                </Button>
            </div>
        </div>
    );
}
