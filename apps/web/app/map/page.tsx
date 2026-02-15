'use client'

import styles from "./page.module.css";
import { Map } from "@/modules";

export default function MapPage() {
    return (
        <div className={styles.page}>
            <Map.MapView />
        </div>
    );
}
