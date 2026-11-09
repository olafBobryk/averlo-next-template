# Averlo Next Template

![Averlo Next Template banner](public/averlo-next-template-banner.png)

A Next.js starter you hand to your coding agent: one command makes a clean,
independent project, and the agent takes it from there.

## Quick start

```sh
npx --yes create-averlo my-project --profile full
```

Prefer a smaller start? Swap `full` for `marketing-only`, `app-only` or
`thin-start`.

Then paste this to your coding agent (Codex, Claude Code or similar):

> Open `my-project`. Read `AGENTS.md` and `PRODUCT.md`, help me fill in what
> the product is, then start the preview and show me the site. Follow the
> project's specs and workflows, and keep secrets out of chat and Git.

## What you get

- **A design system with Storybook.** Ready-made components, each with live
  stories and tests, so pages are built from parts that already work.
- **Specs your agent follows.** Behaviour is written down with
  [Spec Kit](https://github.com/github/spec-kit), so changes start from a clear
  rule instead of a guess.
- **Step-by-step workflows.** Repeatable procedures for writing a spec,
  building from a design, verifying, publishing and more.
- **Motion and smooth scroll.** Built-in reveal, hover and scroll animation
  with smooth page scrolling that respects reduced motion.
- **A marketing site and an app dashboard.** Public pages plus sign-in and a
  dashboard; pick the profile that includes the parts you need.
- **Checks that catch mistakes.** Lint, type checks, unit and Storybook tests
  and a production build run locally and in CI.

## Learn more

- [Specs map](specs/README.md)
- [Workflows](WORKFLOWS.md)
- [Docs](docs/)
- [create-averlo](packages/create-averlo/README.md)
- [Averlo agent plugin](plugins/averlo/README.md)
