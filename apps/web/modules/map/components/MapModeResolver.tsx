import { useMapMode } from "../hooks/useMapMode";
import { CanvasMap } from "./CanvasMap";

export function MapModeResolver() {
    const { mapMode } = useMapMode()

    return mapMode === '2d' ? (
        <CanvasMap />
    ) : (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                minHeight: 300,
                color: "#bbb",
                background: "rgba(24,28,32,0.7)",
                borderRadius: 16,
                margin: 40,
                boxShadow: "0 2px 24px rgba(0,0,0,0.08)",
                fontFamily: 'inherit',
            }}
        >
            <span style={{ fontSize: 48, fontWeight: 700, marginBottom: 8, letterSpacing: 2 }}>
                3D WILL SOON
            </span>
        </div>
    );
}