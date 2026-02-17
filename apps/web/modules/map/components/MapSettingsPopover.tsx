"use client";

import { CelestialType } from "@repo/api-contracts";
import type { MapMode } from "../types/mode";
import type { MapSettings as MapSettingsType } from "../types/settings";
import { OBJECT_LABELS, OBJECT_ORDER, MAP_SETTINGS_LABELS } from "../helpers/translations";
import { Checkbox } from "@repo/ui/Checkbox";
import ToggleButton from "@repo/ui/ToggleButton";
import styles from "../styles/MapSettings.module.css";

type MapSettingsPopoverProps = {
    settings: MapSettingsType;
    onModeChange: (mode: MapMode) => void;
    onToggleLayer: (layer: CelestialType) => void;
};

export function MapSettingsPopover({
    settings,
    onModeChange,
    onToggleLayer,
}: MapSettingsPopoverProps) {
    return (
        <>
            <div className={styles.popoverSection}>
                <div className={styles.popoverTitle}>{MAP_SETTINGS_LABELS.mapModeTitle}</div>
                <ToggleButton<MapMode>
                    aria-label="Map view mode"
                    value={settings.mode}
                    onValueChange={onModeChange}
                    options={[
                        { value: "2d", label: "2D" },
                        { value: "3d", label: "3D" },
                    ]}
                />
            </div>
            <div className={styles.popoverSection}>
                <div className={styles.popoverTitle}>{MAP_SETTINGS_LABELS.objectsTitle}</div>
                <ul className={styles.layerList}>
                    {OBJECT_ORDER.map((layer) => (
                        <li key={layer} className={styles.layerItem}>
                            <Checkbox
                                className={styles.checkboxLabel}
                                checked={settings.objects[layer]}
                                onCheckedChange={() => onToggleLayer(layer)}
                            >
                                {OBJECT_LABELS[layer]}
                            </Checkbox>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
