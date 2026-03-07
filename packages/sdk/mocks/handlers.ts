import { HttpResponse, http } from "msw";

/** Mock landing content (can later come from API). */
const landingContent = {
	title: "Spacecraft",
	description:
		"A modern, feature‑rich space mod with deep progression, technology, and entirely new planets to discover.",
	features: [
		{
			id: "progression",
			title: "Grand Journey",
			description:
				"Experience a deep evolution system that rewards long-term exploration and mastery of the cosmos.",
		},
		{
			id: "tech",
			title: "Orbital Engineering",
			description:
				"Construct advanced spacecraft and automated systems using high-tech frontier mechanics.",
		},
		{
			id: "planets",
			title: "Celestial Realms",
			description:
				"Touch down on uncharted worlds, each with unique biomes, gravity, and ancient secrets.",
		},
	],
};

/**
 * MSW request handlers for dev. Use with setupWorker (browser) or setupServer (Node).
 * Import and spread: ...handlers
 */
export const handlers = [
	http.get("/api/landing", () => {
		return HttpResponse.json(landingContent);
	}),

	http.get("/api/health", () => {
		return HttpResponse.json({ status: "ok", timestamp: new Date().toISOString() });
	}),

	// Placeholder for future forum/map endpoints
	http.get("/api/map/regions", () => {
		return HttpResponse.json({ regions: [] });
	}),
];
