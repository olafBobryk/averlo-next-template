import { type ApiRequester, request } from "./createApiClient";

export type HealthResponse = {
	message: string;
};

export async function checkHealth(
	requester: ApiRequester = request,
): Promise<HealthResponse> {
	return requester<HealthResponse>("/", {
		method: "GET",
		cache: "no-store",
	});
}
