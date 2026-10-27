import assert from "node:assert/strict";
import { test } from "node:test";
import {
	buildCooldownCookie,
	type FilePolicy,
	validateFiles,
	validateSubmissionGuards,
} from "./guard";

const files: FilePolicy = {
	fieldName: "attachments",
	maxFiles: 2,
	maxFileSizeBytes: 8,
	maxTotalSizeBytes: 12,
	allowedExtensions: [".txt"],
	allowedMimeTypes: ["text/plain"],
};
const policy = {
	honeypot: { fieldName: "website" },
	cooldown: { cookieName: "fixture-cooldown", windowSeconds: 30 },
	files,
};

test("honeypot terminates before cooldown or files are inspected", () => {
	const formData = new FormData();
	formData.set("website", "bot-filled");
	const guard = validateSubmissionGuards({
		formData,
		policy,
		cookieStore: {
			get: () => {
				throw Error("Downstream guard work must not run");
			},
		},
	});
	assert.deepEqual(guard, { kind: "honeypot" });
});

test("cooldown uses the configured typed cookie and preserves its existing threshold", () => {
	for (const value of ["1", { value: "1" }]) {
		assert.deepEqual(
			validateSubmissionGuards({
				formData: new FormData(),
				policy,
				cookieStore: { get: () => value },
			}),
			{ kind: "cooldown", retryAfterSeconds: 30 },
		);
	}
	assert.deepEqual(buildCooldownCookie(policy.cooldown), {
		name: "fixture-cooldown",
		value: "1",
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		path: "/",
		maxAge: 30,
	});
});

test("server file policy rejects count, individual size, total size and type bypasses", () => {
	const file = (size: number, name = "note.txt", type = "text/plain") =>
		new File(["x".repeat(size)], name, { type });
	assert.equal(
		validateFiles([file(1), file(1), file(1)], files),
		"too_many_files",
	);
	assert.equal(validateFiles([file(9)], files), "file_too_large");
	assert.equal(validateFiles([file(7), file(7)], files), "files_too_large");
	assert.equal(
		validateFiles([file(1, "note.exe")], files),
		"invalid_file_type",
	);
	assert.equal(
		validateFiles([file(1, "note.txt", "application/octet-stream")], files),
		"invalid_file_type",
	);
	assert.equal(validateFiles([file(6), file(6)], files), null);
});
