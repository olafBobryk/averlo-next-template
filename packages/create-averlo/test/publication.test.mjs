import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
	nextPatchVersion,
	setPublicationVersion,
} from "../scripts/prepare-publication.mjs";

const commit = "a".repeat(40);

test("publication advances stable versions and refuses ambiguous inputs", () => {
	assert.equal(nextPatchVersion("0.1.9"), "0.1.10");
	assert.equal(nextPatchVersion("2.5.0"), "2.5.1");
	for (const version of ["latest", "0.1.1-beta.1", "01.2.3", "0.1.2\n"]) {
		assert.throws(() => nextPatchVersion(version));
	}
});

test("staging changes the release version while preserving commit and package contents", async () => {
	const root = await fs.mkdtemp(
		path.join(os.tmpdir(), "averlo-publication-test-"),
	);
	try {
		await fs.mkdir(path.join(root, "dist"));
		const manifest = {
			name: "create-averlo",
			version: "0.1.1",
			bin: { "create-averlo": "bin/create-averlo.mjs" },
		};
		const metadata = {
			templateCommit: commit,
			sourceDirty: false,
			packageVersion: "0.1.1",
			profiles: ["thin-start"],
		};
		await fs.writeFile(
			path.join(root, "package.json"),
			JSON.stringify(manifest),
		);
		await fs.writeFile(
			path.join(root, "dist/template-metadata.json"),
			JSON.stringify(metadata),
		);
		await setPublicationVersion(root, "0.1.2", commit);
		assert.deepEqual(
			JSON.parse(await fs.readFile(path.join(root, "package.json"), "utf8")),
			{ ...manifest, version: "0.1.2" },
		);
		assert.deepEqual(
			JSON.parse(
				await fs.readFile(
					path.join(root, "dist/template-metadata.json"),
					"utf8",
				),
			),
			{ ...metadata, packageVersion: "0.1.2" },
		);
		await assert.rejects(
			setPublicationVersion(root, "0.1.3", "b".repeat(40)),
			/verified clean/,
		);
		await fs.writeFile(
			path.join(root, "dist/template-metadata.json"),
			JSON.stringify({ ...metadata, sourceDirty: true }),
		);
		await assert.rejects(
			setPublicationVersion(root, "0.1.3", commit),
			/verified clean/,
		);
	} finally {
		await fs.rm(root, { recursive: true, force: true });
	}
});
