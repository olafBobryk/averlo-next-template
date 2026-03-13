export type MockApiResponse = {
	status?: number;
	body?: unknown;
	headers?: HeadersInit;
	delayMs?: number;
};

export type MockRequestContext = {
	url: URL;
	path: string;
	method: string;
	init: RequestInit;
};

export type MockRoute = {
	matcher: string | RegExp | ((context: MockRequestContext) => boolean);
	method?: string;
	response:
		| MockApiResponse
		| ((
				context: MockRequestContext,
		  ) => MockApiResponse | Promise<MockApiResponse>);
};

const wait = (delayMs = 0) =>
	new Promise((resolve) => setTimeout(resolve, delayMs));

const matchesRoute = (route: MockRoute, context: MockRequestContext) => {
	if (route.method && route.method.toUpperCase() !== context.method) {
		return false;
	}

	if (typeof route.matcher === "string") {
		return route.matcher === context.path;
	}

	if (route.matcher instanceof RegExp) {
		return route.matcher.test(context.path);
	}

	return route.matcher(context);
};

const toResponseBody = (body: unknown, headers: Headers) => {
	if (body === undefined) return null;

	if (
		typeof body === "string" ||
		body instanceof Blob ||
		body instanceof FormData ||
		body instanceof URLSearchParams ||
		body instanceof ArrayBuffer
	) {
		return body;
	}

	if (!headers.has("Content-Type")) {
		headers.set("Content-Type", "application/json");
	}

	return JSON.stringify(body);
};

export function createMockFetch(routes: MockRoute[]): typeof fetch {
	return (async (input, init = {}) => {
		const request = input instanceof Request ? input : new Request(input, init);
		const url = new URL(request.url);
		const context: MockRequestContext = {
			url,
			path: url.pathname,
			method: request.method.toUpperCase(),
			init,
		};

		const route = routes.find((candidate) => matchesRoute(candidate, context));

		if (!route) {
			return new Response(
				JSON.stringify({
					message: `Mock route not found for ${context.path}.`,
				}),
				{
					status: 404,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const result =
			typeof route.response === "function"
				? await route.response(context)
				: route.response;

		if (result.delayMs) {
			await wait(result.delayMs);
		}

		const headers = new Headers(result.headers);
		const body = toResponseBody(result.body, headers);

		return new Response(body, {
			status: result.status ?? 200,
			headers,
		});
	}) as typeof fetch;
}
