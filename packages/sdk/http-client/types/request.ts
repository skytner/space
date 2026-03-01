import type { ErrorHandlerRecord, NormalizedError } from "./errors";

export type HttpClientConfig = {
	baseURL: string;
	timeout?: number;
	headers?: Record<string, string>;
	errorMessages?: ErrorHandlerRecord;
	onError?: (error: unknown, normalized: NormalizedError) => void;
};

export type RequestOptions = {
	headers?: Record<string, string>;
	signal?: AbortSignal;
};
