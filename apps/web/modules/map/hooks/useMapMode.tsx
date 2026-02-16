'use client'
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { MapMode } from "../types/mode";

type MapModeContextType = {
    mapMode: MapMode;
    setMapMode: (mode: MapMode) => void;
};

const MapModeContext = createContext<MapModeContextType | undefined>(undefined);

export function MapModeProvider({ children }: { children: ReactNode }) {
    const [mapMode, setMapMode] = useState<MapMode>('2d');
    return (
        <MapModeContext.Provider value={{ mapMode, setMapMode }}>
            {children}
        </MapModeContext.Provider>
    );
}

export function useMapMode() {
    const context = useContext(MapModeContext);
    if (!context) {
        throw new Error("useMapMode must be used within a MapModeProvider");
    }
    return context;
}