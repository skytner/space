"use client";

import { useCallback, useState, type Dispatch, type SetStateAction } from "react";
import { CelestialType } from "@repo/api-contracts";
import type { MapMode } from "../types/mode";
import type { MapSettings as MapSettingsType } from "../types/settings";
import { Popover } from "@repo/ui/Popover";
import { MapSettingsButton } from "./MapSettingsButton";
import { MapSettingsPopover } from "./MapSettingsPopover";
import styles from "../styles/MapSettings.module.css";

type MapSettingsProps = {
    settings: MapSettingsType;
    onSettingsChange: Dispatch<SetStateAction<MapSettingsType>>;
};

export function MapSettings({ settings, onSettingsChange }: MapSettingsProps) {
    const [open, setOpen] = useState(false);

    const toggleLayer = useCallback(
        (layer: CelestialType) => {
            onSettingsChange((prev) => ({
                ...prev,
                objects: {
                    ...prev.objects,
                    [layer]: !prev.objects[layer],
                },
            }));
        },
        [onSettingsChange]
    );

    const setMode = useCallback(
        (mode: MapMode) => {
            onSettingsChange((prev) => ({ ...prev, mode }));
        },
        [onSettingsChange]
    );

    return (
        <div className={styles.wrapper}>
            <Popover
                open={open}
                onOpenChange={setOpen}
                trigger={
                    <MapSettingsButton
                        open={open}
                        onToggle={() => setOpen((o) => !o)}
                    />
                }
                placement="top"
                offset={8}
                contentClassName={styles.popover}
            >
                <MapSettingsPopover
                    settings={settings}
                    onModeChange={setMode}
                    onToggleLayer={toggleLayer}
                />
            </Popover>
        </div>
    );
}
