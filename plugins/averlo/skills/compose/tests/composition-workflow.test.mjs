import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const skillsRoot = path.resolve(process.cwd(), "plugins/averlo/skills");

async function readSkill(name, relativePath = "SKILL.md") {
	return fs.readFile(path.join(skillsRoot, name, relativePath), "utf8");
}

async function readRepository(relativePath) {
	return fs.readFile(path.resolve(process.cwd(), relativePath), "utf8");
}

async function assertMissingSkill(name) {
	await assert.rejects(fs.access(path.join(skillsRoot, name, "SKILL.md")), {
		code: "ENOENT",
	});
}

test("Compose is the only implicit composition workflow", async () => {
	const expected = {
		compose: true,
		"systemize-composition": false,
		animate: false,
		"visual-parity": false,
	};

	for (const [skill, implicit] of Object.entries(expected)) {
		const metadata = await readSkill(skill, "agents/openai.yaml");
		assert.match(
			metadata,
			new RegExp(`allow_implicit_invocation: ${implicit}`, "u"),
			`${skill} implicit policy`,
		);
	}

	for (const retired of [
		"static-composition",
		"composition-realization",
		"composition-system-integration",
		"composition-convergence",
		"motion-composition",
	]) {
		await assertMissingSkill(retired);
	}
});

test("Compose frames stable section sources and requests exact section context", async () => {
	const [compose, intake, visualParity, focusPacket] = await Promise.all([
		readSkill("compose"),
		readSkill("compose", "references/source-intake.md"),
		readSkill("visual-parity"),
		readSkill("visual-parity", "references/focus-packet.md"),
	]);

	assert.match(
		compose,
		/Before any product edit,\s+materialize every authoritative source case/u,
	);
	assert.match(compose, /reference\/<case-id>\.png/u);
	assert.match(
		compose,
		/Call `get_design_context` with the active section frame's exact/u,
	);
	assert.match(
		compose,
		/page frame, containing page, accumulated\s+frame, or a sibling is not design context/u,
	);
	assert.match(intake, /page metadata only to decompose/u);
	assert.match(intake, /exact\s+authoritative section frame/u);
	assert.match(
		visualParity,
		/stable ignored reference\s+PNG before product implementation/u,
	);
	assert.match(
		focusPacket,
		/exact source frame node\/bounds → stable reference PNG/u,
	);
});

test("Compose has no hook-driven section continuation", async () => {
	const manifest = await fs.readFile(
		path.join(process.cwd(), "plugins/averlo/.codex-plugin/plugin.json"),
		"utf8",
	);
	await assert.rejects(
		fs.access(path.join(process.cwd(), "plugins/averlo/hooks/hooks.json")),
		{ code: "ENOENT" },
	);
	await assert.rejects(
		fs.access(
			path.join(process.cwd(), "plugins/averlo/hooks/compose-stop-hook.mjs"),
		),
		{ code: "ENOENT" },
	);
	assert.doesNotMatch(manifest, /"hooks"/u);
});

test("owning workflows load Visual Parity and target-owned contracts", async () => {
	for (const owner of ["compose", "systemize-composition", "animate"]) {
		const source = (await readSkill(owner)).replace(/\s+/gu, " ");
		assert.match(
			source,
			/\[Visual Parity\]\(\.\.\/visual-parity\/SKILL\.md\)/u,
		);
		assert.match(source, /linked `SKILL\.md` completely/u);
		assert.match(source, /omitted from the active catalogue/u);
		assert.match(
			source,
			/(?:not authorize|does not\s+authorize) a substitute/u,
		);
		assert.match(source, /target\s+repository(?:\s+root|:)/u);
		assert.match(
			source,
			/never\s+(?:from\s+)?(?:the\s+)?plugin\s+installation/u,
		);
		assert.match(source, /missing\s+required contract/u);
		assert.match(
			source,
			/(?:do not invent|rather than inventing) equivalent policy/u,
		);
		assert.doesNotMatch(source, /repository-workflows/u);
	}
});

test("packaged workflows discover scoped app contracts in an independent target and reject missing contracts", async () => {
	const temporary = await fs.mkdtemp(
		path.join(os.tmpdir(), "averlo-contract-resolution-"),
	);
	const workflowCapabilities = {
		compose: ["app/marketing/composition/marketing-composition"],
		"systemize-composition": [
			"app/shared/frontend/components/component-contracts",
		],
		animate: [
			"app/shared/frontend/interaction/responsive-and-motion",
			"app/shared/frontend/interaction/keyboard-and-overlays",
		],
		"contact-form": [
			"app/shared/data-lifecycle/form-behavior",
			"app/shared/services/delivery/submission-protection",
			"app/shared/services/delivery/contact-delivery",
			"app/shared/services/transport/api-transport",
		],
	};
	// Historical IDs are negative fixtures, not an alternate discovery table.
	const legacyFixtureIds = {
		"app/marketing/composition/marketing-composition":
			"app/content/marketing-composition",
		"app/shared/frontend/components/component-contracts":
			"app/ui-system/component-contracts",
		"app/shared/frontend/interaction/responsive-and-motion":
			"app/interaction/responsive-and-motion",
		"app/shared/frontend/interaction/keyboard-and-overlays":
			"app/interaction/keyboard-and-overlays",
		"app/shared/data-lifecycle/form-behavior":
			"app/data-lifecycle/form-behavior",
		"app/shared/services/delivery/submission-protection":
			"app/delivery/submission-protection",
		"app/shared/services/delivery/contact-delivery":
			"app/delivery/contact-delivery",
		"app/shared/services/transport/api-transport":
			"app/integration/api-transport",
	};
	try {
		const pluginRoot = path.join(temporary, "plugin-installation", "skills");
		const targetRoot = path.join(temporary, "independent-project");
		const capabilities = [
			...new Set(Object.values(workflowCapabilities).flat()),
		];
		for (const capability of capabilities) {
			const relativeSpec = `openspec/specs/${capability}/spec.md`;
			await fs.mkdir(path.join(targetRoot, path.dirname(relativeSpec)), {
				recursive: true,
			});
			await fs.copyFile(
				path.resolve(relativeSpec),
				path.join(targetRoot, relativeSpec),
			);
		}
		await fs.writeFile(
			path.join(targetRoot, "openspec/config.yaml"),
			"schema: spec-driven\n",
		);
		await fs.writeFile(
			path.join(targetRoot, ".template-profile.json"),
			JSON.stringify({ schemaVersion: 2 }),
		);
		for (const owner of [
			...Object.keys(workflowCapabilities),
			"visual-parity",
		]) {
			await fs.cp(path.join(skillsRoot, owner), path.join(pluginRoot, owner), {
				recursive: true,
			});
		}
		for (const [owner, required] of Object.entries(workflowCapabilities)) {
			const packaged = await fs.readFile(
				path.join(pluginRoot, owner, "SKILL.md"),
				"utf8",
			);
			assert.match(packaged, /target\s+repository(?:'s|\s+root|:)/u);
			assert.match(
				packaged,
				/missing\s+(?:required|contract)|required missing/u,
			);
			assert.match(packaged, /openspec list --specs/u);
			assert.match(packaged, /openspec show /u);
			assert.doesNotMatch(packaged, /repository-workflows/u);
			for (const capability of required)
				assert.ok(
					packaged.includes(capability),
					`${owner} discovers ${capability}`,
				);
		}
		const run = (args) =>
			spawnSync("openspec", args, {
				cwd: targetRoot,
				encoding: "utf8",
				env: { ...process.env, OPENSPEC_TELEMETRY: "0" },
			});
		const listed = run(["list", "--specs", "--json"]);
		assert.ifError(listed.error);
		assert.equal(listed.status, 0, listed.stderr);
		assert.deepEqual(
			JSON.parse(listed.stdout)
				.specs.map(({ id }) => id)
				.sort(),
			capabilities.toSorted(),
		);
		for (const capability of capabilities) {
			const relativeSpec = `openspec/specs/${capability}/spec.md`;
			await assert.rejects(fs.access(path.join(pluginRoot, relativeSpec)), {
				code: "ENOENT",
			});
			const show = () => run(["show", capability, "--type", "spec", "--json"]);
			const found = show();
			assert.ifError(found.error);
			assert.equal(found.status, 0, found.stderr);
			assert.equal(JSON.parse(found.stdout).id, capability);
			// Plugin and legacy target decoys cannot satisfy a missing scoped app contract.
			await fs.mkdir(path.join(pluginRoot, path.dirname(relativeSpec)), {
				recursive: true,
			});
			await fs.copyFile(
				path.join(targetRoot, relativeSpec),
				path.join(pluginRoot, relativeSpec),
			);
			await fs.writeFile(
				path.join(pluginRoot, "openspec/config.yaml"),
				"schema: spec-driven\n",
			);
			for (const legacyId of [
				legacyFixtureIds[capability],
				legacyFixtureIds[capability].replace(/^app\//u, ""),
			]) {
				const legacySpec = `openspec/specs/${legacyId}/spec.md`;
				await fs.mkdir(path.join(targetRoot, path.dirname(legacySpec)), {
					recursive: true,
				});
				await fs.copyFile(
					path.join(targetRoot, relativeSpec),
					path.join(targetRoot, legacySpec),
				);
			}
			await fs.unlink(path.join(targetRoot, relativeSpec));
			const missing = show();
			assert.ifError(missing.error);
			assert.notEqual(
				missing.status,
				0,
				`Missing ${capability} must not fall back to plugin or legacy policy.`,
			);
			assert.match(
				`${missing.stderr}\n${missing.stdout}`,
				/unknown|not found|no spec/i,
			);
		}
	} finally {
		await fs.rm(temporary, { recursive: true, force: true });
	}
});

test("shared route guidance keeps optional surfaces conditional without inventing product policy", async () => {
	const temporary = await fs.mkdtemp(
		path.join(os.tmpdir(), "averlo-shared-contracts-"),
	);
	try {
		const sharedIds = [
			"app/shared/frontend/navigation/route-identity",
			"app/shared/frontend/navigation/document-metadata",
		];
		for (const id of sharedIds) {
			const relative = `openspec/specs/${id}/spec.md`;
			await fs.mkdir(path.join(temporary, path.dirname(relative)), {
				recursive: true,
			});
			await fs.copyFile(path.resolve(relative), path.join(temporary, relative));
		}
		await fs.writeFile(
			path.join(temporary, "openspec/config.yaml"),
			"schema: spec-driven\n",
		);
		const run = (args) =>
			spawnSync("openspec", args, {
				cwd: temporary,
				encoding: "utf8",
				env: { ...process.env, OPENSPEC_TELEMETRY: "0" },
			});
		const listed = run(["list", "--specs", "--json"]);
		assert.ifError(listed.error);
		assert.equal(listed.status, 0, listed.stderr);
		assert.deepEqual(
			JSON.parse(listed.stdout)
				.specs.map(({ id }) => id)
				.sort(),
			sharedIds.toSorted(),
		);
		for (const id of sharedIds) {
			const shown = run(["show", id, "--type", "spec", "--json"]);
			assert.ifError(shown.error);
			assert.equal(shown.status, 0, shown.stderr);
			assert.equal(JSON.parse(shown.stdout).id, id);
		}
		const procedure = await readRepository(
			"docs/testing/routes-and-metadata.md",
		);
		assert.match(procedure, /For installed dashboard enrichment/u);
		assert.match(procedure, /For installed public marketing/u);
		for (const id of [
			"app/dashboard/navigation/route-enrichment",
			"app/marketing/metadata/public-document-metadata",
		]) {
			assert.ok(procedure.includes(`\`${id}\``));
			assert.ok(
				!procedure.includes(`openspec/specs/${id}/spec.md`),
				"Optional scopes must not become dangling file links in the shared procedure.",
			);
			const missing = run(["show", id, "--type", "spec", "--json"]);
			assert.ifError(missing.error);
			assert.notEqual(missing.status, 0);
		}
		for (const absent of [
			"product",
			"template",
			"app/marketing",
			"app/dashboard",
		]) {
			await assert.rejects(
				fs.access(path.join(temporary, "openspec/specs", absent)),
				{ code: "ENOENT" },
			);
		}
	} finally {
		await fs.rm(temporary, { recursive: true, force: true });
	}
});

test("Compose owns section-scoped native review without shared-owner mutation", async () => {
	const compose = await readSkill("compose");

	assert.match(compose, /stock OpenSpec discovery/u);
	assert.match(compose, /app\/marketing\/composition\/marketing-composition/u);
	assert.match(
		compose,
		/Invoke the linked `\$averlo:visual-parity` in `frame`/u,
	);
	assert.match(compose, /one authoritative source section at a time/u);
	assert.match(
		compose,
		/Do not create,\s+stub, style, or otherwise implement a later case/u,
	);
	assert.match(compose, /`changedPixels: 0` is the only `exact` result/u);
	assert.match(
		compose,
		/Every comparable nonzero result\s+remains `measured`/u,
	);
	assert.match(compose, /Improvement alone/u);
	assert.match(compose, /A later user request resumes the active unfinished/u);
	assert.match(compose, /Stop at a human review checkpoint/u);
	assert.match(
		compose,
		/does not decide or mutate shared design-system\s+owners/u,
	);
	assert.match(
		compose,
		/Do not add, extend, rename, merge, retire, retheme, or change defaults/u,
	);
	assert.match(
		compose,
		/`Logo`, Button, Text, Section, or another shared design-system owner/u,
	);
	assert.match(compose, /`native-invalid`\s+regardless of its pixel score/u);
	assert.match(compose, /existing Target header is immutable/u);
	assert.match(compose, /always exclude source-header pixels/u);
	assert.match(
		compose,
		/Do not propose, plan,\s+recommend, sequence, or describe/u,
	);
	assert.doesNotMatch(compose, /Defer header redesign/u);
	assert.doesNotMatch(compose, /unless the caller explicitly/u);
	assert.match(compose, /evidenced footer\s+work in scope/u);
	assert.match(compose, /accumulated in-scope gate/u);
	assert.match(
		compose,
		/one `MarketingPageDocument` block, one registered renderer/u,
	);
	assert.match(compose, /Use Preview `--review composition`/u);
	assert.doesNotMatch(
		compose,
		/create_goal|update_goal|active plane|stall counter/iu,
	);
	assert.match(
		compose,
		/Do not add a goal, composition\s+record, checklist file, app-server controller/u,
	);
});

test("Systemize Composition separates ownership confidence from visual outcomes", async () => {
	const [systemize, confidence] = await Promise.all([
		readSkill("systemize-composition"),
		readSkill("systemize-composition", "references/confidence.md"),
	]);

	assert.match(systemize, /Plan-only analysis does not require capture work/u);
	assert.match(systemize, /render-preserving/u);
	assert.match(systemize, /intentionally changing/u);
	assert.match(systemize, /uncertain/u);
	assert.match(systemize, /different between consumers/u);
	assert.match(systemize, /not a visual-effect status, schema/u);
	assert.match(
		systemize,
		/Consult the confidence router only for a genuinely new owner or an unresolved\s+ownership choice/u,
	);
	assert.match(systemize, /\*\*Required automatic:\*\* attempt/u);
	assert.match(systemize, /\*\*Automatic blocked:\*\*/u);
	assert.match(systemize, /\*\*High confidence:\*\* automatically attempt/u);
	assert.match(
		systemize,
		/pixel\s+difference alone neither accepts nor rejects/u,
	);
	assert.match(systemize, /\*\*Medium confidence:\*\* do not edit/u);
	assert.match(systemize, /\*\*Low confidence:\*\* preserve/u);
	assert.match(
		systemize,
		/confidence-routed automatic attempt fails its owner, consumer, API,\s+Storybook/u,
	);
	assert.doesNotMatch(systemize, /Freeze the accepted target/u);
	assert.doesNotMatch(systemize, /changedPixels:\s*0/u);
	assert.doesNotMatch(systemize, /visual contract|per-consumer table/iu);
	for (const action of [
		"reuse",
		"extension",
		"new owner",
		"merge-retire",
		"token/default",
	]) {
		assert.match(confidence, new RegExp(action, "iu"));
	}
	assert.match(confidence, /lowest supported\s+dimension/u);
	assert.match(
		confidence,
		/Do not confidence-score an accepted role that already belongs to an established\s+semantic or repository owner/u,
	);
	assert.match(
		confidence,
		/cannot downgrade a settled owner into human review/u,
	);
	assert.match(confidence, /visual preservation is not assumed/u);
	assert.match(
		confidence,
		/pixel\s+difference is not an ownership-confidence verdict/u,
	);
	assert.doesNotMatch(confidence, /zero changed target-to-target pixels/u);
	assert.doesNotMatch(
		confidence,
		/target-before\/target-after case is nonzero/u,
	);
});

test("Systemize replaces inherited scaffolding while protecting prior product work", async () => {
	const [systemize, confidence] = await Promise.all([
		readSkill("systemize-composition"),
		readSkill("systemize-composition", "references/confidence.md"),
	]);

	assert.match(
		systemize,
		/inherited template visuals are replaceable scaffolding/u,
	);
	assert.match(
		systemize,
		/does not make that owner's visual\s+recipe a fidelity constraint/u,
	);
	assert.match(systemize, /reachable initialization commit/u);
	assert.match(
		systemize,
		/initial tree\s+with the current committed and working-tree state/u,
	);
	assert.match(systemize, /Never create a fresh template/u);
	assert.match(systemize, /unchanged\s+owner is inherited scaffolding/u);
	assert.match(
		systemize,
		/changed or newly added owner may contain\s+prior product systemization/u,
	);
	assert.match(systemize, /provenance uncertainty/u);
	assert.match(
		systemize,
		/Do not add provenance comments, annotations, or another ledger/u,
	);
	assert.match(confidence, /Instance provenance/u);
	assert.match(confidence, /initialization commit and path history/u);
	assert.match(confidence, /conflicting prior product work/u);
});

test("Systemize routes atoms through owner domains before proposing compounds", async () => {
	const [systemize, confidence] = await Promise.all([
		readSkill("systemize-composition"),
		readSkill("systemize-composition", "references/confidence.md"),
	]);

	assert.match(
		systemize,
		/Decompose each candidate before assigning ownership/u,
	);
	assert.match(systemize, /route each atom to the lowest existing owner/u);
	assert.match(
		systemize,
		/existing owner-domain match must resolve through reuse, extension, default\s+replacement, or merge-retire/u,
	);
	assert.match(
		systemize,
		/mismatching inherited visual\s+recipe is a replacement candidate/u,
	);
	assert.match(
		systemize,
		/Importing or structurally wrapping with an owner does not settle its visual\s+ownership/u,
	);
	assert.match(
		systemize,
		/every repeated caller class, asset,\s+or wrapper axis/u,
	);
	assert.match(
		systemize,
		/cannot call that owner already correct while\s+consumers still duplicate/u,
	);
	assert.match(systemize, /Replace an inherited default/u);
	assert.match(
		systemize,
		/add an opt-in\s+variant for an additional evidenced role/u,
	);
	assert.match(systemize, /promote a token only for its exact/u);
	assert.match(systemize, /propose a compound owner only/u);
	assert.match(
		systemize,
		/opt-in value is appropriate only\s+for a genuinely additional role or to protect evidenced conflicting prior\s+product work/u,
	);
	assert.match(
		systemize,
		/One user\s+action remains one interactive root and one tab stop/u,
	);
	assert.match(systemize, /Button-owned visual segments/u);
	assert.match(systemize, /source-neutral compound above those roles/u);
	assert.match(
		systemize,
		/do not hide that responsibility inside the primitive's\s+variant axis/u,
	);
	assert.match(systemize, /migrate each action segment through Button/u);
	assert.match(
		systemize,
		/inherited primary Button recipe and the higher compound as separate migration\s+candidates/u,
	);
	assert.match(
		systemize,
		/route the evidenced primary recipe replacement as\s+required automatic/u,
	);
	assert.match(
		systemize,
		/For every repeated labelled action, the final audit must state as\s+its own primitive-owner recommendation/u,
	);
	assert.match(
		systemize,
		/higher compound\s+recommendation never satisfies or suppresses this primitive-owner row/u,
	);
	assert.match(
		systemize,
		/icon-only action\s+owner for a labelled primary action/u,
	);
	assert.match(confidence, /Default replacement/u);
	assert.match(confidence, /Compound/u);
	assert.match(
		confidence,
		/relationship-owned multi-segment layout stays above the constituent primitive/u,
	);
	assert.match(
		confidence,
		/repeated primary action must evaluate the primary Button recipe separately/u,
	);
	assert.match(
		confidence,
		/repeated labelled action therefore receives a distinct `Button` default-or-\s*variant recommendation/u,
	);
	assert.match(
		confidence,
		/one\s+interactive root rather than duplicated controls/u,
	);
});

test("Systemize exhaustively replaces evidenced existing-owner domains", async () => {
	const [systemize, confidence, evidencedOwners, typography, metadata] =
		await Promise.all([
			readSkill("systemize-composition"),
			readSkill("systemize-composition", "references/confidence.md"),
			readSkill("systemize-composition", "references/evidenced-owners.md"),
			readSkill("systemize-composition", "references/typography.md"),
			readSkill("systemize-composition", "agents/openai.yaml"),
		]);

	assert.match(
		systemize,
		/\[evidenced owner replacement\]\(references\/evidenced-owners\.md\)/u,
	);
	assert.match(
		systemize,
		/\[typography systemization\]\(references\/typography\.md\)/u,
	);
	assert.match(
		systemize,
		/Every accepted\s+text role must map exhaustively through `Text`/u,
	);
	assert.match(
		typography,
		/Enumerate every rendered text node in the accepted focus/u,
	);
	assert.match(
		typography,
		/Repetition determines whether two nodes share a\s+variant; it never determines whether a node belongs to `Text`/u,
	);
	assert.match(
		typography,
		/role that\s+appears once still receives a source-neutral `Text` value/u,
	);
	assert.match(
		typography,
		/replace the inherited scale as one required automatic owner migration/u,
	);
	assert.match(
		typography,
		/map every accepted role onto the closest stable semantic `Text` identifier/u,
	);
	assert.match(
		typography,
		/do not edit callers that already use the correct semantic `Text` API/u,
	);
	assert.match(typography, /actual face and weight calibrated during Compose/u);
	assert.match(
		evidencedOwners,
		/One\s+route is sufficient for an existing owner-domain migration/u,
	);
	assert.match(
		evidencedOwners,
		/stale Compose packet may remain recovery evidence,\s+but it does not override a current explicit acceptance/u,
	);
	assert.match(
		evidencedOwners,
		/mere invocation without\s+either form of acceptance is not enough/u,
	);
	assert.match(
		evidencedOwners,
		/Do not preserve a foreign template recipe as fallback/u,
	);
	assert.match(
		evidencedOwners,
		/foreign\s+inherited `Logo` geometry must not remain the instance default/u,
	);
	assert.match(
		evidencedOwners,
		/missing product wordmark is an asset\/preflight blocker for that variant, not a\s+reason to preserve template branding/u,
	);
	assert.match(
		evidencedOwners,
		/not a\s+reason to preserve template branding or turn the replacement into a human\s+recommendation/u,
	);
	assert.match(evidencedOwners, /header lock from Compose is not a Logo veto/u);
	assert.match(
		evidencedOwners,
		/replace the inherited primary recipe as\s+required automatic work/u,
	);
	assert.match(evidencedOwners, /Sharing one route does not create ambiguity/u);
	assert.match(
		evidencedOwners,
		/add a\s+source-neutral opt-in value to the existing owner and migrate the accepted\s+consumers automatically/u,
	);
	assert.match(
		evidencedOwners,
		/Do not present default replacement, opt-in\s+ownership, and continued local duplication as equally unresolved choices/u,
	);
	assert.match(
		evidencedOwners,
		/Split identical literals that serve different semantic roles/u,
	);
	assert.match(
		evidencedOwners,
		/accepted shared-shell presentation belongs to the existing shell\s+owner and replaces untouched inherited presentation/u,
	);
	assert.match(
		confidence,
		/one page does not lower confidence for a role moving into its existing unchanged\s+semantic owner/u,
	);
	assert.match(
		confidence,
		/External preservation locks identify affected consumers or\s+sequencing/u,
	);
	assert.match(
		confidence,
		/independently reviewable scopes can be sufficient on one page/u,
	);
	assert.match(
		confidence,
		/unchanged inherited caller is not evidence for extension/u,
	);
	assert.doesNotMatch(systemize, /every repeated full\s+typography/iu);
	assert.doesNotMatch(
		confidence,
		/one page may prevent automatic acceptance/iu,
	);
	assert.doesNotMatch(
		confidence,
		/External preservation locks lower confidence/iu,
	);
	assert.doesNotMatch(
		evidencedOwners,
		/preserve the current owner until canonical identity is confirmed/iu,
	);
	assert.match(metadata, /exhaustively replace inherited template recipes/u);
	assert.match(
		metadata,
		/established Text, Logo, Button, repeated compound, Section-axis, media, route, and link ownership/u,
	);
});

test("Systemize replaces central recipes without migrating correct template callers", async () => {
	const [systemize, confidence, evidencedOwners, typography, metadata] =
		await Promise.all([
			readSkill("systemize-composition"),
			readSkill("systemize-composition", "references/confidence.md"),
			readSkill("systemize-composition", "references/evidenced-owners.md"),
			readSkill("systemize-composition", "references/typography.md"),
			readSkill("systemize-composition", "agents/openai.yaml"),
		]);

	assert.match(
		systemize,
		/Stable semantic owner APIs are compatibility boundaries/u,
	);
	assert.match(
		systemize,
		/leave that call site intact and replace the\s+recipe centrally/u,
	);
	assert.match(systemize, /do not require a caller-by-caller migration/u);
	assert.match(
		systemize,
		/Edit a caller only when it names the wrong semantic role, uses a breaking API\s+that independently must change, or contains a local visual override/u,
	);
	assert.match(systemize, /unchanged inherited consumers never justify it/u);
	assert.match(
		typography,
		/preserving semantic variant names, not\s+preserving their old pixels/u,
	);
	assert.match(
		typography,
		/new opt-in variant is not a compatibility device\s+for shielding inherited callers/u,
	);
	assert.match(
		typography,
		/unchanged template callers\s+continue compiling against their stable semantic identifiers while inheriting\s+the new recipes/u,
	);
	assert.match(
		evidencedOwners,
		/Existing correct `primary` callers inherit that\s+recipe without call-site migration/u,
	);
	assert.match(
		evidencedOwners,
		/Do not add a parallel primitive action\s+variant merely to preserve their prior appearance/u,
	);
	assert.match(
		evidencedOwners,
		/Keep\s+correct existing `Logo` call sites intact/u,
	);
	assert.match(evidencedOwners, /Reconcile each variant independently/u);
	assert.match(
		confidence,
		/Correct inherited callers do not need migration or visual\s+preservation/u,
	);
	assert.match(
		metadata,
		/Preserve stable semantic APIs, not inherited pixels/u,
	);
	assert.doesNotMatch(
		typography,
		/enumerate and intentionally migrate other inherited-template consumers/iu,
	);
	assert.match(
		systemize,
		/Historical agent plans, audit recommendations, task summaries, and memory are\s+discovery context only/u,
	);
	assert.match(systemize, /current skill contract wins/u);
	assert.match(
		systemize,
		/map every existing public identifier for that\s+owner/u,
	);
	assert.match(
		systemize,
		/Do not add a public identifier until\s+this replacement map is complete/u,
	);
	assert.match(
		systemize,
		/header lock from Compose—does not convert that consumer into prior product\s+design evidence/u,
	);
	assert.match(
		typography,
		/Do not create a parallel\s+family of product-, source-, style-, or editorial-prefixed values/u,
	);
	assert.match(
		evidencedOwners,
		/compound must invoke the replaced\s+`primary` role/u,
	);
	assert.match(
		evidencedOwners,
		/must not add `segmented`, `compound`, or another relationship-\s*named value to Button's primitive variant axis/u,
	);
	assert.match(
		evidencedOwners,
		/make the accepted canonical\s+value that axis's default/u,
	);
	assert.match(
		confidence,
		/Historical agent recommendations, memory, and plan-only audit outcomes are not\s+human decisions/u,
	);
	assert.match(metadata, /every inherited public identifier must be remapped/u);
	assert.match(
		metadata,
		/compound must consume the replaced Button primary role/u,
	);
});

test("Systemize audits every domain and makes non-automatic recommendations actionable", async () => {
	const systemize = await readSkill("systemize-composition");

	for (const domain of [
		"typography signatures",
		"controls",
		"links",
		"identity and contextual marks",
		"media treatments",
		"shell and footer presentation",
		"repeated layout roles",
		"tokens",
		"defaults",
		"temporary visual wrappers",
	]) {
		assert.match(
			systemize,
			new RegExp(domain.replaceAll(" ", "\\s+"), "u"),
			`missing inventory domain: ${domain}`,
		);
	}
	assert.match(systemize, /Account for\s+every domain in the final audit/u);
	assert.match(systemize, /Do not\s+silently omit a domain/u);
	assert.match(
		systemize,
		/explicitly non-automatic invocation recommends candidates at\s+every confidence level but applies none/u,
	);
	assert.match(
		systemize,
		/recommended owner\/default\/variant\/token\/compound action/u,
	);
	assert.match(
		systemize,
		/superseded inherited and\s+local recipes to retire/u,
	);
	assert.match(systemize, /concrete central migration/u);
	assert.match(
		systemize,
		/Existing owner overlap cannot resolve as\s+local solely because/u,
	);
	assert.doesNotMatch(
		systemize,
		/per-consumer table|visual-effect table|composition record/iu,
	);
});

test("Systemize automatic execution reconciles every candidate before stopping", async () => {
	const [systemize, metadata] = await Promise.all([
		readSkill("systemize-composition"),
		readSkill("systemize-composition", "agents/openai.yaml"),
	]);

	assert.match(systemize, /task-local action manifest in the runtime\s+plan/u);
	assert.match(systemize, /before the first product edit/u);
	assert.match(
		systemize,
		/every discovered candidate one row\s+naming its domain/u,
	);
	assert.match(
		systemize,
		/Reconcile\s+those rows against the evidenced-owner and typography references before\s+consulting confidence/u,
	);
	assert.match(
		systemize,
		/pre-edit action manifest must account for\s+every domain and every independently discovered candidate/u,
	);
	assert.match(
		systemize,
		/Choose default versus\s+opt-in shape from canonical-versus-additional role evidence/u,
	);
	assert.match(systemize, /Expected effects on inherited consumers/u);
	assert.match(
		systemize,
		/required-automatic or high-confidence action-manifest row cannot be omitted,\s+deferred, or reclassified before its isolated attempt/u,
	);
	assert.match(
		systemize,
		/required row stays\s+required and becomes blocked after its compliant alternatives fail/u,
	);
	assert.match(
		systemize,
		/Do not turn an expected replacement\s+of foreign identity in an inherited header/u,
	);
	assert.match(
		systemize,
		/checkpoint cannot be\s+reached while a domain is omitted/u,
	);
	assert.match(systemize, /executable automatic row was never\s+attempted/u);
	assert.match(metadata, /attempt every executable automatic row/u);
	assert.match(metadata, /every required owner domain/u);
	for (const domain of [
		"typography",
		"primitive actions",
		"action compounds",
		"identity",
		"media",
		"routes and links",
		"repeated layout and Section axes",
		"tokens and defaults",
		"shell and footer presentation",
		"temporary wrappers or renderer boundaries",
	]) {
		assert.match(
			systemize,
			new RegExp(domain.replaceAll(" ", "\\s+"), "u"),
			`missing automatic manifest domain: ${domain}`,
		);
	}
	assert.match(systemize, /Write `none` plus the inspected evidence/u);
	assert.match(systemize, /compressed or catch-all row is incomplete/u);
	assert.match(
		systemize,
		/Route a required row as `automatic blocked` only when a named external input\s+or prerequisite makes implementation impossible/u,
	);
	assert.match(
		systemize,
		/Missing exact assets[\s\S]*cannot turn a\s+settled owner into a confidence question/u,
	);
	assert.match(
		systemize,
		/settled owner was silently reframed as a human decision/u,
	);
	assert.match(
		systemize,
		/failed first implementation shape is not a\s+veto while the governing concern supplies another conforming shape/u,
	);
	assert.match(
		systemize,
		/Do not call Systemize complete when any required check fails/u,
	);
	assert.match(metadata, /keep blocked required rows incomplete/u);
	assert.match(
		systemize,
		/Automatic work remains an uncommitted review candidate/u,
	);
	assert.doesNotMatch(
		systemize,
		/manifest\.md|action-manifest\.json|implementation ledger/iu,
	);
});

test("durable design-system documents contain human decisions, not lifecycle state", async () => {
	const systemize = await readSkill("systemize-composition");

	assert.match(systemize, /docs\/design-system\/decisions\/<focus-slug>\.md/u);
	assert.match(
		systemize,
		/only after the\s+human approves, rejects, or defers/u,
	);
	assert.match(systemize, /Do not write\s+proposed-but-undecided rows/u);
	assert.match(systemize, /workflow status, implementation status/u);
	assert.match(systemize, /Code, consumers, and Storybook remain\s+the truth/u);
});

test("Animate requires an accepted static target and keeps its endpoint exact", async () => {
	const animate = await readSkill("animate");

	assert.match(animate, /explicit user\s+request for animation/u);
	assert.match(animate, /current native static Target/u);
	assert.match(animate, /Preserve the accepted motion-off endpoint exactly/u);
	assert.match(animate, /linked `\$averlo:visual-parity`/u);
	assert.match(
		animate,
		/app\/shared\/frontend\/interaction\/responsive-and-motion/u,
	);
	assert.match(animate, /canonical interaction verification procedure/u);
	assert.doesNotMatch(animate, /active plane|handoff state/iu);
});

test("section construction belongs to marketing owners and scoped source procedures", async () => {
	const [owner, intake, focus, compose] = await Promise.all([
		readRepository("src/lib/marketing-content/AGENTS.md"),
		readSkill("compose", "references/source-intake.md"),
		readSkill("visual-parity", "references/focus-packet.md"),
		readSkill("compose"),
	]);
	for (const required of [
		"MarketingPageDocument",
		"renderMarketingSections",
		"Section.Background",
		"Storybook contract",
		"one named renderer",
		"Tailwind",
		"media",
		"independently reviewable semantic/source section",
		"exactly one shared `Section`",
		"meaningful source-neutral content/media",
		"generated",
	])
		assert.ok(owner.includes(required), `missing structural rule: ${required}`);
	assert.match(owner, /headers, footers, multiple independent source cases/u);
	assert.match(
		owner,
		/sections\/\*\*\/<blockType>\/<PascalBlockType>Section\.tsx/u,
	);
	assert.match(
		intake,
		/stable case ID, source-neutral block type, registered renderer and Target/u,
	);
	assert.match(intake, /shell case with a shell selector/u);
	assert.match(
		intake,
		/never a\s+content block, registered renderer or shared `Section` root/u,
	);
	assert.match(intake, /separate source or parity cases/u);
	assert.match(intake, /Pause when source evidence/u);
	assert.match(
		focus,
		/Only content cases contribute to\s+registered-renderer counts/u,
	);
	assert.match(
		compose,
		/always follows `app\/marketing\/composition\/marketing-composition`/u,
	);
	assert.doesNotMatch(compose, /Section\.Background|renderMarketingSections/u);
});

test("route and marketing verifiers reject implementation-shape bypasses", async () => {
	const [routes, sections] = await Promise.all([
		fs.readFile(
			path.resolve(process.cwd(), "scripts/verify/verify-route-surfaces.ts"),
			"utf8",
		),
		fs.readFile(
			path.resolve(
				process.cwd(),
				"scripts/verify/verify-marketing-section-policy.ts",
			),
			"utf8",
		),
	]);

	assert.match(routes, /for \(const pagePath of collectPages\(appRoot\)\)/u);
	assert.match(routes, /Page bypasses route-family ownership/u);
	assert.match(sections, /documentArchitectureExemptions/u);
	assert.match(sections, /must resolve a MarketingPageDocument/u);
	assert.match(sections, /sectionRootCounts/u);
	assert.match(sections, /exactly one shared Section root/u);
	assert.match(
		sections,
		/cannot use route-local JSX as an alternate architecture/u,
	);
});

test("Compose calibrates font faces and requires exact exported vector identity", async () => {
	const [intake, media] = await Promise.all([
		readSkill("compose", "references/source-intake.md"),
		readRepository("src/lib/marketing-content/AGENTS.md"),
	]);

	assert.match(intake, /Figma weight labels/u);
	assert.match(intake, /separate evidence/u);
	assert.match(intake, /glyph shape, measured width, line\s+breaks/u);
	assert.match(
		intake,
		/Do not map one physical face to a broad\s+weight range/u,
	);
	assert.match(intake, /Disable font synthesis/u);
	assert.match(intake, /export that exact logo or mark as SVG/u);
	assert.match(intake, /never redraw it, replace it with text or a glyph/u);
	assert.match(media, /Keep exact SVG assets as vectors/u);
});

test("marketing media policy is composed, deterministic, and narrowly exemptable", async () => {
	const [media, verifier, surface] = await Promise.all([
		readRepository("src/lib/marketing-content/AGENTS.md"),
		fs.readFile(
			path.resolve(
				process.cwd(),
				"scripts/verify/verify-marketing-media-policy.mjs",
			),
			"utf8",
		),
		fs.readFile(
			path.resolve(process.cwd(), "template-surfaces/marketing.mjs"),
			"utf8",
		),
	]);

	assert.match(
		media,
		/averlo-media-exception-next-line <rule> -- <rationale>/u,
	);
	assert.match(media, /One annotation exempts one reported rule once/u);
	assert.match(media, /non-waivable/u);
	assert.match(media, /npm run verify:marketing-media/u);
	assert.match(media, /npm run verify:marketing/u);
	assert.match(verifier, /exemptableMarketingMediaRules/u);
	assert.match(verifier, /temporary-media-url/u);
	assert.match(verifier, /reference-capture/u);
	assert.match(surface, /"verify:marketing"/u);
	assert.match(surface, /"verify:marketing-media"/u);
});

test("composition review preserves the excluded header and types every authority region", async () => {
	const [compose, focusPacket, marketing] = await Promise.all([
		readSkill("compose"),
		readSkill("visual-parity", "references/focus-packet.md"),
		readRepository("src/app/(site)/(marketing)/_components/AGENTS.md"),
	]);

	assert.match(compose, /header remains unchanged in\s+the shared shell/u);
	assert.match(
		compose,
		/an evidenced footer is implemented only through its shell/u,
	);
	assert.match(focusPacket, /Authority boundaries:/u);
	assert.match(focusPacket, /Authority locks:/u);
	for (const field of [
		"Content cases:",
		"Shell cases:",
		"Excluded regions:",
		"Accumulated gate:",
	]) {
		assert.ok(
			focusPacket.includes(field),
			`missing typed focus field: ${field}`,
		);
	}
	assert.match(
		compose,
		/Each content\s+case must name one authoritative Figma section frame/u,
	);
	assert.match(compose, /evidenced footer shell cases/u);
	assert.match(compose, /accumulated page is a\s+comparison gate/u);
	assert.match(focusPacket, /never for the untouched whole frame/u);
	assert.match(marketing, /content-plus-footer composition\s+frames/u);
	assert.match(
		marketing,
		/approved header is immutable and excluded from source\s+parity/u,
	);
	assert.match(marketing, /never\s+route CSS/u);
});

test("Compose uses one identity-verified capability-complete Figma connector", async () => {
	const [intake, focusPacket] = await Promise.all([
		readSkill("compose", "references/source-intake.md"),
		readSkill("visual-parity", "references/focus-packet.md"),
	]);

	assert.match(intake, /configured primary official Figma connector/u);
	assert.match(intake, /require\s+`webvizionagency@gmail\.com`/u);
	assert.match(intake, /Do not combine identity proof\s+from one connector/u);
	assert.match(intake, /read-only operations never require\s+an Agent Space/u);
	assert.match(intake, /one reusable generic Figma scratch location/u);
	assert.match(
		intake,
		/Never create a target-, route-, task-, or source-page-/u,
	);
	assert.match(
		intake,
		/absence of a clone\s+or dedicated cloning operation must not block/u,
	);
	assert.match(focusPacket, /Agent Space: <reused generic file\/page/u);
	assert.doesNotMatch(intake, /installed Figma app connector by default/u);
});

test("Systemize reviews accepted local renderer boundaries without redefining Compose success", async () => {
	const [compose, sections, systemize] = await Promise.all([
		readSkill("compose"),
		readSkill("compose", "references/source-intake.md"),
		readSkill("systemize-composition"),
	]);

	assert.match(compose, /support one honest comparison case/u);
	assert.match(sections, /human-reviewed\s+Systemize Composition decision/u);
	assert.match(
		systemize,
		/renderer or section-boundary split\/merge as `medium` by default/u,
	);
	assert.match(systemize, /focused route\s+and marketing-section checks/u);
	assert.match(systemize, /purely local renderer-boundary decision/u);
	assert.match(
		systemize,
		/unless it also decides a shared design-system owner/u,
	);
});

test("Compose maintains section recovery evidence without a second workflow record", async () => {
	const [compose, focusPacket] = await Promise.all([
		readSkill("compose"),
		readSkill("visual-parity", "references/focus-packet.md"),
	]);

	assert.match(focusPacket, /Active case:/u);
	for (const retiredField of [
		"Thread identity:",
		"Section boundary:",
		"Next case:",
		"Continuation token:",
	]) {
		assert.ok(
			!focusPacket.includes(retiredField),
			`retired continuation field remains: ${retiredField}`,
		);
	}
	assert.match(compose, /reload the focus packet, its matrix row/u);
	assert.match(
		compose,
		/immediately continue within\s+the same model response/u,
	);
	assert.match(
		compose,
		/A closed section with another ordered\s+case is never a terminal condition/u,
	);
	assert.match(compose, /Do not stop for user input, end the response/u);
	assert.doesNotMatch(compose, /plugin's scoped Stop hook/u);
	assert.doesNotMatch(compose, /unique continuation token/u);
	assert.match(
		compose,
		/Do not add a goal, composition\s+record, checklist file/u,
	);
	assert.match(compose, /request `\/compact`/u);
	assert.match(focusPacket, /recovery evidence/u);
	assert.match(focusPacket, /not lifecycle status, a workflow ledger/u);
	await assert.rejects(
		fs.access(path.join(skillsRoot, "compose", "references", "checklist.md")),
		{ code: "ENOENT" },
	);
});

test("Compose cannot self-accept review or leave a correctable nonzero case", async () => {
	const [compose, focusPacket] = await Promise.all([
		readSkill("compose"),
		readSkill("visual-parity", "references/focus-packet.md"),
	]);

	assert.match(compose, /run a compare-correct-\s*compare loop/u);
	assert.match(
		compose,
		/If any concrete Target-owned mismatch remains, continue the same case/u,
	);
	assert.match(compose, /Write `Human review:\s+pending`/u);
	assert.match(compose, /only the user's explicit\s+response/u);
	assert.match(focusPacket, /agent must not infer either state/u);
	assert.match(
		focusPacket,
		/classify it as incomparable if they\s+remain visible/u,
	);
});

test("Compose repairs comparability and proves symmetric authority before measuring", async () => {
	const [compose, focusPacket] = await Promise.all([
		readSkill("compose"),
		readSkill("visual-parity", "references/focus-packet.md"),
	]);

	assert.match(
		compose,
		/Reject a\s+capture containing excluded pixels or unequal authority regions/u,
	);
	assert.match(
		compose,
		/repair its crop, selector, review state, or Target-owned\s+dimensions/u,
	);
	assert.match(compose, /symmetrically included\s+source and Target regions/u);
	assert.match(
		compose,
		/full source frame compared with a\s+header-hidden Target is invalid/u,
	);
	assert.match(focusPacket, /Authority equivalence:/u);
	assert.match(
		focusPacket,
		/Verify region membership and order, not dimensions alone/u,
	);
});

test("Compose rejects nonzero rationalizations", async () => {
	const compose = await readSkill("compose");

	assert.match(compose, /`changedPixels: 0` is the only `exact` result/u);
	assert.match(
		compose,
		/Every comparable nonzero result\s+remains `measured`/u,
	);
	assert.match(compose, /layout geometry, spacing, alignment/u);
	assert.match(compose, /suspected antialiasing/u);
	assert.match(compose, /generic renderer-noise claim cannot close a case/u);
	assert.match(compose, /asset identity, crop, scale/u);
	assert.match(
		compose,
		/If any concrete Target-owned mismatch remains, continue/u,
	);
});

test("Visual Parity stays mechanical across both composition workflows", async () => {
	const visualParity = await readSkill("visual-parity");

	for (const purpose of [
		"source-parity",
		"integration-parity",
		"responsive-system-fit",
		"static-endpoint",
	]) {
		assert.match(visualParity, new RegExp(`\`${purpose}\``, "u"));
	}
	assert.match(visualParity, /never edits product code/u);
	assert.match(visualParity, /never decides a verdict/u);
	assert.match(visualParity, /Zero changed pixels reports identical captures/u);
	assert.match(
		visualParity,
		/without deciding whether it was\s+intended or acceptable/u,
	);
	assert.match(visualParity, /`native-invalid`/u);
	assert.doesNotMatch(visualParity, /active plane|peer skill|goal lifecycle/iu);
});

test("active composition workflows do not depend on a goal ledger", async () => {
	const sources = await Promise.all(
		["compose", "systemize-composition", "animate", "visual-parity"].map(
			(name) => readSkill(name),
		),
	);
	assert.doesNotMatch(
		sources.join("\n"),
		/goal-ledger-prep|goal ledger|workflow ledger|composition record|active plane|peer skill/iu,
	);
});
