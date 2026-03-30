export type ErrorResponse = {
	message?: string;
	error?: string;
	details?: string;
	retryAfterSeconds?: number;
};

export type ApiError = Error & {
	status?: number;
	payload?: ErrorResponse | null;
};

export type ApiRequestBody =
	| RequestInit["body"]
	| Record<string, unknown>
	| unknown[]
	| null;

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
	body?: ApiRequestBody;
};

export type ApiRequester = <T>(
	path: string,
	options?: ApiRequestOptions,
) => Promise<T>;

export type ApiClient = {
	buildUrl: (path: string) => string;
	request: ApiRequester;
};

export type ApiClientOptions = {
	baseUrl: string | (() => string | undefined);
	fetcher?: typeof fetch;
	defaultHeaders?: HeadersInit;
	credentials?: RequestCredentials;
	mode?: RequestMode;
};

const parseJson = async (response: Response) => {
	try {
		return await response.json();
	} catch {
		return null;
	}
};

const normalizeBaseUrl = (baseUrl: string) =>
	baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

const resolveBaseUrl = (baseUrl: ApiClientOptions["baseUrl"]) => {
	const resolved = typeof baseUrl === "function" ? baseUrl() : baseUrl;
	if (!resolved) {
		throw new Error("API base URL is not set.");
	}
	return normalizeBaseUrl(resolved);
};

const buildApiUrl = (baseUrl: string, path: string) =>
	path.startsWith("/") ? `${baseUrl}${path}` : `${baseUrl}/${path}`;

const isJsonLikeBody = (
	body: ApiRequestBody,
): body is Record<string, unknown> | unknown[] => {
	if (!body || typeof body !== "object") return false;
	if (body instanceof ArrayBuffer) return false;
	if (body instanceof Blob) return false;
	if (body instanceof FormData) return false;
	if (body instanceof URLSearchParams) return false;
	if (typeof ReadableStream !== "undefined" && body instanceof ReadableStream) {
		return false;
	}
	return true;
};

const resolveBody = (body: ApiRequestBody, headers: Headers) => {
	if (body === undefined || body === null) {
		return undefined;
	}

	if (isJsonLikeBody(body)) {
		if (!headers.has("Content-Type")) {
			headers.set("Content-Type", "application/json");
		}
		return JSON.stringify(body);
	}

	if (
		typeof body === "string" &&
		headers.get("Content-Type")?.includes("application/json")
	) {
		return body;
	}

	return body;
};

const createApiError = (
	message: string,
	status?: number,
	payload?: ErrorResponse | null,
) => {
	const error = new Error(message) as ApiError;
	error.status = status;
	error.payload = payload ?? null;
	return error;
};

const getErrorResponseMessage = (payload: unknown) => {
	if (!payload || typeof payload !== "object") {
		return undefined;
	}
	if ("message" in payload && typeof payload.message === "string") {
		return payload.message;
	}
	if ("error" in payload && typeof payload.error === "string") {
		return payload.error;
	}
	return undefined;
};

const getProjectApiBaseUrl = () => process.env.NEXT_PUBLIC_BACKEND_API_URL;

export function createApiClient({
	baseUrl,
	fetcher = fetch,
	defaultHeaders,
	credentials,
	mode,
}: ApiClientOptions): ApiClient {
	const buildUrl = (path: string) => buildApiUrl(resolveBaseUrl(baseUrl), path);

	const request: ApiRequester = async <T>(
		path: string,
		options: ApiRequestOptions = {},
	) => {
		const headers = new Headers(defaultHeaders);
		new Headers(options.headers).forEach((value, key) => {
			headers.set(key, value);
		});

		if (!headers.has("Accept")) {
			headers.set("Accept", "application/json");
		}

		const response = await fetcher(buildUrl(path), {
			...options,
			headers,
			body: resolveBody(options.body, headers),
			credentials: options.credentials ?? credentials,
			mode: options.mode ?? mode,
		});

		const payload = (await parseJson(response)) as T | ErrorResponse | null;

		if (!response.ok) {
			throw createApiError(
				getErrorResponseMessage(payload) ?? "Request failed.",
				response.status,
				payload as ErrorResponse | null,
			);
		}

		if (payload === null) {
			throw createApiError("Empty response from server.", response.status);
		}

		return payload as T;
	};

	return { buildUrl, request };
}

const projectApiClient = createApiClient({
	baseUrl: getProjectApiBaseUrl,
	credentials: "include",
	mode: "cors",
});

export const request: ApiRequester = <T>(
	path: string,
	options: ApiRequestOptions = {},
) => projectApiClient.request<T>(path, options);
