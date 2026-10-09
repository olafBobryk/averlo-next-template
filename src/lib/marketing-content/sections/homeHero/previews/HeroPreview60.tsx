"use client";
// Native specimen adapted from the HealthCheckIndicator owner; use the installed
// fixture-health route rather than the Storybook-only mock endpoint.
import { HealthCheckIndicator } from "@/components/ui/misc/HealthCheckIndicator";
export default function HeroHealthPreview() {
	return <HealthCheckIndicator service="auth" />;
}
