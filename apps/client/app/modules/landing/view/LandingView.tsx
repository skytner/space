"use client";

import { CustomCursor } from "@packages/react-ui";
import landingContent from "public/contents/landing.json";
import { useState } from "react";

import Features from "../components/Features";
import Hero from "../components/Hero";
import { LandingSunOverlay } from "../components/LandingSunOverlay";

const SPACER_HEIGHT_PX = 900;

export default function LandingView() {
	const { title, description, features } = landingContent;
	const [blendContent, setBlendContent] = useState(false);

	return (
		<>
			<CustomCursor />
			<main
				className="relative flex flex-col items-center w-full bg-[#010309]"
				style={{
					mixBlendMode: blendContent ? "difference" : "normal",
				}}
			>
				<Hero title={title} description={description} />
				<Features features={features} />
				<section
					id="go-to-map"
					aria-hidden
					className="w-full bg-transparent"
					style={{ minHeight: SPACER_HEIGHT_PX }}
				/>
				<LandingSunOverlay onBlendChange={setBlendContent} />
			</main>
		</>
	);
}
