"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
    className?: string;
    style?: React.CSSProperties;
};

function mulberry32(seed: number) {
    return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

type Star = { x: number; y: number; r: number; layer: 0 | 1 | 2 };

function generateStars(tileW: number, tileH: number): Star[] {
    const rng = mulberry32(42);
    const starCount = Math.floor((tileW * tileH) / 1200);
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: rng() * tileW,
            y: rng() * tileH,
            r: 0.4 + rng() * 0.6,
            layer: 0,
        });
    }
    for (let i = 0; i < starCount * 0.25; i++) {
        stars.push({
            x: rng() * tileW,
            y: rng() * tileH,
            r: 0.8 + rng() * 0.8,
            layer: 1,
        });
    }
    for (let i = 0; i < starCount * 0.05; i++) {
        stars.push({
            x: rng() * tileW,
            y: rng() * tileH,
            r: 1 + rng() * 1.2,
            layer: 2,
        });
    }
    return stars;
}

function drawSpaceMap(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    pixelRatio: number,
    panX: number,
    panY: number,
    stars: Star[],
    tileW: number,
    tileH: number
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
    bg.addColorStop(0, "#0a0b0f");
    bg.addColorStop(0.6, "#0d0e14");
    bg.addColorStop(1, "#12141c");
    ctx.fillStyle = bg;
    ctx.fillRect(panX, panY, width, height);

    const iMin = Math.floor(panX / tileW) - 1;
    const iMax = Math.ceil((panX + width) / tileW) + 1;
    const jMin = Math.floor(panY / tileH) - 1;
    const jMax = Math.ceil((panY + height) / tileH) + 1;

    const layerStyles = [
        "rgba(255, 255, 255, 0.4)",
        "rgba(255, 255, 255, 0.7)",
        "rgba(255, 255, 255, 0.95)",
    ] as const;

    for (let layer = 0; layer <= 2; layer++) {
        ctx.fillStyle = layerStyles[layer as 0 | 1 | 2];
        for (const star of stars) {
            if (star.layer !== layer) continue;
            for (let i = iMin; i <= iMax; i++) {
                for (let j = jMin; j <= jMax; j++) {
                    const x = star.x + i * tileW;
                    const y = star.y + j * tileH;
                    ctx.beginPath();
                    ctx.arc(x, y, star.r, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }

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

    ctx.restore();
}

export function CanvasMap({ className, style }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const panRef = useRef({ x: 0, y: 0 });
    const starCacheRef = useRef<{ tileW: number; tileH: number; stars: Star[] } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const isDraggingRef = useRef(false);
    const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

    const draw = useCallback(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const rect = container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        if (width <= 0 || height <= 0) return;

        let cache = starCacheRef.current;
        if (!cache || cache.tileW !== width || cache.tileH !== height) {
            cache = { tileW: width, tileH: height, stars: generateStars(width, height) };
            starCacheRef.current = cache;
        }

        const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { x: panX, y: panY } = panRef.current;
        drawSpaceMap(ctx, width, height, dpr, panX, panY, cache.stars, cache.tileW, cache.tileH);
    }, []);

    const requestDraw = useCallback(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const rect = container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        if (width <= 0 || height <= 0) return;

        let cache = starCacheRef.current;
        if (!cache || cache.tileW !== width || cache.tileH !== height) {
            draw();
            return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
        const { x: panX, y: panY } = panRef.current;
        drawSpaceMap(ctx, width, height, dpr, panX, panY, cache.stars, cache.tileW, cache.tileH);
    }, [draw]);

    useEffect(() => {
        draw();
        const container = containerRef.current;
        if (!container) return;
        const ro = new ResizeObserver(draw);
        ro.observe(container);
        return () => ro.disconnect();
    }, [draw]);

    const getPoint = useCallback((e: React.MouseEvent | MouseEvent) => {
        const container = containerRef.current;
        if (!container) return { x: 0, y: 0 };
        const rect = container.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }, []);

    const onPointerDown = useCallback(
        (e: React.MouseEvent) => {
            if (e.button !== 0) return;
            isDraggingRef.current = true;
            setIsDragging(true);
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

    useEffect(() => {
        if (typeof window === "undefined") return;

        const onMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;
            const pt = getPoint(e);
            const start = dragStartRef.current;
            panRef.current = {
                x: start.panX + (start.x - pt.x),
                y: start.panY + (start.y - pt.y),
            };
            requestDraw();
        };

        const onUp = () => {
            isDraggingRef.current = false;
            setIsDragging(false);
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, [getPoint, requestDraw]);

    return (
        <div
            ref={containerRef}
            className={className}
            role="application"
            aria-label="Карта"
            onMouseDown={onPointerDown}
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
