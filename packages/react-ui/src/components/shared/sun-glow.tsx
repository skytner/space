"use client";

import { type MotionValue, motion } from "motion/react";

export type SunGlowVariant = "circle" | "diamond";

interface SunGlowProps {
	/** Scale of the sun (e.g. from scroll). Default 1. */
	scale?: number | MotionValue<number>;
	/** Opacity 0..1, e.g. from scroll — в начале тускло, потом ярче. */
	opacity?: number | MotionValue<number>;
	/** Shape variant. Diamond reserved for map route. */
	variant?: SunGlowVariant;
	/** Optional image URL (e.g. /sun.png). Rendered in center. */
	imageSrc?: string;
	className?: string;
}

const shapeClass = {
	circle: "rounded-full",
	diamond: "rounded-none",
} as const;

const shapeStyle: Record<SunGlowVariant, { clipPath?: string }> = {
	circle: {},
	diamond: { clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" },
};

const sunContentClass = "absolute inset-0 m-auto flex size-[162.5px] items-center justify-center";

const SUN_LAYER_SIZE = 600;

function SunGlowContent({
	shape,
	clipStyle,
	imageSrc,
}: {
	shape: string;
	clipStyle: { clipPath?: string };
	imageSrc?: string;
}) {
	return (
		<>
			<div
				style={{ width: SUN_LAYER_SIZE, height: SUN_LAYER_SIZE }}
				className={`absolute inset-0 m-auto bg-amber-800/60 blur-[120px] animate-[pulse_15s_infinite_ease-in-out] ${shape}`}
			/>
			<div
				style={{ width: SUN_LAYER_SIZE, height: SUN_LAYER_SIZE }}
				className={`absolute inset-0 m-auto bg-orange-500/65 blur-[80px] ${shape}`}
			/>
			<div
				style={{ width: SUN_LAYER_SIZE, height: SUN_LAYER_SIZE }}
				className={`absolute inset-0 m-auto bg-amber-400/70 blur-[50px] ${shape}`}
			/>
			<div
				style={{ width: SUN_LAYER_SIZE, height: SUN_LAYER_SIZE }}
				className={`absolute inset-0 m-auto bg-yellow-300/80 blur-[30px] ${shape}`}
			/>
			<div
				style={{ width: SUN_LAYER_SIZE, height: SUN_LAYER_SIZE }}
				className={`absolute inset-0 m-auto bg-amber-200/90 blur-md shadow-[0_0_50px_20px_rgba(251,191,36,0.35)] ${shape}`}
			/>
			{imageSrc && (
				<img
					src={imageSrc}
					alt=""
					className={`absolute inset-0 m-auto size-full object-contain ${shape}`}
					style={clipStyle}
				/>
			)}
		</>
	);
}

export function SunGlow({
	scale = 1,
	opacity = 1,
	variant = "circle",
	imageSrc,
	className = "",
}: SunGlowProps) {
	const shape = shapeClass[variant];
	const clipStyle = shapeStyle[variant];
	const baseClass = `${sunContentClass} ${className}`.trim();
	const useMotion = typeof scale !== "number" || typeof opacity !== "number";

	const wrapperStyle = {
		...clipStyle,
		...(useMotion
			? undefined
			: {
					transform: `scale(${scale})`,
					opacity,
				}),
	};

	if (!useMotion) {
		return (
			<div className={baseClass} style={wrapperStyle} aria-hidden>
				<SunGlowContent shape={shape} clipStyle={clipStyle} imageSrc={imageSrc} />
			</div>
		);
	}

	return (
		<motion.div className={baseClass} style={{ ...clipStyle, scale, opacity }} aria-hidden>
			<SunGlowContent shape={shape} clipStyle={clipStyle} imageSrc={imageSrc} />
		</motion.div>
	);
}
