import { MapSettings } from "../types/settings";

const DEFAULT_OBJECTS: MapSettings["objects"] = {
    star: true,
    planet: true,
    galaxy: false,
    comet: false,
    asteroid: false,
    pulsar: false,
    blackHole: false,
};

export const DEFAULT_MAP_SETTINGS: MapSettings = {
    mode: "2d",
    objects: DEFAULT_OBJECTS,
};