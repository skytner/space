import type { CelestialType } from "@repo/api-contracts";
import type { MapMode } from "./mode";

export type MapSettings = {
    mode: MapMode;
    objects: Record<CelestialType, boolean>;
};