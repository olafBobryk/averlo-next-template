"use client";

import { useRouter } from "next/navigation";
import { SegmentedControl } from "@/components/ui/misc";

type BenchmarkRunView = "real" | "placeholder";

const BENCHMARK_RUN_OPTIONS = [
	{ value: "real", label: "Real runs" },
	{ value: "placeholder", label: "Placeholder" },
] as const;

export function BenchmarkRunToggle({ isExample }: { isExample: boolean }) {
	const router = useRouter();

	return (
		<SegmentedControl<BenchmarkRunView>
			options={BENCHMARK_RUN_OPTIONS}
			value={isExample ? "placeholder" : "real"}
			onChange={(nextView) => {
				router.push(
					nextView === "placeholder"
						? "/internal/intelligence?view=benchmarks&example=on"
						: "/internal/intelligence?view=benchmarks",
				);
			}}
			layout="auto"
			ariaLabel="Benchmark run data source"
		/>
	);
}
