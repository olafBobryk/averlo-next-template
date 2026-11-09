#!/usr/bin/env node

// Pixel diff for the compose workflow (.specify/workflows/compose/).
// Compares one source section PNG with the same region of a build capture.

import process from "node:process";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const HELP = `Usage: node scripts/compose-diff.mjs --source <png> --build <png> [options]

Options:
  --top <px>         Top of the section inside the build capture (default: 0)
  --left <px>        Left of the section inside the build capture (default: 0)
  --threshold <pct>  Exit 1 when changed pixels exceed this percentage
  --tolerance <0-255> Per-channel difference that still counts as equal (default: 24)
  --out <png>        Write a diff image (changed pixels red over a faded source)
`;

export function parseArgs(argv) {
	const options = {
		left: 0,
		out: null,
		threshold: null,
		tolerance: 24,
		top: 0,
	};
	for (let index = 0; index < argv.length; index += 1) {
		const flag = argv[index];
		if (flag === "--help") return { help: true };
		const value = argv[index + 1];
		index += 1;
		if (flag === "--source") options.source = value;
		else if (flag === "--build") options.build = value;
		else if (flag === "--out") options.out = value;
		else if (["--top", "--left", "--threshold", "--tolerance"].includes(flag)) {
			const number = Number(value);
			if (!Number.isFinite(number) || number < 0) {
				throw new Error(`${flag} requires a non-negative number.`);
			}
			options[flag.slice(2)] = number;
		} else throw new Error(`Unknown option: ${flag}`);
	}
	if (!options.source || !options.build) {
		throw new Error("--source and --build are required.");
	}
	return options;
}

async function readRgba(file) {
	const { data, info } = await sharp(file)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });
	return { data, height: info.height, width: info.width };
}

// Pixels outside the build image count as changed.
export function diffPixels(
	source,
	build,
	{ left = 0, top = 0, tolerance = 24 } = {},
) {
	const diff = Buffer.alloc(source.width * source.height * 4);
	let changed = 0;
	for (let y = 0; y < source.height; y += 1) {
		for (let x = 0; x < source.width; x += 1) {
			const s = (y * source.width + x) * 4;
			const bx = x + left;
			const by = y + top;
			let same = bx < build.width && by < build.height;
			if (same) {
				const b = (by * build.width + bx) * 4;
				for (let channel = 0; channel < 4; channel += 1) {
					if (
						Math.abs(source.data[s + channel] - build.data[b + channel]) >
						tolerance
					) {
						same = false;
						break;
					}
				}
			}
			if (same) {
				const grey = 255 - (255 - source.data[s]) / 4;
				diff.fill(grey, s, s + 3);
			} else {
				changed += 1;
				diff[s] = 255;
				diff[s + 1] = 0;
				diff[s + 2] = 0;
			}
			diff[s + 3] = 255;
		}
	}
	const total = source.width * source.height;
	return {
		changedPercent: total ? Number(((changed / total) * 100).toFixed(3)) : 0,
		changedPixels: changed,
		diff,
		totalPixels: total,
	};
}

export async function run(argv) {
	const options = parseArgs(argv);
	if (options.help) {
		process.stdout.write(HELP);
		return 0;
	}
	const source = await readRgba(options.source);
	const build = await readRgba(options.build);
	const result = diffPixels(source, build, options);
	if (options.out) {
		await sharp(result.diff, {
			raw: { channels: 4, height: source.height, width: source.width },
		})
			.png()
			.toFile(options.out);
	}
	const { diff: _diff, ...report } = result;
	const passed =
		options.threshold === null || report.changedPercent <= options.threshold;
	console.log(
		JSON.stringify({ ...report, passed, threshold: options.threshold }),
	);
	return passed ? 0 : 1;
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(process.argv[1]).href
) {
	run(process.argv.slice(2)).then(
		(code) => {
			process.exitCode = code;
		},
		(error) => {
			console.error(error.message);
			process.exitCode = 2;
		},
	);
}
