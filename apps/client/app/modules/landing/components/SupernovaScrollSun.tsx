"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";

const SCROLL_RANGE = 1800;
const SPRING_CONFIG = { stiffness: 80, damping: 28 };

const GOLD = "#FFCC33";
const GOLD_HIGHLIGHT = "#FFE484";
const WHITE = "#FFFFFF";

export interface SupernovaScrollSunProps {
	onBlendChange?: (enable: boolean) => void;
}

export function SupernovaScrollSun({ onBlendChange }: SupernovaScrollSunProps) {
	const { scrollY } = useScroll();

	const progress = useTransform(scrollY, (y) => Math.min(y / SCROLL_RANGE, 1));
	const smoothProgress = useSpring(progress, SPRING_CONFIG);

	const scale = useTransform(
		smoothProgress,
		[0, 0.03, 0.08, 0.22, 0.45, 0.62, 0.75, 0.85, 0.92, 0.97, 1],
		[0, 0.75, 0.78, 0.95, 1.15, 1.4, 1.8, 3, 8, 40, 220],
	);
	const scaleGlow = useTransform(
		smoothProgress,
		[0, 0.03, 0.08, 0.22, 0.45, 0.62, 0.75, 0.85, 0.92, 0.97, 1],
		[0, 0.7, 0.73, 0.9, 1.1, 1.35, 1.7, 2.8, 7, 38, 200],
	);
	const y = useTransform(
		smoothProgress,
		[0, 0.03, 0.25, 0.5, 0.7, 0.85, 1],
		[0, 0, 15, 35, 55, 70, 85],
	);
	const opacity = useTransform(
		smoothProgress,
		[0, 0.03, 0.08, 0.25, 0.45, 0.65, 0.78, 0.88, 1],
		[0, 0, 0.06, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9],
	);
	const glowOpacity = useTransform(
		smoothProgress,
		[0, 0.03, 0.08, 0.25, 0.5, 0.75, 1],
		[0, 0, 0.05, 0.15, 0.45, 0.75, 1],
	);

	const coreColor = useTransform(
		smoothProgress,
		[0, 0.5, 0.8, 0.95, 1],
		["#b8860b", "#c99a0f", GOLD, "#FFE8A0", WHITE],
	);
	const glowColor = useTransform(
		smoothProgress,
		[0, 0.5, 0.8, 0.95, 1],
		["#8b6914", "#a07810", GOLD, "#FFF0B8", WHITE],
	);

	useMotionValueEvent(smoothProgress, "change", (v) => {
		onBlendChange?.(v > 0.85);
	});

	return (
		<div
			className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center"
			aria-hidden
		>
			<div
				className="pointer-events-none absolute inset-0 z-10 opacity-[0.05] mix-blend-overlay"
				style={{
					backgroundImage: "url(https://grainy-gradients.vercel.app/noise.svg)",
					backgroundRepeat: "repeat",
				}}
			/>

			<motion.div
				className="absolute left-1/2 top-1/2 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 origin-center"
				style={{ y, scale: scaleGlow, opacity: glowOpacity }}
			>
				<motion.div
					className="absolute inset-0 m-auto rounded-none"
					style={{
						width: 140,
						height: 140,
						left: "50%",
						top: "50%",
						marginLeft: -70,
						marginTop: -70,
						backgroundColor: glowColor,
						boxShadow: "0 0 36px 16px currentColor, 0 0 60px 24px currentColor",
						filter: "contrast(1.05) brightness(1.1)",
					}}
				/>
			</motion.div>

			<motion.div
				className="absolute left-1/2 top-1/2 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 origin-center"
				style={{ y, scale, opacity }}
			>
				<motion.div
					className="absolute inset-0 m-auto rounded-none"
					style={{
						width: 80,
						height: 80,
						left: "50%",
						top: "50%",
						marginLeft: -40,
						marginTop: -40,
						backgroundColor: coreColor,
						imageRendering: "pixelated" as React.CSSProperties["imageRendering"],
						boxShadow: `inset 0 0 12px ${GOLD_HIGHLIGHT}, 0 0 18px currentColor`,
						filter: "contrast(1.05) brightness(1.1)",
					}}
				/>
			</motion.div>
		</div>
	);
}
