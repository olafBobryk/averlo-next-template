// lib/createFakeFetcher.ts

/**
 * Generic fake fetcher factory:
 * - Accepts static data
 * - Returns an async function that:
 *   - waits for a random delay
 *   - sometimes throws an error
 */
export type FakeFetcherOptions<T> = {
	data: T[];
	/** Minimum delay in ms (default 800) */
	minDelay?: number;
	/** Maximum extra delay in ms (default 700) – actual delay is minDelay + random(0, maxDelay) */
	maxDelay?: number;
	/** Probability (0–1) that the fetch fails (default 0.1 = 10%) */
	errorRate?: number;
};

export function createFakeFetcher<T>({
	data,
	minDelay = 800,
	maxDelay = 700,
	errorRate = 0.5,
}: FakeFetcherOptions<T>): () => Promise<T[]> {
	return async function fakeFetch(): Promise<T[]> {
		const delay = minDelay + Math.random() * maxDelay;

		return new Promise((resolve, reject) => {
			setTimeout(() => {
				const shouldFail = Math.random() < errorRate;
				if (shouldFail) {
					reject(new Error("Failed to load data. Please try again."));
				} else {
					// shallow copy to mimic fresh data from API
					resolve([...data]);
				}
			}, delay);
		});
	};
}
