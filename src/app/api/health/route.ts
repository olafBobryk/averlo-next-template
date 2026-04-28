import { NextResponse } from "next/server";

type HealthServiceStatus = {
	status: "healthy" | "unhealthy";
	message: string;
	latencyMs?: number;
};

type AppHealthResponse = {
	status: "healthy" | "degraded";
	checkedAt: string;
	services: {
		app: HealthServiceStatus;
		supabase: HealthServiceStatus;
	};
};

function getLatency() {
	return Math.floor(40 + Math.random() * 160);
}

export function GET() {
	const supabaseIsHealthy = Math.random() >= 0.25;
	const body: AppHealthResponse = {
		status: supabaseIsHealthy ? "healthy" : "degraded",
		checkedAt: new Date().toISOString(),
		services: {
			app: {
				status: "healthy",
				message: "Application route is responding.",
				latencyMs: getLatency(),
			},
			supabase: {
				status: supabaseIsHealthy ? "healthy" : "unhealthy",
				message: supabaseIsHealthy
					? "Supabase connection is healthy."
					: "Supabase connection is temporarily unavailable.",
				latencyMs: getLatency(),
			},
		},
	};

	return NextResponse.json(body, {
		status: supabaseIsHealthy ? 200 : 503,
		headers: {
			"Cache-Control": "no-store",
		},
	});
}
