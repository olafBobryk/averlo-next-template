import { createMockFetch } from "@/lib/api";

export type FakeFetcherOptions<T> = {
	data: T[];
	minDelay?: number;
	maxDelay?: number;
	errorRate?: number;
	errorMessage?: string;
};

type FakeErrorPayload = {
	message: string;
};

const MOCK_BASE_URL = "https://fake-fetch.local";
const MOCK_PATH = "/fake-fetch";

const getFakeErrorMessage = (payload: unknown) => {
	if (!payload || typeof payload !== "object") {
		return undefined;
	}
	if ("message" in payload && typeof payload.message === "string") {
		return payload.message;
	}
	return undefined;
};

const getDelay = (minDelay: number, maxDelay: number) =>
	minDelay + Math.random() * maxDelay;

export function createFakeFetcher<T>({
	data,
	minDelay = 800,
	maxDelay = 700,
	errorRate = 0.5,
	errorMessage = "Failed to load data. Please try again.",
}: FakeFetcherOptions<T>): () => Promise<T[]> {
	const mockFetch = createMockFetch([
		{
			matcher: MOCK_PATH,
			method: "GET",
			response: async () => {
				const shouldFail = Math.random() < errorRate;

				if (shouldFail) {
					return {
						delayMs: getDelay(minDelay, maxDelay),
						status: 500,
						body: { message: errorMessage } satisfies FakeErrorPayload,
					};
				}

				return {
					delayMs: getDelay(minDelay, maxDelay),
					status: 200,
					body: [...data],
				};
			},
		},
	]);

	return async function fakeFetch(): Promise<T[]> {
		const response = await mockFetch(`${MOCK_BASE_URL}${MOCK_PATH}`, {
			method: "GET",
		});
		const payload = (await response.json().catch(() => null)) as
			| T[]
			| FakeErrorPayload
			| null;

		if (!response.ok) {
			throw new Error(getFakeErrorMessage(payload) ?? errorMessage);
		}

		if (!payload || !Array.isArray(payload)) {
			throw new Error("Fake fetch returned an invalid payload.");
		}

		return [...payload];
	};
}
