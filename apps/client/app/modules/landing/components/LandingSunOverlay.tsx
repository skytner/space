"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

import { SupernovaScrollSun } from "./SupernovaScrollSun";

const MAP_PATH = "/map?fromLanding=1&goToMap=1";

export interface LandingSunOverlayProps {
	onBlendChange?: (enable: boolean) => void;
	anchorZonePx?: number;
}

export function LandingSunOverlay({ onBlendChange, anchorZonePx = 350 }: LandingSunOverlayProps) {
	const hasNavigatedToMap = useRef(false);
	const thresholdRef = useRef(0);
	const router = useRouter();
	const { scrollY } = useScroll();

	const updateThreshold = useCallback(() => {
		if (typeof document === "undefined") return;
		thresholdRef.current =
			document.documentElement.scrollHeight - window.innerHeight - anchorZonePx;
	}, [anchorZonePx]);

	useEffect(() => {
		updateThreshold();
		window.addEventListener("resize", updateThreshold);
		return () => window.removeEventListener("resize", updateThreshold);
	}, [updateThreshold]);

	useMotionValueEvent(scrollY, "change", (latest) => {
		updateThreshold();
		if (hasNavigatedToMap.current || latest < thresholdRef.current) return;
		hasNavigatedToMap.current = true;
		router.push(MAP_PATH);
	});

	return <SupernovaScrollSun onBlendChange={onBlendChange} />;
}
