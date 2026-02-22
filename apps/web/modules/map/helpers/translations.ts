import { CelestialType } from "@repo/api-contracts";

export const MAP_SETTINGS_LABELS = {
    objectsTitle: "Objects",
    mapModeTitle: "View",
    mapSettings: "Map settings",
} as const;

export const OBJECT_LABELS: Record<CelestialType, string> = {
    [CelestialType.Star]: "Stars",
    [CelestialType.Planet]: "Planets",
    [CelestialType.Galaxy]: "Galaxies",
    [CelestialType.Comet]: "Comets",
    [CelestialType.Asteroid]: "Asteroids",
    [CelestialType.Pulsar]: "Pulsars",
    [CelestialType.BlackHole]: "Black holes",
};

export const OBJECT_ORDER: CelestialType[] = [
    CelestialType.Star,
    CelestialType.Planet,
    CelestialType.Galaxy,
    CelestialType.Comet,
    CelestialType.Asteroid,
    CelestialType.Pulsar,
    CelestialType.BlackHole,
];
