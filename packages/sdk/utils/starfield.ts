export type Star = {
	x: number;
	y: number;
	size: number;
	opacity: number;
	twinkle?: number;
};

export type StarfieldOptions = {
	width: number;
	height: number;
	count?: number;
	minSize?: number;
	maxSize?: number;
	minOpacity?: number;
	maxOpacity?: number;
	normalized?: boolean;
	seed?: number;
};

const defaultOptions: Required<Omit<StarfieldOptions, "seed" | "width" | "height" | "normalized">> =
	{
		count: 120,
		minSize: 1,
		maxSize: 3,
		minOpacity: 0.2,
		maxOpacity: 0.9,
	};

function seeded(seed: number): () => number {
	return () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
}

export function createStarfield(options: StarfieldOptions): Star[] {
	const {
		width,
		height,
		count = defaultOptions.count,
		minSize = defaultOptions.minSize,
		maxSize = defaultOptions.maxSize,
		minOpacity = defaultOptions.minOpacity,
		maxOpacity = defaultOptions.maxOpacity,
		normalized = false,
		seed = 0.12345,
	} = options;

	const rnd = seeded(Math.floor(seed * 233280));
	const stars: Star[] = [];

	for (let i = 0; i < count; i++) {
		const x = rnd();
		const y = rnd();
		const size = minSize + rnd() * (maxSize - minSize);
		const opacity = minOpacity + rnd() * (maxOpacity - minOpacity);
		const twinkle = rnd();

		stars.push({
			x: normalized ? x : x * width,
			y: normalized ? y : y * height,
			size,
			opacity,
			twinkle,
		});
	}

	return stars;
}
