export type RetryOptions = {
	maxAttempts?: number;
	delayMs?: number;
	backoff?: number;
	retryIf?: (error: unknown) => boolean;
};

export async function retry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
	const { maxAttempts = 3, delayMs = 500, backoff = 1, retryIf = () => true } = options;

	let lastError: unknown;
	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		try {
			return await fn();
		} catch (e) {
			lastError = e;
			if (attempt === maxAttempts - 1 || !retryIf(e)) throw e;
			const wait = delayMs * backoff ** attempt;
			await new Promise((r) => setTimeout(r, wait));
		}
	}
	throw lastError;
}
