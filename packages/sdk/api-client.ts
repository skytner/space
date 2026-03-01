import ky, { type KyInstance, type Options } from "ky";

export type ApiClientConfig = {
	baseURL: string;
	timeout?: number;
	headers?: Record<string, string>;
};

export function createApiClient(config: ApiClientConfig): KyInstance {
	const { baseURL, timeout = 30_000, headers = {} } = config;
	const base = baseURL.replace(/\/$/, "");

	return ky.create({
		prefixUrl: base,
		timeout,
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
	});
}

export type { KyInstance, Options };
