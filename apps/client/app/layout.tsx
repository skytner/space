import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { MswProvider } from "./msw-provider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
	display: "swap",
	subsets: ["latin", "latin-ext"],
	variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
	display: "swap",
	subsets: ["latin", "cyrillic"],
	variable: "--font-mono",
});

export const metadata: Metadata = {
	title: "Pulsar — Deep Space",
	description:
		"A next-gen space mod built for depth. Engineer orbital systems, explore uncharted worlds, and progress through a universe designed to challenge you.",
	keywords: [
		"Minecraft space mod",
		"Pulsar mod",
		"Minecraft orbital engineering",
		"Minecraft planets exploration",
		"Minecraft tech mod",
		"Minecraft space exploration",
	],
	openGraph: {
		title: "Pulsar — The Frontier Starts Here",
		description:
			"Engineer. Explore. Evolve. A space mod with real depth — from orbital mechanics to alien worlds.",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const isDev = process.env.NODE_ENV === "development";
	return (
		<html lang="en">
			<body className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} cursor-none`}>
				{isDev ? <MswProvider>{children}</MswProvider> : children}
			</body>
		</html>
	);
}
