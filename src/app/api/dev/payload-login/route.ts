import config from "@payload-config";
import { type NextRequest, NextResponse } from "next/server";
import { generatePayloadCookie, getPayload } from "payload";
import { isPayloadConfigured } from "@/payload/isPayloadConfigured";

const defaultRedirectPath = "/admin";
const usersCollectionSlug = "users";

const disabledResponse = () =>
	new Response("Payload dev magic login is unavailable.", {
		status: 404,
		headers: {
			"content-type": "text/plain; charset=utf-8",
		},
	});

const failedResponse = () =>
	new Response("Payload dev magic login failed.", {
		status: 401,
		headers: {
			"content-type": "text/plain; charset=utf-8",
		},
	});

const isLoopbackHostname = (hostname: string) => {
	const normalizedHostname = hostname.toLowerCase();

	return (
		normalizedHostname === "localhost" ||
		normalizedHostname === "127.0.0.1" ||
		normalizedHostname === "::1" ||
		normalizedHostname === "[::1]" ||
		normalizedHostname === "0:0:0:0:0:0:0:1"
	);
};

const getSafeRedirectPath = (value: string | null) => {
	if (!value) {
		return defaultRedirectPath;
	}

	const trimmedValue = value.trim();

	if (
		!trimmedValue.startsWith("/") ||
		trimmedValue.startsWith("//") ||
		/[\r\n]/.test(trimmedValue)
	) {
		return defaultRedirectPath;
	}

	try {
		new URL(trimmedValue);
		return defaultRedirectPath;
	} catch {
		return trimmedValue;
	}
};

const getSameSiteValue = (sameSite: "Lax" | "None" | "Strict" | undefined) => {
	if (!sameSite) {
		return undefined;
	}

	return sameSite.toLowerCase() as "lax" | "none" | "strict";
};

const isMagicLoginAvailable = (request: NextRequest) =>
	process.env.NODE_ENV === "development" &&
	process.env.PAYLOAD_DEV_MAGIC_LOGIN === "1" &&
	!process.env.VERCEL &&
	isLoopbackHostname(request.nextUrl.hostname) &&
	isPayloadConfigured() &&
	Boolean(
		process.env.PAYLOAD_DEV_MAGIC_EMAIL &&
			process.env.PAYLOAD_DEV_MAGIC_PASSWORD,
	);

export async function GET(request: NextRequest) {
	if (!isMagicLoginAvailable(request)) {
		return disabledResponse();
	}

	const magicEmail = process.env.PAYLOAD_DEV_MAGIC_EMAIL;
	const magicPassword = process.env.PAYLOAD_DEV_MAGIC_PASSWORD;

	if (!magicEmail || !magicPassword) {
		return disabledResponse();
	}

	try {
		const payload = await getPayload({ config });
		const authConfig = payload.collections[usersCollectionSlug]?.config.auth;

		if (!authConfig) {
			return disabledResponse();
		}

		const loginResult = await payload.login({
			collection: usersCollectionSlug,
			data: {
				email: magicEmail,
				password: magicPassword,
			},
		});

		if (!loginResult.token) {
			return failedResponse();
		}

		const payloadCookie = generatePayloadCookie({
			collectionAuthConfig: authConfig,
			cookiePrefix: payload.config.cookiePrefix,
			returnCookieAsObject: true,
			token: loginResult.token,
		});
		const redirectPath = getSafeRedirectPath(
			request.nextUrl.searchParams.get("next"),
		);
		const response = NextResponse.redirect(new URL(redirectPath, request.url));

		if (!payloadCookie.value) {
			return failedResponse();
		}

		response.cookies.set(payloadCookie.name, payloadCookie.value, {
			domain: payloadCookie.domain,
			expires: payloadCookie.expires
				? new Date(payloadCookie.expires)
				: undefined,
			httpOnly: true,
			maxAge: payloadCookie.maxAge,
			path: payloadCookie.path ?? "/",
			sameSite: getSameSiteValue(payloadCookie.sameSite),
			secure: payloadCookie.secure,
		});

		return response;
	} catch {
		return failedResponse();
	}
}
