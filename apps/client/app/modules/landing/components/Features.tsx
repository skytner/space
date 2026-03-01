"use client";

import { MagneticWrapper } from "@packages/react-ui";
import { useState } from "react";
import { FeatureCard } from "./FeatureCard";
import type { FeatureItem } from "./FeatureDetailOverlay";
import { FeatureDetailOverlay } from "./FeatureDetailOverlay";

interface Props {
	features: FeatureItem[];
}

export default function Features({ features }: Props) {
	const [journey, tech, realms] = features;
	const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null);

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
					{journey && (
						<MagneticWrapper className="md:col-span-5 md:row-span-2 h-full w-full">
							<FeatureCard
								id={journey.id}
								title={journey.title}
								description={journey.description}
								image={journey.image}
								className="h-full"
								onClick={() => setSelectedFeature(journey)}
							/>
						</MagneticWrapper>
					)}

					{tech && (
						<MagneticWrapper className="md:col-span-7 md:row-span-1 h-full w-full">
							<FeatureCard
								id={tech.id}
								title={tech.title}
								description={tech.description}
								image={tech.image}
								className="h-full"
								onClick={() => setSelectedFeature(tech)}
							/>
						</MagneticWrapper>
					)}

					{realms && (
						<MagneticWrapper className="md:col-span-7 md:row-span-1 h-full w-full">
							<FeatureCard
								id={realms.id}
								title={realms.title}
								description={realms.description}
								image={realms.image}
								className="h-full"
								onClick={() => setSelectedFeature(realms)}
							/>
						</MagneticWrapper>
					)}
				</div>
			</div>

			{/* Оверлей по клику: shared layout (layoutId) как в App Store */}
			<FeatureDetailOverlay feature={selectedFeature} onClose={() => setSelectedFeature(null)} />
		</section>
	);
}
