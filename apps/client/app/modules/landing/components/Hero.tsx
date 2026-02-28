"use client";

import { Typography } from "@packages/react-ui";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface HeroProps {
	description: string;
	title: string;
}

export default function Hero({ title, description }: HeroProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const { scrollY } = useScroll();

	const yGlow = useTransform(scrollY, [0, 800], [0, 60]);
	const opacityGlow = useTransform(scrollY, [0, 600], [1, 0]);

	return (
		<section
			ref={containerRef}
			className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#010309]"
		>
			<div className="absolute inset-0 z-[2] opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

			<motion.div
				style={{ y: yGlow, opacity: opacityGlow }}
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
			>
				<div className="h-[650px] w-[650px] bg-orange-600/10 blur-[120px] rounded-full animate-[pulse_15s_infinite_ease-in-out]" />

				<div className="absolute inset-0 m-auto h-[350px] w-[350px] bg-yellow-500/15 blur-[80px] rounded-full" />

				<div className="absolute inset-0 m-auto h-[180px] w-[180px] bg-yellow-200/30 blur-[50px] rounded-full opacity-80" />

				<div className="absolute inset-0 m-auto h-24 w-24 bg-white blur-[30px] rounded-full" />
				<div className="absolute inset-0 m-auto h-12 w-12 bg-white blur-[10px] rounded-full shadow-[0_0_60px_20px_rgba(255,255,255,0.4)]" />
			</motion.div>

			<div className="relative z-10 flex flex-col items-center justify-center px-6 max-w-5xl w-full text-center">
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

			<div className="absolute bottom-0 left-0 w-full h-[35vh] bg-linear-to-t from-[#010309] via-[#010309]/50 to-transparent z-[5]" />
		</section>
	);
}
