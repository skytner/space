"use client";

import { useState } from "react";
import { MapModeResolver } from "../components/MapModeResolver";
import { MapSettings } from "../components/MapSettings";
import { DEFAULT_MAP_SETTINGS } from "../constants/settings";
import type { MapSettings as MapSettingsType } from "../types/settings";
import { MapModeProvider } from "../hooks/useMapMode";
import styles from "../styles/MapView.module.css";

export function MapView() {
    const [settings, setSettings] = useState<MapSettingsType>(() => DEFAULT_MAP_SETTINGS);

    return (
        <div className={styles.mapContainer}>
            <MapModeProvider
                mode={settings.mode}
                setMode={(mode) => setSettings((prev) => ({ ...prev, mode }))}
            >
                <MapSettings settings={settings} onSettingsChange={setSettings} />
                <MapModeResolver />
            </MapModeProvider>
        </div>
    );
}