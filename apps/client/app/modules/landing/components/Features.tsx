"use client";

import { MagneticWrapper } from "@packages/react-ui";
import { useEffect, useState } from "react";
import { FeatureCard } from "./FeatureCard";
import type { FeatureItem } from "./FeatureDetailOverlay";
import { FeatureDetailOverlay } from "./FeatureDetailOverlay";

interface Props {
  features: FeatureItem[];
}

export default function Features({ features }: Props) {
  const [journey, tech, realms] = features;
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(
    null,
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const renderCard = (
    feature: FeatureItem | undefined,
    gridClassName: string,
  ) => {
    if (!feature) return null;

    const card = (
      <FeatureCard
        id={feature.id}
        title={feature.title}
        description={feature.description}
        image={feature.image}
        className="h-full"
        enableLayoutAnimation={!isMobile}
        onClick={() => setSelectedFeature(feature)}
      />
    );

    if (isMobile) {
      return (
        <div key={feature.id} className={`${gridClassName} h-full w-full`}>
          {card}
        </div>
      );
    }

    return (
      <MagneticWrapper
        key={feature.id}
        className={`${gridClassName} h-full w-full`}
      >
        {card}
      </MagneticWrapper>
    );
  };

  return (
    <section className="relative w-full py-32 flex flex-col items-center justify-center">
      <div className="absolute inset-0 z-0 bg-[#010309]" aria-hidden />
      <div className="relative z-20 max-w-7xl w-full px-6">
        <div className="mb-16 text-center">
          <h2 className="text-amber-500 font-mono text-xs md:text-sm tracking-[0.4em] uppercase mb-4 opacity-80">
            Core Mechanics
          </h2>
          <p className="text-4xl md:text-6xl font-black text-white tracking-tighter italic">
            Redefining Space Exploration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[320px]">
          {renderCard(journey, "md:col-span-5 md:row-span-2")}
          {renderCard(tech, "md:col-span-7 md:row-span-1")}
          {renderCard(realms, "md:col-span-7 md:row-span-1")}
        </div>
      </div>

      <FeatureDetailOverlay
        feature={selectedFeature}
        enableLayoutAnimation={!isMobile}
        onClose={() => setSelectedFeature(null)}
      />
    </section>
  );
}
