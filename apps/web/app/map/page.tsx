"use client";

import { useState } from "react";

import { ToggleButton } from "@repo/ui/ToggleButton";
import styles from "./page.module.css";

type MapMode = "2d" | "3d";

export default function MapPage() {
  const [mode, setMode] = useState<MapMode>("2d");

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <span className={styles.toolbarLabel}>Mode</span>
        <ToggleButton<MapMode>
          aria-label="Режим карты"
          value={mode}
          onValueChange={setMode}
          options={[
            { value: "2d", label: "2D" },
            { value: "3d", label: "3D", disabled: false },
          ]}
        />
      </div>

      <div className={styles.mapContainer}>
        <div className={styles.mapPlaceholder}>
          2D map
        </div>
      </div>
    </div>
  );
}
