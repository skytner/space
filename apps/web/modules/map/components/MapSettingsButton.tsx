"use client";

import { forwardRef } from "react";
import { SlidersHorizontal } from "lucide-react";
import { MAP_SETTINGS_LABELS } from "../helpers/translations";
import styles from "../styles/MapSettings.module.css";
import { IconButton } from "@repo/ui/IconButton";

type MapSettingsButtonProps = {
    open: boolean;
    onToggle: () => void;
};

export const MapSettingsButton = forwardRef<HTMLButtonElement, MapSettingsButtonProps>(
    function MapSettingsButton({ open, onToggle }, ref) {
        return (
            <IconButton
                ref={ref}
                className={styles.trigger}
                onClick={onToggle}
                icon={<SlidersHorizontal size={20} aria-hidden />}
                ariaAttributes={{
                    "aria-expanded": open,
                    "aria-haspopup": "dialog",
                    "aria-label": MAP_SETTINGS_LABELS.mapSettings
                }}
            />
        );
    }
);
