"use client";

import { Typography } from "@packages/react-ui";
import { createStarfield } from "@packages/sdk";
import { motion } from "motion/react";
import { useMemo, useRef } from "react";

interface HeroProps {
	description: string;
	title: string;
}

export default function Hero({ title, description }: HeroProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	const stars = useMemo(
		() =>
			createStarfield({
				width: 1,
				height: 1,
				count: 100,
				normalized: true,
				minSize: 1,
				maxSize: 2.5,
				minOpacity: 0.15,
				maxOpacity: 0.7,
			}),
		[],
	);

	return (
		<section
			ref={containerRef}
			className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
		>
			<div className="absolute inset-0 z-0 overflow-hidden bg-[#010309]" aria-hidden>
				<div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
				<div className="absolute inset-0 pointer-events-none overflow-hidden">
					{stars.map((star) => (
						<div
							key={star.x + star.y + star.size + star.opacity}
							className="absolute rounded-full bg-white"
							style={{
								left: `${star.x * 100}%`,
								top: `${star.y * 100}%`,
								width: star.size,
								height: star.size,
								opacity: star.opacity,
								transform: "translate(-50%, -50%)",
							}}
						/>
					))}
				</div>
				<div className="absolute bottom-0 left-0 w-full h-[35vh] bg-linear-to-t from-[#010309] via-[#010309]/50 to-transparent" />
			</div>

			<div className="relative z-20 flex flex-col items-center justify-center px-6 max-w-5xl w-full text-center min-h-screen">
				<motion.div
					initial={{ opacity: 0, y: 20, filter: "blur(15px)" }}
					animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
					transition={{ duration: 1.4, ease: [0.19, 1, 0.22, 1] }}
				>
					<Typography.H1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 bg-linear-to-b from-white via-white/90 to-white/20 bg-clip-text text-transparent leading-[1.05] pb-4">
						{title}
					</Typography.H1>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, duration: 1.2 }}
				>
					<Typography.Paragraph className="max-w-3xl mx-auto text-slate-300/80 text-xl md:text-3xl font-light leading-relaxed balance tracking-tight">
						{description}
					</Typography.Paragraph>
				</motion.div>
			</div>
		</section>
	);
}
