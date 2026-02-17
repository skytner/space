"use client";

import { Shared } from "@/modules";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
    className?: string;
    style?: React.CSSProperties;
};

const SPECTRAL_COLORS = [
    "#9bb0ff",
    "#aabfff",
    "#cad7ff",
    "#f8f7ff",
    "#fff4ea",
    "#ffd2a1",
    "#ffcc6f",
] as const;

type Star = {
    x: number;
    y: number;
    r: number;
    layer: 0 | 1 | 2;
    spectralIndex: number;
    phase: number;
    speed: number;
};

function generateStarsForTile(tileW: number, tileH: number, tileI: number, tileJ: number): Star[] {
    const seed = Shared.xmur3(`${tileI},${tileJ}`)();
    const rng = Shared.splitmix32(seed);
    const starCount = Math.floor((tileW * tileH) / 1200);
    const stars: Star[] = [];

    const pickSpectral = (): number => {
        const u = rng();
        if (u < 0.35) return 6;
        if (u < 0.55) return 5;
        if (u < 0.72) return 4;
        if (u < 0.85) return 3;
        if (u < 0.93) return 2;
        if (u < 0.98) return 1;
        return 0;
    };

    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: rng() * tileW,
            y: rng() * tileH,
            r: 0.4 + rng() * 0.6,
            layer: 0,
            spectralIndex: pickSpectral(),
            phase: rng() * Math.PI * 2,
            speed: 0.5 + rng() * 1.2,
        });
    }
    for (let i = 0; i < starCount * 0.25; i++) {
        stars.push({
            x: rng() * tileW,
            y: rng() * tileH,
            r: 0.8 + rng() * 0.8,
            layer: 1,
            spectralIndex: pickSpectral(),
            phase: rng() * Math.PI * 2,
            speed: 0.5 + rng() * 1.2,
        });
    }
    for (let i = 0; i < starCount * 0.05; i++) {
        stars.push({
            x: rng() * tileW,
            y: rng() * tileH,
            r: 1 + rng() * 1.2,
            layer: 2,
            spectralIndex: pickSpectral(),
            phase: rng() * Math.PI * 2,
            speed: 0.5 + rng() * 1.2,
        });
    }
    return stars;
}

const SHOW_GRID = true;

function drawSpaceMap(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    pixelRatio: number,
    panX: number,
    panY: number,
    getStarsForTile: (tileI: number, tileJ: number) => Star[],
    tileW: number,
    tileH: number,
    showGrid: boolean,
    timeSec: number
) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(pixelRatio, pixelRatio);
    ctx.clearRect(0, 0, width, height);
    ctx.translate(-panX, -panY);

    const cx = panX + width / 2;
    const cy = panY + height / 2;
    const maxR = Math.max(width, height) * 0.8;

    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    bg.addColorStop(0, "#060606");
    bg.addColorStop(0.6, "#0a0a0a");
    bg.addColorStop(1, "#0e0e0e");
    ctx.fillStyle = bg;
    ctx.fillRect(panX, panY, width, height);

    const iMin = Math.floor(panX / tileW) - 1;
    const iMax = Math.ceil((panX + width) / tileW) + 1;
    const jMin = Math.floor(panY / tileH) - 1;
    const jMax = Math.ceil((panY + height) / tileH) + 1;

    for (let layer = 0; layer <= 2; layer++) {
        for (let ti = iMin; ti <= iMax; ti++) {
            for (let tj = jMin; tj <= jMax; tj++) {
                const stars = getStarsForTile(ti, tj);
                for (const star of stars) {
                    if (star.layer !== layer) continue;
                    const twinkle = 0.5 + 0.5 * Math.sin(timeSec * star.speed + star.phase);
                    const alpha = 0.35 + 0.65 * twinkle;
                    const x = star.x + ti * tileW;
                    const y = star.y + tj * tileH;
                    const hex = SPECTRAL_COLORS[star.spectralIndex] ?? SPECTRAL_COLORS[2];
                    ctx.save();
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = hex;
                    ctx.beginPath();
                    ctx.arc(x, y, star.r, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }
        }
    }

    if (showGrid) {
        const gridStep = 48;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 1;
        const xStart = Math.floor(panX / gridStep) * gridStep;
        const xEnd = panX + width + gridStep;
        const yStart = Math.floor(panY / gridStep) * gridStep;
        const yEnd = panY + height + gridStep;
        for (let x = xStart; x <= xEnd; x += gridStep) {
            ctx.beginPath();
            ctx.moveTo(x, yStart);
            ctx.lineTo(x, yEnd);
            ctx.stroke();
        }
        for (let y = yStart; y <= yEnd; y += gridStep) {
            ctx.beginPath();
            ctx.moveTo(xStart, y);
            ctx.lineTo(xEnd, y);
            ctx.stroke();
        }
    }

    ctx.restore();
}

const VELOCITY_HISTORY_MS = 80;
const INERTIA_FRICTION = 0.92;
const INERTIA_MIN_SPEED = 0.15;

export function CanvasMap({ className, style }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const panRef = useRef({ x: 0, y: 0 });
    const tileCacheRef = useRef<{ tileW: number; tileH: number; tiles: Map<string, Star[]> } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const isDraggingRef = useRef(false);
    const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
    const velocityHistoryRef = useRef<{ t: number; x: number; y: number }[]>([]);
    const inertiaRafRef = useRef<number | null>(null);
    const touchIdRef = useRef<number | null>(null);

    const draw = useCallback(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const rect = container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        if (width <= 0 || height <= 0) return;

        let cache = tileCacheRef.current;
        if (!cache || cache.tileW !== width || cache.tileH !== height) {
            cache = { tileW: width, tileH: height, tiles: new Map() };
            tileCacheRef.current = cache;
        }
        const getStarsForTile = (tileI: number, tileJ: number): Star[] => {
            const key = `${tileI},${tileJ}`;
            if (!cache!.tiles.has(key)) {
                cache!.tiles.set(key, generateStarsForTile(cache!.tileW, cache!.tileH, tileI, tileJ));
            }
            return cache!.tiles.get(key)!;
        };

        const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { x: panX, y: panY } = panRef.current;
        const timeSec = typeof performance !== "undefined" ? performance.now() * 0.001 : 0;
        drawSpaceMap(ctx, width, height, dpr, panX, panY, getStarsForTile, cache.tileW, cache.tileH, SHOW_GRID, timeSec);
    }, []);

    const requestDraw = useCallback(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const rect = container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        if (width <= 0 || height <= 0) return;

        let cache = tileCacheRef.current;
        if (!cache || cache.tileW !== width || cache.tileH !== height) {
            draw();
            return;
        }
        const getStarsForTile = (tileI: number, tileJ: number): Star[] => {
            const key = `${tileI},${tileJ}`;
            if (!cache!.tiles.has(key)) {
                cache!.tiles.set(key, generateStarsForTile(cache!.tileW, cache!.tileH, tileI, tileJ));
            }
            return cache!.tiles.get(key)!;
        };

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
        const { x: panX, y: panY } = panRef.current;
        const timeSec = typeof performance !== "undefined" ? performance.now() * 0.001 : 0;
        drawSpaceMap(ctx, width, height, dpr, panX, panY, getStarsForTile, cache.tileW, cache.tileH, SHOW_GRID, timeSec);
    }, [draw]);

    useEffect(() => {
        draw();
        const container = containerRef.current;
        if (!container) return;
        const ro = new ResizeObserver(draw);
        ro.observe(container);
        return () => ro.disconnect();
    }, [draw]);

    useEffect(() => {
        let rafId: number;
        const tick = () => {
            requestDraw();
            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [requestDraw]);

    const getPoint = useCallback((e: React.MouseEvent | MouseEvent) => {
        const container = containerRef.current;
        if (!container) return { x: 0, y: 0 };
        const rect = container.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }, []);

    const getPointFromTouch = useCallback((clientX: number, clientY: number) => {
        const container = containerRef.current;
        if (!container) return { x: 0, y: 0 };
        const rect = container.getBoundingClientRect();
        return { x: clientX - rect.left, y: clientY - rect.top };
    }, []);

    const updatePanFromPoint = useCallback(
        (pt: { x: number; y: number }) => {
            const start = dragStartRef.current;
            panRef.current = {
                x: start.panX + (start.x - pt.x),
                y: start.panY + (start.y - pt.y),
            };
        },
        []
    );

    const pushVelocitySample = useCallback(() => {
        const now = Date.now();
        const hist = velocityHistoryRef.current;
        hist.push({ t: now, x: panRef.current.x, y: panRef.current.y });
        while (hist.length > 1 && now - hist[0]!.t > VELOCITY_HISTORY_MS) hist.shift();
    }, []);

    const getVelocityAndStartInertia = useCallback(() => {
        const hist = velocityHistoryRef.current;
        velocityHistoryRef.current = [];
        if (hist.length < 2) return;
        const first = hist[0]!;
        const last = hist[hist.length - 1]!;
        const dt = (last.t - first.t) / 1000;
        if (dt <= 0) return;
        const vx = (last.x - first.x) / dt;
        const vy = (last.y - first.y) / dt;
        const speed = Math.hypot(vx, vy);
        if (speed < INERTIA_MIN_SPEED) return;

        const runInertia = () => {
            let vx = (last.x - first.x) / dt;
            let vy = (last.y - first.y) / dt;
            let lastT = performance.now() / 1000;

            const tick = () => {
                const now = performance.now() / 1000;
                const frameDt = now - lastT;
                lastT = now;
                panRef.current.x += vx * frameDt;
                panRef.current.y += vy * frameDt;
                vx *= INERTIA_FRICTION;
                vy *= INERTIA_FRICTION;
                requestDraw();
                if (Math.abs(vx) > INERTIA_MIN_SPEED || Math.abs(vy) > INERTIA_MIN_SPEED) {
                    inertiaRafRef.current = requestAnimationFrame(tick);
                }
            };
            inertiaRafRef.current = requestAnimationFrame(tick);
        };
        runInertia();
    }, [requestDraw]);

    const onPointerDown = useCallback(
        (e: React.MouseEvent) => {
            if (e.button !== 0) return;
            if (inertiaRafRef.current != null) {
                cancelAnimationFrame(inertiaRafRef.current);
                inertiaRafRef.current = null;
            }
            isDraggingRef.current = true;
            setIsDragging(true);
            velocityHistoryRef.current = [];
            const pt = getPoint(e);
            dragStartRef.current = {
                x: pt.x,
                y: pt.y,
                panX: panRef.current.x,
                panY: panRef.current.y,
            };
        },
        [getPoint]
    );

    const onTouchStart = useCallback(
        (e: React.TouchEvent) => {
            if (e.touches.length !== 1) return;
            if (inertiaRafRef.current != null) {
                cancelAnimationFrame(inertiaRafRef.current);
                inertiaRafRef.current = null;
            }
            const touch = e.touches[0]!;
            touchIdRef.current = touch.identifier;
            isDraggingRef.current = true;
            setIsDragging(true);
            velocityHistoryRef.current = [];
            const pt = getPointFromTouch(touch.clientX, touch.clientY);
            dragStartRef.current = {
                x: pt.x,
                y: pt.y,
                panX: panRef.current.x,
                panY: panRef.current.y,
            };
        },
        [getPointFromTouch]
    );

    useEffect(() => {
        if (typeof window === "undefined") return;

        const onMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;
            const pt = getPoint(e);
            updatePanFromPoint(pt);
            pushVelocitySample();
            requestDraw();
        };

        const onUp = () => {
            if (!isDraggingRef.current) return;
            isDraggingRef.current = false;
            setIsDragging(false);
            getVelocityAndStartInertia();
        };

        const onTouchMove = (e: TouchEvent) => {
            if (!isDraggingRef.current || touchIdRef.current == null) return;
            const touch = Array.from(e.touches).find((t) => t.identifier === touchIdRef.current);
            if (!touch) return;
            e.preventDefault();
            const pt = getPointFromTouch(touch.clientX, touch.clientY);
            updatePanFromPoint(pt);
            pushVelocitySample();
            requestDraw();
        };

        const onTouchEnd = (e: TouchEvent) => {
            if (e.touches.length === 0) {
                if (isDraggingRef.current) {
                    isDraggingRef.current = false;
                    setIsDragging(false);
                    getVelocityAndStartInertia();
                }
                touchIdRef.current = null;
            } else if (touchIdRef.current != null) {
                const stillDown = Array.from(e.touches).some((t) => t.identifier === touchIdRef.current);
                if (!stillDown) touchIdRef.current = null;
            }
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onTouchEnd, { passive: true });
        window.addEventListener("touchcancel", onTouchEnd, { passive: true });
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("touchcancel", onTouchEnd);
            if (inertiaRafRef.current != null) cancelAnimationFrame(inertiaRafRef.current);
        };
    }, [getPoint, getPointFromTouch, updatePanFromPoint, pushVelocitySample, getVelocityAndStartInertia, requestDraw]);

    return (
        <div
            ref={containerRef}
            className={className}
            role="application"
            aria-label="Карта"
            onMouseDown={onPointerDown}
            onTouchStart={onTouchStart}
            style={{
                position: "absolute",
                inset: 0,
                cursor: isDragging ? "grabbing" : "grab",
                touchAction: "none",
                ...style,
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    verticalAlign: "top",
                    pointerEvents: "none",
                }}
            />
        </div>
    );
}
