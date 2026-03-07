"use client";

import { SunGlow } from "@packages/react-ui";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const SUN_ENTRANCE_DURATION = 1.8;

function MapContent() {
  const searchParams = useSearchParams();
  const fromLanding = searchParams.get("fromLanding") === "1";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#010309]">
        <span className="text-white/60">Loading map…</span>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen w-full bg-[#010309]">
      {fromLanding && (
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          initial={{ scale: 8 }}
          animate={{ scale: 0.3 }}
          transition={{
            duration: SUN_ENTRANCE_DURATION,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <SunGlow scale={1} />
        </motion.div>
      )}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold text-white">Map</h1>
        <p className="mt-4 text-white/70">Map on WIP.</p>
      </div>
    </main>
  );
}

export default function MapPage() {
  return (
    // TODO: Sun loader
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#010309]">
          <span className="text-white/60">Loading map…</span>
        </div>
      }
    >
      <MapContent />
    </Suspense>
  );
}
