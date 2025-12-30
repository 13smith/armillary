# 3D Solar System Feature Documentation

> **Branch**: `feature/3d-solar-system` (PR pending)
> **Route**: `/3d-solar-system`

## Overview

Interactive 3D visualization of the solar system using React Three Fiber and the `astronomy-engine` library for accurate planetary position calculations. Features real-time simulation, planetary alignments detection, and interactive controls.

---

## Architecture

```
resources/js/
├── pages/
│   └── solar-system/index.tsx           # Page component
├── components/solar-system/
│   ├── solar-system-scene.tsx           # Main scene orchestrator
│   ├── planet.tsx                        # Planet mesh + label
│   ├── sun.tsx                           # Sun with glow effect
│   ├── moon.tsx                          # Earth's moon
│   ├── orbit-path.tsx                    # Orbital ellipse visualization
│   ├── controls-panel.tsx                # Time/display controls UI
│   ├── planet-info-card.tsx              # Selected planet details
│   ├── alignments-panel.tsx              # Upcoming alignments list
│   └── alignment-indicator.tsx           # Visual line between aligned planets
├── hooks/solar-system/
│   ├── use-planet-positions.ts           # Planet + moon position calculations
│   ├── use-alignments.ts                 # Planetary alignment detection
│   └── use-simulation-time.ts            # Time simulation control
└── lib/solar-system/
    ├── astronomy.ts                      # astronomy-engine wrapper functions
    ├── constants.ts                      # Planet data + scale factors
    └── types.ts                          # TypeScript interfaces
```

---

## Core Dependencies

| Package | Purpose |
|---------|---------|
| `three` | 3D rendering engine |
| `@react-three/fiber` | React renderer for Three.js |
| `@react-three/drei` | Helpers: OrbitControls, Stars, Line, Html |
| `astronomy-engine` | Astronomical calculations (JPL ephemeris data) |

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     SolarSystemScene                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ State:       │  │ Hooks:       │  │ Components:          │  │
│  │ - date       │→ │ usePlanet-   │→ │ - Sun               │  │
│  │ - isPlaying  │  │   Positions  │  │ - Planet (×8)       │  │
│  │ - speed      │  │ useAlignments│  │ - Moon              │  │
│  │ - showOrbits │  └──────────────┘  │ - OrbitPath (×8)    │  │
│  │ - showLabels │                    │ - AlignmentIndicator│  │
│  │ - selected   │                    └──────────────────────┘  │
│  └──────────────┘                                               │
│         ↓                                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ SimulationController (useFrame loop)                      │  │
│  │ - Advances date based on speed when playing               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Components

### 1. SolarSystemScene (`solar-system-scene.tsx`)

Main orchestrator managing:
- **State**: date, isPlaying, speed, showOrbits, showLabels, selectedPlanet
- **Canvas setup**: Camera at `[0, 50, 80]`, 60° FOV
- **UI overlays**: ControlsPanel, PlanetInfoCard, AlignmentsPanel

```tsx
<Canvas camera={{ position: [0, 50, 80], fov: 60 }}>
  <Suspense fallback={null}>
    <SceneContent ... />
  </Suspense>
</Canvas>
```

### 2. SimulationController

Runs in the render loop via `useFrame`. Advances simulation time:

```tsx
useFrame((_, delta) => {
  if (!isPlaying) return;
  const msPerFrame = speed * 24 * 60 * 60 * 1000 * delta;
  const newDate = new Date(dateRef.current.getTime() + msPerFrame);
  dateRef.current = newDate;
  onDateChange(newDate);
});
```

### 3. Planet Component

Renders each planet as a sphere with:
- Rotation animation (`useFrame`)
- Selection ring when clicked
- HTML label overlay (via `@react-three/drei`)

```tsx
<sphereGeometry args={[radius, 32, 32]} />
<meshStandardMaterial color={data.color} roughness={0.8} metalness={0.2} />
```

### 4. Sun Component

Central light source with glow effect:

```tsx
<pointLight position={[0, 0, 0]} intensity={2} distance={200} />
<mesh>
  <sphereGeometry args={[2.5, 32, 32]} />
  <meshBasicMaterial color="#ffd700" />
</mesh>
<mesh> {/* Glow */}
  <sphereGeometry args={[3, 32, 32]} />
  <meshBasicMaterial color="#ffaa00" transparent opacity={0.3} />
</mesh>
```

### 5. OrbitPath Component

Calculates and renders orbital paths using `getOrbitPoints`:

```tsx
const points = getOrbitPoints(body, 180); // 180 points around orbit
<Line points={points} color={color} lineWidth={1} opacity={0.4} />
```

---

## Astronomy Calculations (`lib/solar-system/astronomy.ts`)

### getPlanetPosition

Converts `astronomy-engine` heliocentric vectors to Three.js coordinates:

```typescript
export function getPlanetPosition(body: Body, date: Date) {
  const time = Astronomy.MakeTime(date);
  const vec = Astronomy.HelioVector(body, time);
  return {
    x: vec.x * SCALE.distanceMultiplier,  // 8x scale
    y: vec.z * SCALE.distanceMultiplier,  // Swap Y/Z for Three.js
    z: -vec.y * SCALE.distanceMultiplier,
  };
}
```

### getMoonPosition

Calculates Moon position relative to Earth using `GeoMoon`:

```typescript
const moon = Astronomy.GeoMoon(time);
return {
  x: earthPosition.x + moon.x * moonScale,
  y: earthPosition.y + moon.z * moonScale,
  z: earthPosition.z - moon.y * moonScale,
};
```

### findUpcomingAlignments

Detects when planets align within 5° (conjunction):

```typescript
for (let day = 0; day < daysAhead; day++) {
  // Calculate angular separation between all planet pairs
  // If < 5°, record as alignment
}
```

---

## Scale Constants (`lib/solar-system/constants.ts`)

```typescript
export const SCALE = {
  distanceMultiplier: 8,      // AU to scene units
  sunRadius: 2.5,             // Scene units
  planetSizeMultiplier: 0.4,  // Relative planet scaling
  moonOrbitRadius: 0.3,       // Moon distance from Earth
  moonSize: 0.08,             // Moon radius
};
```

### Planet Data

All 8 planets defined with:
- `name`, `body` (astronomy-engine enum)
- `color`, `radius` (relative to Earth)
- `orbitColor`, `description`

---

## Features

| Feature | Description |
|---------|-------------|
| **Real-time Simulation** | Time advances at configurable speeds (1x, 10x, 100x, 1000x) |
| **Accurate Positions** | Uses JPL ephemeris data via astronomy-engine |
| **Orbital Paths** | Toggle visibility of orbital ellipses |
| **Planet Labels** | Toggle HTML labels above planets |
| **Planet Selection** | Click planet to show info card with distance/size |
| **Moon Tracking** | Earth's moon rendered and tracked |
| **Alignment Detection** | Predicts planetary conjunctions 90 days ahead |
| **Camera Controls** | OrbitControls for pan/zoom/rotate |
| **Star Field** | Background stars via `@react-three/drei` |

---

## UI Panels

### ControlsPanel (top-left)
- Current date display
- Play/Pause button
- Reset to today
- Speed selector (1x/10x/100x/1000x)
- Toggle: orbits, labels

### PlanetInfoCard (top-right, when selected)
- Planet name + color indicator
- Description
- Distance from Sun (AU)
- Relative size to Earth

### AlignmentsPanel (bottom-left)
- List of next 5 upcoming planetary alignments
- Shows planet pair + date

---

## Route Configuration

```php
// routes/web.php
Route::get('3d-solar-system', function () {
    return Inertia::render('solar-system/index');
})->name('solar-system');
```

---

## Coordinate System

| astronomy-engine | Three.js | Description |
|-----------------|----------|-------------|
| x | x | Horizontal (toward vernal equinox) |
| y | -z | Into screen (ecliptic plane) |
| z | y | Vertical (up) |

The swap ensures the ecliptic plane is horizontal in the 3D view.

---

## Performance Considerations

1. **Memoization**: `usePlanetPositions` and `useAlignments` memoize calculations
2. **Suspense**: Scene wrapped in Suspense for async loading
3. **Frame throttling**: SimulationController limits updates to ~60fps
4. **Orbit caching**: OrbitPath points calculated once per body

---

## Test Coverage

```php
// tests/Feature/SolarSystemTest.php
it('can view the solar system page', function () {
    $response = $this->get('/3d-solar-system');
    $response->assertStatus(200);
});
```
