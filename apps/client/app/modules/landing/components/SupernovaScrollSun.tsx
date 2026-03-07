"use client";

import {
	type MotionValue,
	motion,
	useMotionValueEvent,
	useScroll,
	useSpring,
	useTransform,
} from "motion/react";

const SCROLL_RANGE = 1800;
const SPRING_CONFIG = { stiffness: 80, damping: 28 };

export interface SupernovaScrollSunProps {
	onBlendChange?: (enable: boolean) => void;
	scrollY?: MotionValue<number>;
}

export function SupernovaScrollSun({
	onBlendChange,
	scrollY: scrollYProp,
}: SupernovaScrollSunProps) {
	const { scrollY: ownScrollY } = useScroll();
	const scrollY = scrollYProp ?? ownScrollY;

	const progress = useTransform(scrollY, (y) => Math.min(y / SCROLL_RANGE, 1));
	const smoothProgress = useSpring(progress, SPRING_CONFIG);

	const scale = useTransform(
		smoothProgress,
		[0, 0.03, 0.08, 0.22, 0.45, 0.62, 0.75, 0.85, 0.92, 0.97, 1],
		[0, 0.75, 0.78, 0.95, 1.15, 1.4, 1.8, 3, 8, 25, 50],
	);
	const scaleGlow = useTransform(
		smoothProgress,
		[0, 0.03, 0.08, 0.22, 0.45, 0.62, 0.75, 0.85, 0.92, 0.97, 1],
		[0, 0.7, 0.73, 0.9, 1.1, 1.35, 1.7, 2.8, 7, 23, 45],
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

	const whiteOverlayOpacity = useTransform(smoothProgress, [0.5, 1], [0, 1]);

	useMotionValueEvent(smoothProgress, "change", (v) => {
		onBlendChange?.(v > 0.85);
	});

	return (
		<div
			className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center"
			aria-hidden
		>
			<motion.div
				className="absolute left-1/2 top-1/2 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 origin-center"
				style={{
					y,
					scale: scaleGlow,
					opacity: glowOpacity,
					willChange: "transform, opacity",
				}}
			>
				<div
					style={{
						position: "absolute",
						width: 280,
						height: 280,
						left: "50%",
						top: "50%",
						marginLeft: -140,
						marginTop: -140,
						borderRadius: "50%",
						background: "radial-gradient(circle, #FFCC33 0%, #FFAA0088 40%, transparent 70%)",
					}}
				/>
				<motion.div
					style={{
						position: "absolute",
						width: 280,
						height: 280,
						left: "50%",
						top: "50%",
						marginLeft: -140,
						marginTop: -140,
						borderRadius: "50%",
						background: "radial-gradient(circle, #FFFFFF 0%, #FFFFFF88 40%, transparent 70%)",
						opacity: whiteOverlayOpacity,
					}}
				/>
			</motion.div>

			<motion.div
				className="absolute left-1/2 top-1/2 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 origin-center"
				style={{
					y,
					scale,
					opacity,
					willChange: "transform, opacity",
				}}
			>
				<div
					style={{
						position: "absolute",
						width: 80,
						height: 80,
						left: "50%",
						top: "50%",
						marginLeft: -40,
						marginTop: -40,
						backgroundColor: "#FFCC33",
						imageRendering: "pixelated" as React.CSSProperties["imageRendering"],
					}}
				/>
				<motion.div
					style={{
						position: "absolute",
						width: 80,
						height: 80,
						left: "50%",
						top: "50%",
						marginLeft: -40,
						marginTop: -40,
						backgroundColor: "#FFFFFF",
						opacity: whiteOverlayOpacity,
					}}
				/>
			</motion.div>
		</div>
	);
}
