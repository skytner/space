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
	title: "Spacecraft | Next‑Gen Space Mod",
	description:
		"Experience the ultimate frontier. Orbital engineering, celestial exploration, and deep progression in a modern Minecraft space odyssey.",
	keywords: [
		"Minecraft space mod",
		"Spacecraft mod",
		"Orbital engineering",
		"Minecraft planets",
		"Next-gen Minecraft mods",
	],
	openGraph: {
		title: "Spacecraft | Touch the Stars",
		description:
			"A feature-rich space exploration mod with realistic technology and uncharted worlds.",
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
