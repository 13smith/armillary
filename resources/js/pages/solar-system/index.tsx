import { SolarSystemScene } from '@/components/solar-system/solar-system-scene';
import { Head } from '@inertiajs/react';

export default function SolarSystem() {
    return (
        <>
            <Head title="3D Solar System" />
            <div className="h-screen w-screen overflow-hidden">
                <SolarSystemScene />
            </div>
        </>
    );
}
