# ADR 0001 — Radix UI as the Accessibility Foundation

**Status:** Accepted  
**Date:** 2026-05-21  
**Deciders:** Fábio Dias Hauck

---

## Context

Building accessible React primitives from scratch means owning every layer of the accessibility contract: WAI-ARIA roles and attributes, keyboard interaction patterns, focus management, and screen-reader announcements. The [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) specifies these patterns in detail, but the specification is long, the edge cases multiply quickly, and divergence from the spec is silent — broken keyboard navigation does not throw a JavaScript error.

Concrete failure modes in a roll-your-own approach:

- **Dialog / modal**: focus must be trapped inside the overlay while it is open, returned to the trigger on close, and the `aria-modal` + `aria-hidden` tree must be wired correctly so that content behind the overlay is unreachable to assistive technology.
- **Menu / DropdownMenu**: the `roving tabindex` pattern means only one item is in the tab order at a time; arrow keys move focus; Home/End jump to boundaries; typeahead must match across multiple keystrokes within a timing window.
- **Tooltip**: must not appear on focus alone without also appearing on hover; must dismiss on `Escape`; the anchor element needs `aria-describedby` pointing to the tooltip content.
- **Checkbox / Switch**: indeterminate state (`aria-checked="mixed"`) and controlled/uncontrolled mode both require careful synchronisation between the visual representation and the ARIA attribute.

Getting any one of these wrong produces a component that passes a visual review but fails an axe-core scan, a NVDA test, or a keyboard-only user's workflow. Maintaining this surface across eight primitives — and keeping it correct as React itself evolves — represents significant ongoing engineering investment with no differentiated value for the portfolio's intended audience.

The library's value proposition is the **composition layer** on top of headless primitives: polymorphic `as`-prop typing, CSS custom-property token theming, and a zero-runtime styling contract. That is where the TypeScript and design-system engineering is demonstrated, not in reimplementing ARIA keyboard patterns that already have a well-maintained open-source implementation.

---

## Decision

Use **Radix UI** (`@radix-ui/*` packages) as the headless accessibility layer for all eight primitives. Each component in `react-accessible-primitives` wraps the corresponding Radix primitive — `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-tooltip`, `@radix-ui/react-checkbox`, etc. — and delegates:

- Keyboard event handling (Tab, Shift+Tab, arrow keys, Enter, Space, Escape)
- Focus trap lifecycle and restoration
- ARIA role, state, and property wiring
- Accessible name / description linkage (`aria-labelledby`, `aria-describedby`)

The wrapper layer owns:

- The polymorphic `as`-prop generic (`type PolymorphicRef`, `type PolymorphicComponentProps`) with no `any` escape hatches
- CSS custom-property token forwarding via `style` prop merging
- Forwarded `ref` with the correct element type inferred from `as`
- axe-core test assertions confirming zero violations in default, disabled, and error states
- Storybook stories with controls wired to token values

### Alternatives considered

| Alternative | Reason rejected |
|---|---|
| **Headless UI (Tailwind Labs)** | Tightly coupled to React Router's `Transition`; composability model is less flexible; no standalone package per primitive — all-or-nothing install. |
| **Ariakit (Reakit v2)** | Solid accessibility story, but the API surface is larger and the bundle overhead per primitive exceeds Radix's (~5–8 KB gzipped vs ~2–5 KB). For a portfolio demonstrating bundle discipline with a ≤50 KB pack gate, the difference is material. |
| **Roll-your-own WAI-ARIA** | Highest correctness risk (see Context above). Maintenance burden grows with every React major. The portfolio's signal is TypeScript depth and composition patterns, not ARIA reimplementation. |

---

## Consequences

### Positive

- **Correctness by default**: Radix's keyboard and ARIA implementations are continuously tested against NVDA, VoiceOver, and axe-core. The library inherits that test coverage without owning it.
- **Per-primitive install**: consumers install only `@radix-ui/react-dialog` if they need Dialog; unused primitives add zero bytes to their bundle.
- **Unstyled contract**: Radix ships zero CSS, which aligns exactly with this library's CSS custom-property token model — no style overrides, no specificity battles.
- **React 18 compatible**: Radix tracks React releases; the concurrent-mode and `startTransition` correctness is handled upstream.

### Negative / trade-offs

- **Peer dependency surface**: consumers must install `@radix-ui/*` packages alongside `react`. The install step is documented in the README and enforced via `peerDependencies` in `package.json`.
- **Bundle size**: each Radix primitive adds ~2–5 KB gzipped to the consumer's bundle. The ≤50 KB pack gate in CI (npm pack unpacked) measures the library's own output, not the Radix runtime that ships separately to the consumer.
- **Radix upgrade cadence**: breaking changes in Radix (e.g., the v1 → v2 API rename in 2023) propagate to this library. Dependabot is configured to open PRs on `@radix-ui/*` minor and patch bumps; majors are reviewed manually.
- **API surface coupling**: component prop shapes mirror Radix's — some advanced Radix props (portal container, collision detection for floating elements) are intentionally not re-exported to keep the public API minimal. If consumers need them, they can compose Radix directly.

### Neutral

- This decision does not affect the TypeScript polymorphic typing layer, CSS token contracts, axe-core test strategy, or Storybook stories — those are owned entirely by this library regardless of the headless foundation.
