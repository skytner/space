"use client";

import { handlers } from "@packages/sdk/mocks";
import { setupWorker } from "msw/browser";
import { type ReactNode, useEffect, useState } from "react";

export function MswProvider({ children }: { children: ReactNode }) {
	const [_ready, setReady] = useState(false);

	// Worker создаём только здесь: на SSR setupWorker() падает (нужен браузер). См. SUN_AND_MAP.md
	useEffect(() => {
		if (typeof window === "undefined" || process.env.NODE_ENV !== "development") {
			setReady(true);
			return;
		}
		const worker = setupWorker(...handlers);
		worker
			.start({ onUnhandledRequest: "bypass", quiet: true })
			.then(() => setReady(true))
			.catch(() => setReady(true));
	}, []);

	return <>{children}</>;
}
