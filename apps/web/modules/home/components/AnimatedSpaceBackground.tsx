"use client";

import { useCallback, useEffect, useRef } from "react";

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Star = { x: number; y: number; r: number; baseOpacity: number; phase: number; speed: number };

function generateStars(width: number, height: number): Star[] {
  const rng = mulberry32(13);
  const count = Math.min(400, Math.floor((width * height) / 800));
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rng() * width,
      y: rng() * height,
      r: 0.3 + rng() * 1.2,
      baseOpacity: 0.3 + rng() * 0.7,
      phase: rng() * Math.PI * 2,
      speed: 0.9 + rng() * 1.4,
    });
  }
  return stars;
}

export function AnimatedSpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w: width, h: height } = sizeRef.current;
    if (width <= 0 || height <= 0) return;

    ctx.fillStyle = "#0a0b0f";
    ctx.fillRect(0, 0, width, height);

    const t = performance.now() * 0.001 * 1.2;
    for (const s of starsRef.current) {
      const twinkle = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
      const opacity = s.baseOpacity * (0.15 + 0.85 * twinkle);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      sizeRef.current = { w, h };
      starsRef.current = generateStars(w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        zIndex: 0,
      }}
    />
  );
}
