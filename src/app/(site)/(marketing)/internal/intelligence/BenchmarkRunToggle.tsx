"use client";

import { useRouter } from "next/navigation";
import { SegmentedControl } from "@/components/ui/misc/SegmentedControl";

type BenchmarkRunView = "real" | "placeholder";

const BENCHMARK_RUN_OPTIONS = [
	{ value: "real", label: "Real runs" },
	{ value: "placeholder", label: "Placeholder" },
] as const;
const PRIMARY_SEGMENTED_CLASS =
	"w-fit border border-primary/15 bg-white/85 shadow-[2px_4px_15px_-2px_rgba(1,1,3,0.08)]";

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
			roundedFull
			pillClassName="!bg-primary"
			activeTextClassName="!text-primary-foreground"
			inactiveTextClassName="!text-foreground/55 group-hover:!text-foreground"
			ariaLabel="Benchmark run data source"
			className={PRIMARY_SEGMENTED_CLASS}
		/>
	);
}
