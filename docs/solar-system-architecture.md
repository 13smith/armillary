# Solar System Feature Documentation

## Current State

**Status**: Not implemented - planning phase only

The 3D solar system functionality has not been built. Only the foundational dependency has been added:

- **astronomy-engine** v2.1.19 - Installed but not used

No 3D rendering library (Three.js, Babylon.js, etc.) is installed.

---

## Installed Dependency: astronomy-engine

The `astronomy-engine` package provides astronomical calculations:

### Capabilities
- **Planetary positions**: Calculate real-time positions of planets relative to Earth or Sun
- **Ephemeris data**: Get precise celestial coordinates (RA/Dec, ecliptic, horizontal)
- **Orbital mechanics**: Compute orbital elements, perihelion, aphelion distances
- **Time calculations**: Handle Julian dates, sidereal time, light-travel time corrections
- **Rise/set times**: Calculate when celestial bodies rise, set, and culminate
- **Eclipses & transits**: Predict lunar/solar eclipses and planetary transits
- **Moon phases**: Calculate lunar phases and illumination
- **Coordinate transforms**: Convert between equatorial, ecliptic, horizontal systems

### Example Usage (Not Yet Implemented)
```typescript
import * as Astronomy from 'astronomy-engine';

// Get current planet positions
const time = Astronomy.MakeTime(new Date());
const mars = Astronomy.GeoVector(Astronomy.Body.Mars, time, true);

// Calculate heliocentric position (Sun-centered)
const marsHelio = Astronomy.HelioVector(Astronomy.Body.Mars, time);
// Returns { x, y, z } in AU (astronomical units)
```

---

## What Would Be Required

### 1. 3D Rendering Library

**Recommended**: Three.js + React Three Fiber

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

- **three**: Core WebGL rendering
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers (OrbitControls, Stars, etc.)

### 2. Component Architecture

```
resources/js/
├── pages/
│   └── solar-system.tsx              # Main page
├── components/
│   └── solar-system/
│       ├── scene.tsx                 # Three.js scene setup
│       ├── planet.tsx                # Planet mesh component
│       ├── orbit-ring.tsx            # Orbital path visualization
│       ├── sun.tsx                   # Sun with glow effect
│       ├── controls.tsx              # Camera/time controls
│       ├── info-panel.tsx            # Planet details sidebar
│       └── time-slider.tsx           # Simulation time control
├── hooks/
│   ├── use-planet-positions.ts       # astronomy-engine integration
│   └── use-solar-system-store.ts     # State management
├── lib/
│   └── astronomy/
│       ├── planets.ts                # Planet data (radius, color, etc.)
│       └── calculations.ts           # Wrapper for astronomy-engine
└── types/
    └── solar-system.ts               # TypeScript interfaces
```

### 3. Planet Data Model

```typescript
// lib/astronomy/planets.ts
export interface PlanetData {
  name: string;
  body: Astronomy.Body;
  radius: number;          // km
  orbitRadius: number;     // AU
  color: string;
  rotationPeriod: number;  // Earth days
  orbitalPeriod: number;   // Earth days
  tilt: number;            // degrees
  texture?: string;        // optional texture path
}

export const PLANETS: PlanetData[] = [
  { name: 'Mercury', body: Astronomy.Body.Mercury, radius: 2439, orbitRadius: 0.387, color: '#b5b5b5', ... },
  { name: 'Venus',   body: Astronomy.Body.Venus,   radius: 6052, orbitRadius: 0.723, color: '#e6c229', ... },
  { name: 'Earth',   body: Astronomy.Body.Earth,   radius: 6371, orbitRadius: 1.000, color: '#6b93d6', ... },
  { name: 'Mars',    body: Astronomy.Body.Mars,    radius: 3390, orbitRadius: 1.524, color: '#c1440e', ... },
  { name: 'Jupiter', body: Astronomy.Body.Jupiter, radius: 69911, orbitRadius: 5.203, color: '#d8ca9d', ... },
  { name: 'Saturn',  body: Astronomy.Body.Saturn,  radius: 58232, orbitRadius: 9.537, color: '#f4d59e', ... },
  { name: 'Uranus',  body: Astronomy.Body.Uranus,  radius: 25362, orbitRadius: 19.19, color: '#d1e7e7', ... },
  { name: 'Neptune', body: Astronomy.Body.Neptune, radius: 24622, orbitRadius: 30.07, color: '#5b5ddf', ... },
];
```

### 4. Position Calculation Hook

```typescript
// hooks/use-planet-positions.ts
import * as Astronomy from 'astronomy-engine';
import { useMemo } from 'react';

export function usePlanetPositions(date: Date) {
  return useMemo(() => {
    const time = Astronomy.MakeTime(date);

    return PLANETS.map(planet => {
      const pos = Astronomy.HelioVector(planet.body, time);
      return {
        ...planet,
        position: {
          x: pos.x,  // AU
          y: pos.z,  // Swap Y/Z for Three.js coordinate system
          z: pos.y,
        },
      };
    });
  }, [date]);
}
```

### 5. Main Scene Component

```tsx
// components/solar-system/scene.tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Sun } from './sun';
import { Planet } from './planet';
import { OrbitRing } from './orbit-ring';
import { usePlanetPositions } from '@/hooks/use-planet-positions';

export function SolarSystemScene({ date }: { date: Date }) {
  const planets = usePlanetPositions(date);
  const scale = 50; // Scale factor for visualization

  return (
    <Canvas camera={{ position: [0, 50, 100], fov: 60 }}>
      <ambientLight intensity={0.1} />
      <Stars radius={300} depth={60} count={5000} factor={7} />

      <Sun />

      {planets.map(planet => (
        <group key={planet.name}>
          <OrbitRing radius={planet.orbitRadius * scale} />
          <Planet
            name={planet.name}
            position={[
              planet.position.x * scale,
              planet.position.y * scale,
              planet.position.z * scale,
            ]}
            radius={Math.log(planet.radius) * 0.5} // Log scale for visibility
            color={planet.color}
          />
        </group>
      ))}

      <OrbitControls enablePan enableZoom enableRotate />
    </Canvas>
  );
}
```

### 6. Backend Route (Optional)

If planet data needs to be server-rendered:

```php
// routes/web.php
Route::get('/solar-system', function () {
    return Inertia::render('SolarSystem', [
        'initialDate' => now()->toISOString(),
    ]);
})->name('solar-system');
```

---

## State Management

Recommended state to track:

```typescript
interface SolarSystemState {
  // Time
  simulationDate: Date;
  timeSpeed: number;      // 1 = real-time, 365 = 1 year/second
  isPaused: boolean;

  // Camera
  followPlanet: string | null;
  cameraDistance: number;

  // UI
  selectedPlanet: string | null;
  showOrbits: boolean;
  showLabels: boolean;
  scaleMode: 'realistic' | 'exaggerated';
}
```

---

## Features to Consider

1. **Time Controls**: Play/pause, speed slider, date picker
2. **Camera Modes**: Free orbit, follow planet, top-down view
3. **Planet Selection**: Click to select, show info panel
4. **Scale Toggle**: Realistic vs exaggerated planet sizes
5. **Orbit Paths**: Toggle orbital ellipse visibility
6. **Labels**: Planet name labels
7. **Moons**: Major moons for each planet
8. **Asteroid Belt**: Particle system between Mars/Jupiter
9. **Textures**: NASA planetary texture maps
10. **Lighting**: Realistic sun-based lighting with shadows

---

## File Checklist

To implement the feature, create these files:

- [ ] `resources/js/pages/solar-system.tsx`
- [ ] `resources/js/components/solar-system/scene.tsx`
- [ ] `resources/js/components/solar-system/planet.tsx`
- [ ] `resources/js/components/solar-system/sun.tsx`
- [ ] `resources/js/components/solar-system/orbit-ring.tsx`
- [ ] `resources/js/components/solar-system/controls.tsx`
- [ ] `resources/js/components/solar-system/info-panel.tsx`
- [ ] `resources/js/hooks/use-planet-positions.ts`
- [ ] `resources/js/lib/astronomy/planets.ts`
- [ ] `resources/js/lib/astronomy/calculations.ts`
- [ ] `resources/js/types/solar-system.ts`
- [ ] `routes/web.php` - Add route

---

## Dependencies to Install

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

---

## References

- [astronomy-engine docs](https://github.com/cosinekitty/astronomy)
- [React Three Fiber docs](https://docs.pmnd.rs/react-three-fiber)
- [Three.js docs](https://threejs.org/docs/)
- [NASA texture maps](https://nasa3d.arc.nasa.gov/images)
