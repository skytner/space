import { getMessageForError } from "./functions/getErrorMessage";
import { handleHttpError } from "./functions/handleHttpError";
import { HttpError } from "./types/errors";
import type { HttpClientConfig, RequestOptions } from "./types/request";

type InFlight = {
	controller: AbortController;
	timeoutId: ReturnType<typeof setTimeout>;
};

export class HttpClient {
	private readonly baseURL: string;
	private readonly timeout: number;
	private readonly defaultHeaders: Record<string, string>;
	private readonly errorMessages?: HttpClientConfig["errorMessages"];
	private readonly onError?: HttpClientConfig["onError"];
	private readonly inFlight = new Map<string, InFlight>();

	constructor(config: HttpClientConfig) {
		this.baseURL = config.baseURL.replace(/\/$/, "");
		this.timeout = config.timeout ?? 30_000;
		this.defaultHeaders = {
			"Content-Type": "application/json",
			...config.headers,
		};
		this.errorMessages = config.errorMessages;
		this.onError = config.onError;
	}

	static create(config: HttpClientConfig): HttpClient {
		return new HttpClient(config);
	}

	async get<T>(url: string, options?: RequestOptions): Promise<T> {
		return this.request<T>("GET", url, undefined, options);
	}

	async post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
		return this.request<T>("POST", url, body, options);
	}

	async put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
		return this.request<T>("PUT", url, body, options);
	}

	async patch<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
		return this.request<T>("PATCH", url, body, options);
	}

	async delete<T>(url: string, options?: RequestOptions): Promise<T> {
		return this.request<T>("DELETE", url, undefined, options);
	}

	async request<T>(
		method: string,
		url: string,
		body?: unknown,
		options?: RequestOptions,
	): Promise<T> {
		const fullURL = url.startsWith("http") ? url : `${this.baseURL}/${url.replace(/^\//, "")}`;
		const key = `${method}:${fullURL}`;

		let controller: AbortController | null = null;
		let timeoutId: ReturnType<typeof setTimeout> | null = null;
		let signal = options?.signal;

		if (signal == null) {
			const previous = this.inFlight.get(key);
			if (previous) {
				previous.controller.abort();
				clearTimeout(previous.timeoutId);
				this.inFlight.delete(key);
			}
			controller = new AbortController();
			timeoutId = setTimeout(() => controller!.abort(), this.timeout);
			signal = controller.signal;
			this.inFlight.set(key, { controller, timeoutId });
		}
		const headers: Record<string, string> = {
			...this.defaultHeaders,
			...options?.headers,
		};
		const init: RequestInit = {
			method,
			headers,
			signal,
		};
		if (body !== undefined && method !== "GET") {
			init.body = JSON.stringify(body);
		}

		try {
			const response = await fetch(fullURL, init);
			if (timeoutId != null) clearTimeout(timeoutId);
			if (controller != null) this.inFlight.delete(key);

			const text = await response.text();
			let data: unknown;
			try {
				data = text ? JSON.parse(text) : null;
			} catch {
				data = text;
			}

			if (!response.ok) {
				const message = getMessageForError(
					{
						status: response.status,
						response: { status: response.status },
						body: data,
					},
					this.errorMessages,
				);
				throw new HttpError(response.status, data, message);
			}

			return data as T;
		} catch (err) {
			if (timeoutId != null) clearTimeout(timeoutId);
			if (controller != null) this.inFlight.delete(key);
			const normalized = handleHttpError(err, this.errorMessages);
			this.onError?.(err, normalized);
			throw err;
		}
	}
}
