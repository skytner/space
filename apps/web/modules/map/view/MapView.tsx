"use client";

import { MapModeResolver } from "../components/MapModeResolver";
import { ToggleMapMode } from "../components/ToggleMapMode";
import { MapModeProvider } from "../hooks/useMapMode";
import styles from "../styles/MapView.module.css";

export function MapView() {
    return (
        <div className={styles.mapContainer}>
            <MapModeProvider>
                <ToggleMapMode />
                <MapModeResolver />
            </MapModeProvider>
        </div>
    )
}