import { CanvasMap } from "../components/CanvasMap";
import { ToggleMapMode } from "../components/ToggleMapMode";
import styles from '../styles/MapView.module.css'

export function MapView() {
    return (
        <div className={styles.mapContainer}>
            <ToggleMapMode />
            <CanvasMap />
        </div>
    )
}