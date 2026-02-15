import { useState } from "react";
import { MapMode } from "../types/mode";
import styles from '../styles/ToggleMapMode.module.css'
import ToggleButton  from "@repo/ui/ToggleButton";

export function ToggleMapMode() {
    const [mode, setMode] = useState<MapMode>("2d");

    return (
        <div className={styles.toolbar}>
            <span className={styles.toolbarLabel}>Mode</span>
            <ToggleButton<MapMode>
                aria-label="Режим карты"
                value={mode}
                onValueChange={setMode}
                options={[
                    { value: "2d", label: "2D" },
                    { value: "3d", label: "3D", disabled: true },
                ]}
            />
        </div>

    )
}