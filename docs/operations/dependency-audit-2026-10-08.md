# Template dependency audit — 8 October 2026

## Scope and interpretation

This is a read-only dependency audit of the current local template workspace,
including its ongoing uncommitted changes. It is not an audit of the older
published npm generator snapshot. No dependencies were removed by this audit.

`create-averlo` declares no npm dependencies because its own CLI uses Node's
built-in modules and invokes Git/npm. During generation, it fetches its pinned
template commit, assembles the selected profile, and installs that generated
project's separate package manifest. The npm dependency badge describes the CLI;
it does not describe everything the CLI installs into the generated application.

The current local root manifest declares **33 runtime dependencies** and
**21 development dependencies**. Its lockfile contains **1,291 non-root package
entries**, including transitive packages, development tools, duplicate versions,
and platform-specific packages. That is not a count of installed packages or
packages sent to the browser. Browser bundle size needs a production build
measurement; npm install footprint and client bundle footprint are different.

## What generated projects select

Counts below follow the current assembly manifests with no extra capabilities.
They count direct declarations, not transitive packages or bundle size.

| Profile | Content | Runtime declarations | Development declarations |
| --- | --- | ---: | ---: |
| full | static | 23 | 20 |
| full | payload-ready | 29 | 20 |
| app-only | static | 23 | 20 |
| marketing-only | static | 23 | 20 |
| marketing-only | payload-ready | 29 | 20 |
| thin-start | static | 18 | 20 |
| thin-start | payload-ready | 24 | 20 |

The assembly already uses positive selection: Payload's six packages are
selected only with its content surface, AI packages belong to the dashboard,
and Recharts belongs to the template's repository-footprint page. Root tooling
such as `js-tiktoken` does not automatically become a generated app dependency.
A new workspace is not an unrestricted copy of the root package manifest.

## Runtime package ownership

| Group | Packages | Current purpose |
| --- | --- | --- |
| Framework | `next`, `react`, `react-dom` | Application framework and rendering |
| Shared styling | `class-variance-authority`, `clsx` | Component variants and class composition |
| Icons | `@openai/apps-sdk-ui`, `@phosphor-icons/react` | OpenAI default icons; Phosphor fallbacks and existing direct consumers |
| Composition | `@radix-ui/react-slot` | Shared element/slot composition |
| Animation | `motion` | Shared transitions and interactive motion |
| Notifications | `sonner` | Toast rendering |
| Telephone input | `libphonenumber-js` | Parsing, formatting, validation and country data |
| Streaming/Markdown | `streamdown`, `react-markdown`, `remark-gfm` | Streaming rendering and non-streaming Markdown rendering |
| Markdown editor | `@mdxeditor/editor`, `micromark`, `micromark-extension-directive`, `micromark-extension-mdx-jsx`, `micromark-extension-mdx-md` | Rich editing and directive/MDX parsing |
| Files | `pdfjs-dist` | PDF viewing and thumbnail generation |
| Build output | `next-sitemap` | Sitemap postbuild command |
| Assistant | `ai`, `@ai-sdk/openai` | Server assistant runtime and OpenAI provider |
| CMS | `payload`, `@payloadcms/db-postgres`, `@payloadcms/next`, `@payloadcms/richtext-lexical`, `@payloadcms/storage-vercel-blob`, `sharp` | Payload integration, storage and image processing |
| Template demonstration | `recharts` | Repository-footprint charts; isolated surface |
| Review candidates | `@ai-sdk/react`, `@tanstack/react-hotkeys`, `react-phone-number-input` | No consuming source import found in the current local scan; see below |

Development dependencies cover formatting (`@biomejs/biome`), compilation
(`typescript`, `tsx`, React/Node type packages), Tailwind/PostCSS, Storybook and
its five addons plus Next/Vite integration, Vite, Vitest/browser/coverage tools,
Playwright, and template-only token measurement (`js-tiktoken`). These tools can
make installation large without becoming client-side application code.

## Icons: two libraries, not nine

The application uses OpenAI Apps SDK UI icons by default. Phosphor supplies
unsupported glyphs and real filled states; some shared components also import
Phosphor directly. Local custom SVGs supply brand/special-purpose marks.

The nine-family HomePackComparison story reads saved SVG strings from
`src/components/ui/icons/homeComparison.fixture.json`. It does not install nine
icon packages. Its statement that Phosphor is the current app default is stale;
the icon owner instructions and providers now select OpenAI.

Consolidating onto one package would require replacing the fallback glyphs,
filled states and direct consumers, and reviewing visual parity. Removing
Phosphor without that work would change the current interface. Importing a
package does not by itself prove its entire icon catalogue enters the browser;
measure production output before making that claim.

## Cleanup candidates and order

1. **`react-phone-number-input`: strongest removal candidate.** The current
   PhoneInput uses `libphonenumber-js/min` and Averlo's own controls. No source
   import of `react-phone-number-input` was found. Remove it from the root and
   core/thin-start assembly contracts together, regenerate lockfiles, and verify
   the phone input and generated profiles.
2. **`@ai-sdk/react`: likely unused in the current assistant.** No source import
   was found; the runtime uses server SDK packages and a custom frontend.
   The dashboard surface and profile verifier explicitly require it today, so
   removal must update those contracts and verify assistant behavior.
3. **`@tanstack/react-hotkeys`: investigate the current local snapshot.** The
   package appears in assembly dependency sets, but no source import was found.
   Confirm there is no pending integration that needs it before removal; update
   the core and thin-start manifests together and verify command shortcuts.
4. **Narrow the shared core where product needs justify it.** Rich editing, PDF
   viewing and the full Storybook toolchain are substantial capabilities. Making
   them optional changes what a generated project can do and requires an
   explicit product/scope decision. The template already has profile/surface
   selection; prefer extending it over splitting the repository into several
   public packages just to improve the npm dependency badge.
5. **Measure overlapping implementations.** `streamdown` and `react-markdown`
   have separate current code paths. Their coexistence warrants measurement and
   functional review, not immediate deletion. The committed remote template
   also contains GSAP/Lenis consumers; their absence from this local manifest
   does not establish that the pending cleanup has shipped.

The scan covers source, scripts, assembly/profile manifests and Storybook plus
root configuration checks. A missing static import is evidence for review, not
proof that a package has no build-time, peer, dynamic or pending use.

## Download counts

The npm downloads API reports **128 downloads on 6 September 2026**, the original
publication day, and **168 total from 6 September through 7 October**. Its
last-week endpoint currently reports **3 downloads for 28 September–4 October**.

Launch testing/automation is a plausible explanation for the publication-day
spike. Aggregate counts do not identify the downloader, so they cannot prove all
128 were ours or establish 128 distinct users. Local tarball smoke tests also
should not be equated with downloads of the public generator package.

Sources: npm's package dependency documentation
(https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file/),
the public downloads API
(https://api.npmjs.org/downloads/range/2026-09-06:2026-10-07/create-averlo),
and the repository's `packages/create-averlo/lib/create-project.mjs`,
`template-assembly/manifest.mjs`, `template-assembly/assembler.mjs`, profile/surface
manifests, icon registries, and current application imports.

## Release status

Automatic publication has been implemented on remote `main`. The initial run
passed the profile, installed-project and exact-archive checks, then failed npm
publishing because no trusted publisher was configured. The prepared npm
connection still requires the user's pending authorization. This audit does
not constitute that authorization or change the public release state.

## Cleanup implemented after this audit

Removed `@phosphor-icons/react`, `react-phone-number-input`, `@ai-sdk/react`, and
`@tanstack/react-hotkeys` from the local root/profile/assembly contracts and
regenerated the lockfile. All direct Phosphor consumers now use the shared Icon
provider. OpenAI is the only external icon library; brands use existing local
SVGs, editor controls use local stroke glyphs, and native SDK fill variants remain.
The public IconWeight type is now owned locally for compatibility; unsupported
filled glyphs render their native outline rather than importing a second pack.
The icon comparison fixture remains saved reference artwork only.

The cleanup removes four direct runtime dependencies. `npm install` removed 12
installed packages. These changes are local and remain separate from npm release
authorization and publishing.

## Verification and publishing follow-up

The cleanup passed type checking, surface contracts, the complete profile matrix,
eight focused stories, and a coverage check retaining all 76 formerly supported
Phosphor registry names. Runtime declarations are now 29 and non-root lockfile
entries 1,279. The full Storybook run passed 358 stories but reported failures in
ten distinct stories outside this cleanup's icon/date/dropdown/listbox/social
coverage (modal, assistant approval, button, carousel, export, segmented control).
No unrelated behavior or contrast fixes were included.

The npm publishing connection was subsequently approved and saved with two-factor
authentication. `create-averlo@0.1.2` is public, and a fresh npm-based project was
successfully generated from commit `a4c074fe5c12b186bdf95825a6d2e6c9d4a0bf58`.
The initial post-publish check ran before npm finished processing; remote main
now includes a bounded registry-propagation wait. The local dependency cleanup
is not part of that published snapshot.
