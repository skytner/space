"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { ReactNode, useRef } from "react";

export function MagneticWrapper({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const springConfig = { stiffness: 28, damping: 20, mass: 1 };
	const springX = useSpring(x, springConfig);
	const springY = useSpring(y, springConfig);

	const maxOffset = 10;

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!ref.current) return;
		const { clientX, clientY } = e;
		const rect = ref.current.getBoundingClientRect();

		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		let dx = (clientX - centerX) * 0.035;
		let dy = (clientY - centerY) * 0.035;
		dx = Math.max(-maxOffset, Math.min(maxOffset, dx));
		dy = Math.max(-maxOffset, Math.min(maxOffset, dy));
		x.set(dx);
		y.set(dy);

		window.dispatchEvent(
			new CustomEvent("cursor-change", {
				detail: { type: "magnetic", rect },
			}),
		);
	};

	const handleMouseLeave = () => {
		x.set(0);
		y.set(0);
		window.dispatchEvent(new CustomEvent("cursor-change", { detail: { type: "default" } }));
	};

	return (
		<motion.div
			ref={ref}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			style={{ x: springX, y: springY }}
			className={`relative ${className ?? ""}`}
		>
			{/* cursor-none только внутри, чтобы не мешать системе */}
			<div className="cursor-none h-full w-full">{children}</div>
		</motion.div>
	);
}
