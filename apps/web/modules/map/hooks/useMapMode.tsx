"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { MapMode } from "../types/mode";

type MapModeContextType = {
    mapMode: MapMode;
    setMapMode: (mode: MapMode) => void;
};

const MapModeContext = createContext<MapModeContextType | undefined>(undefined);

type MapModeProviderProps = {
    mode: MapMode;
    setMode: (mode: MapMode) => void;
    children: ReactNode;
};

export function MapModeProvider({ mode, setMode, children }: MapModeProviderProps) {
    return (
        <MapModeContext.Provider value={{ mapMode: mode, setMapMode: setMode }}>
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