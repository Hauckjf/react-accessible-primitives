# React Accessible Primitives

![CI](https://github.com/Hauckjf/react-accessible-primitives/actions/workflows/ci.yml/badge.svg) ![License](https://img.shields.io/github/license/Hauckjf/react-accessible-primitives?color=blue) ![Last commit](https://img.shields.io/github/last-commit/Hauckjf/react-accessible-primitives)

> Eight accessible React primitives with polymorphic typing, CSS token theming, axe-core tests, and a GitHub Actions CI pipeline — ready to publish.

React 18 component library of 8 accessible primitives built on Radix UI. Each component uses a polymorphic typed `as` prop, CSS custom-property tokens for zero-runtime styling, and is verified by axe-core in Vitest. TypeScript is configured with `strict: true` and `noUncheckedIndexedAccess: true`; ESLint enforces no-`any` across the codebase. Bundled with tsup for ESM + CJS output with TypeScript declarations and inline source maps.

## Table of contents

- [About](#about)
- [Tech](#tech)
- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## About

React 18 component library of 8 accessible primitives built on Radix UI. Each component uses a polymorphic typed `as` prop, CSS custom-property tokens for zero-runtime styling, and is verified by axe-core in Vitest. TypeScript is configured with `strict: true` and `noUncheckedIndexedAccess: true`; ESLint enforces no-`any` across the codebase. Bundled with tsup for ESM + CJS output.

**What this demonstrates**

- Polymorphic component typing with TypeScript generics and no `any` escape hatches, enforced by `@typescript-eslint/no-explicit-any`
- ARIA-compliant primitive composition using Radix UI headless hooks
- axe-core a11y assertions wired into Vitest test suite, run in CI on every PR
- Library bundling with rollup: ESM + CJS + .d.ts declarations + source maps for consumer debugging
- Storybook interaction tests covering keyboard and focus ring behavior
- Strict TypeScript config (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) with zero type errors
- GitHub Actions CI pipeline: typecheck → lint → test → build → pack-size gate

## Tech

TypeScript · React 18 · Radix UI · Storybook · Vitest · rollup · axe-core · ESLint + @typescript-eslint · GitHub Actions

## Installation

```bash
git clone https://github.com/Hauckjf/react-accessible-primitives.git
cd react-accessible-primitives
# install dependencies
```

## Usage

_Examples coming with the first feature release._

## Architecture

The library is organized in four layers, each building on the one below:

```mermaid
graph TD
    A["CSS Custom Property Tokens<br/>:root { --rap-color-*, --rap-spacing-*, --rap-radius-* }"]
    B["Radix UI Headless Primitives<br/>ARIA roles · keyboard navigation · focus management"]
    C["Polymorphic as Wrapper<br/>PolymorphicComponentProps&lt;C, OwnProps&gt; utility type"]
    D["Component Public API<br/>Button · Input · Checkbox · Select · Dialog · Toast · Badge · Link"]

    A --> B
    B --> C
    C --> D
```

| Layer | Responsibility |
|-------|----------------|
| CSS Custom Property Tokens | Define the visual contract — colors, spacing, radii — as `:root` CSS variables. No JS runtime; consumers override with a single CSS rule. |
| Radix UI Headless Primitives | Handle ARIA semantics, keyboard navigation, and focus management. Components never re-implement what Radix already audits. |
| Polymorphic `as` Wrapper | Let callers swap the rendered HTML element while retaining full TypeScript prop narrowing. `as="a"` surfaces anchor attributes; `as="button"` surfaces button attributes. |
| Component Public API | The eight exported primitives consumers import. Each is documented with a prop table, token override example, and axe-core test coverage. |

Decision records for major design choices live in [`docs/adr/`](docs/adr/):

- [ADR 0001 — Radix UI as accessibility foundation](docs/adr/0001-radix-ui-as-accessibility-foundation.md)
- [ADR 0002 — Polymorphic `as` prop](docs/adr/0002-polymorphic-as-prop.md)

## Definition of done

- All 8 components accept a typed polymorphic `as` prop without casting to `any`; `@typescript-eslint/no-explicit-any` reports zero violations across the entire codebase
- `tsconfig.json` sets `strict: true`, `noUncheckedIndexedAccess: true`, and `exactOptionalPropertyTypes: true`; `tsc --noEmit` exits with code 0
- ESLint config extends `@typescript-eslint/recommended` and `@typescript-eslint/recommended-requiring-type-checking`; `eslint .` exits with code 0
- CSS custom property tokens defined in a single `:root` block; no CSS-in-JS runtime
- axe-core reports zero violations for each component rendered in default, disabled, and error states
- Keyboard navigation (Tab, Enter, Space, Escape, Arrow keys) tested with Vitest + @testing-library/user-event
- Storybook story for each component with controls wired to token values
- rollup output: ESM (.mjs), CJS (.cjs), TypeScript declarations, and inline source maps (`sourcemap: true`) for both formats; package.json `exports` map covers both
- npm pack produces a tarball ≤ 50 KB (unpacked) with no transitive runtime deps beyond react + radix
- GitHub Actions workflow runs on every PR and blocks merge if any step fails: `tsc --noEmit` → `eslint .` → `vitest run` → `rollup -c` → `npm pack` with size assertion
- Package README includes: Installation (npm/pnpm/yarn), Quick Start code snippet, Component API table (props + types), Token Customization section (CSS variable override example), Accessibility notes, Contributing guide with PR checklist

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines on filing issues, proposing changes, and the pull request checklist.

## License

[MIT](LICENSE)
