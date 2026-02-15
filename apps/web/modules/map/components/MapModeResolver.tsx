import { useMapMode } from "../hooks/useMapMode";
import { CanvasMap } from "./CanvasMap";

export function MapModeResolver() {
    const { mapMode } = useMapMode()

    return mapMode === '2d' ? <CanvasMap /> : "Soon"
}