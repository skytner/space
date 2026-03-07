"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

import { SupernovaScrollSun } from "./SupernovaScrollSun";

const MAP_PATH = "/map?fromLanding=1&goToMap=1";
const SESSION_KEY = "pulsar_navigated_to_map";

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

	// Restore threshold on resize
	useEffect(() => {
		updateThreshold();
		window.addEventListener("resize", updateThreshold);
		return () => window.removeEventListener("resize", updateThreshold);
	}, [updateThreshold]);

	// If the user came back from the map via the back button, the browser restores
	// the scroll position to the bottom of the page, which would immediately
	// re-trigger navigation. We detect this via sessionStorage, scroll to top,
	// and block the listener briefly until the page settles.
	useEffect(() => {
		if (!sessionStorage.getItem(SESSION_KEY)) return;

		sessionStorage.removeItem(SESSION_KEY);
		hasNavigatedToMap.current = true;
		window.scrollTo({ top: 0, behavior: "instant" });

		const t = setTimeout(() => {
			hasNavigatedToMap.current = false;
		}, 150);

		return () => clearTimeout(t);
	}, []);

	useMotionValueEvent(scrollY, "change", (latest) => {
		if (hasNavigatedToMap.current || latest < thresholdRef.current) return;
		hasNavigatedToMap.current = true;
		sessionStorage.setItem(SESSION_KEY, "1");
		router.push(MAP_PATH);
	});

	return <SupernovaScrollSun onBlendChange={onBlendChange} scrollY={scrollY} />;
}
