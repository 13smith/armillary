import { Button } from '@/components/ui/button';
import type { PlanetData, PlanetPosition } from '@/lib/solar-system/types';
import { X } from 'lucide-react';

interface PlanetInfoCardProps {
    planet: PlanetData;
    position: PlanetPosition;
    onClose: () => void;
}

export function PlanetInfoCard({
    planet,
    position,
    onClose,
}: PlanetInfoCardProps) {
    const distanceFromSun =
        Math.sqrt(position.x ** 2 + position.y ** 2 + position.z ** 2) / 8;

    return (
        <div className="absolute top-4 right-4 z-10 w-64 rounded-lg bg-black/60 p-4 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div
                        className="size-4 rounded-full"
                        style={{ backgroundColor: planet.color }}
                    />
                    <h3 className="font-semibold text-white">{planet.name}</h3>
                </div>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onClose}
                    className="size-6 p-0 text-white hover:bg-white/20"
                >
                    <X className="size-4" />
                </Button>
            </div>

            <p className="mb-3 text-sm text-gray-300">{planet.description}</p>

            <div className="space-y-1 text-xs text-gray-400">
                <div className="flex justify-between">
                    <span>Distance from Sun:</span>
                    <span className="text-white">
                        {distanceFromSun.toFixed(2)} AU
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Relative size:</span>
                    <span className="text-white">
                        {planet.radius.toFixed(2)}x Earth
                    </span>
                </div>
            </div>
        </div>
    );
}
