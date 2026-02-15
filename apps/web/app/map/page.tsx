"use client";

import styles from "./page.module.css";
import { Map } from "@/features";

export default function MapPage() {
    return (
        <div className={styles.page}>
            <div className={styles.mapContainer}>
                <Map.ToggleMapMode />
                <Map.CanvasMap />
            </div>
        </div>
    );
}
