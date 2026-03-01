"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

const targetSize = 36;

export function CustomCursor() {
	const mouseX = useMotionValue(-100);
	const mouseY = useMotionValue(-100);

	const targetWidth = useMotionValue(targetSize);
	const targetHeight = useMotionValue(targetSize);
	const targetRadius = useMotionValue(40);

	const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };

	const x = useSpring(mouseX, springConfig);
	const y = useSpring(mouseY, springConfig);
	const w = useSpring(targetWidth, springConfig);
	const h = useSpring(targetHeight, springConfig);
	const r = useSpring(targetRadius, springConfig);

	const [cursorType, setCursorType] = useState("default");

	useEffect(() => {
		const moveMouse = (e: MouseEvent) => {
			if (cursorType !== "magnetic") {
				mouseX.set(e.clientX);
				mouseY.set(e.clientY);
			}
		};

		const handleToggle = (e: Event) => {
			const { type, rect } = (e as CustomEvent<{ type: string; rect?: DOMRect }>).detail;
			setCursorType(type);

			if (type === "magnetic" && rect) {
				mouseX.set(rect.left + rect.width / 2);
				mouseY.set(rect.top + rect.height / 2);

				targetWidth.set(rect.width + 12);
				targetHeight.set(rect.height + 12);
				targetRadius.set(16);
			} else {
				targetWidth.set(targetSize);
				targetHeight.set(targetSize);
				targetRadius.set(40);
			}
		};

		window.addEventListener("mousemove", moveMouse);
		window.addEventListener("cursor-change", handleToggle);
		return () => {
			window.removeEventListener("mousemove", moveMouse);
			window.removeEventListener("cursor-change", handleToggle);
		};
	}, [cursorType, mouseX.set, mouseY.set, targetHeight.set, targetRadius.set, targetWidth.set]);

	return (
		<motion.div
			className="fixed top-0 left-0 pointer-events-none z-99999"
			style={{
				x,
				y,
				width: w,
				height: h,
				borderRadius: r,
				translateX: "-50%",
				translateY: "-50%",
				zIndex: 9999,
				position: "fixed",
			}}
			animate={{
				backgroundColor:
					cursorType === "magnetic" ? "rgba(140,140,140,0.05)" : "rgba(140,140,140,0.3)",
				backdropFilter: cursorType !== "magnetic" ? "blur(3px)" : "blur(0px)",
			}}
		/>
	);
}
