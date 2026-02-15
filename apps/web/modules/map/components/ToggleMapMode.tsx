'use client'
import { MapMode } from "../types/mode";
import styles from '../styles/ToggleMapMode.module.css'
import ToggleButton from "@repo/ui/ToggleButton";
import { useMapMode } from "../hooks/useMapMode";

export function ToggleMapMode() {
    const { mapMode, setMapMode } = useMapMode()

    return (
        <div className={styles.toolbar}>
            <span className={styles.toolbarLabel}>Mode</span>
            <ToggleButton<MapMode>
                aria-label="Режим карты"
                value={mapMode}
                onValueChange={setMapMode}
                options={[
                    { value: "2d", label: "2D" },
                    { value: "3d", label: "3D" },
                ]}
            />
        </div>

    )
}