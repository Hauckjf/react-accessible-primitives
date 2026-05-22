# ADR 0002 — Polymorphic `as` Prop

**Status:** Accepted  
**Date:** 2026-05-22

## Context

Component libraries face a core tension: a `Button` primitive must render as a native `<button>` by default but also as `<a>` for link-buttons or as a framework router `<Link>`. Hard-coding the rendered element breaks semantic flexibility. Allowing any element via an untyped prop discards the prop-type safety consumers expect from a TypeScript library — when `as="a"` the component should accept `href`; when `as="button"` it should reject `href` and accept `type`.

The requirement is: let callers swap the rendered HTML element at the call-site while TypeScript narrows allowed props to exactly those of the chosen element, with zero `any` escape hatches in the implementation.

## Options Considered

### A — Render Props

Pass a `renderRoot` function that returns the host element:

```tsx
<Button renderRoot={(props) => <a {...props} href="/home" />}>
  Click
</Button>
```

**Rejected.** Forces verbose call-site boilerplate; the component no longer reads like standard JSX. Prop-type safety lives inside the consumer's lambda rather than in the component contract, making the API surface unpredictable.

### B — Compound Components

Split into `<Button.Root>` / `<Button.Icon>` / `<Button.Label>` etc., where `Root` accepts the element type.

**Rejected for primitives.** Compound components solve widget-level composition; they add unnecessary surface area for a primitive whose callers simply need to change the rendered tag.

### C — `asChild` Only (Radix Slot)

Radix UI's `asChild` prop merges all primitive props onto the single child element:

```tsx
<Button asChild>
  <a href="/home">Click</a>
</Button>
```

**Partially adopted, not sufficient alone.** `asChild` is retained as an escape hatch on every primitive, but it requires callers to know the Radix Slot abstraction and supply their own child element. It does not provide the clean `as="a"` ergonomics this library targets.

### D — Polymorphic `as` Prop (chosen)

A generic `PolymorphicComponentProps<C extends ElementType, OwnProps>` utility type resolves props at the TypeScript level:

```tsx
<Button as="a" href="/home">Go</Button>          // href: valid ✓
<Button as="button" type="submit">Send</Button>  // type: valid ✓
<Button as="a" type="submit">X</Button>          // type error: <a> has no `type` ✗
```

TypeScript infers valid props from the `as` value at compile time. The runtime implementation delegates to Radix Slot internally, preserving all ARIA attribute merging.

## Decision

Expose a typed polymorphic `as` prop on every primitive in this library, backed by a `PolymorphicComponentProps` generic utility (approximately 30 lines in `src/utils/polymorphic.ts`). When `as` is omitted the primitive defaults to its semantic element (`button`, `a`, `input`, etc.).

The core utility type:

```typescript
type AsProp<C extends ElementType> = { as?: C };

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

export type PolymorphicComponentProps<
  C extends ElementType,
  Props = Record<string, never>
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithRef<C>, PropsToOmit<C, Props>>;

export type PolymorphicRef<C extends ElementType> =
  React.ComponentPropsWithRef<C>["ref"];
```

Own props (e.g. `variant`, `size`) take precedence over host-element props via `Omit`, ensuring the component API surface is never shadowed accidentally. `@typescript-eslint/no-explicit-any` is enforced at zero violations across the entire codebase — no `any` cast exists anywhere in the implementation.

## Consequences

**Benefits**

- Call sites stay idiomatic: `<Button as="a" href="/dashboard">Go</Button>` reads like standard JSX.
- TypeScript narrows valid props automatically from the `as` value — wrong props become compile-time errors, not runtime surprises.
- Zero runtime cost: the utility type is fully erased during compilation; no bundle size impact.
- `@typescript-eslint/no-explicit-any` remains at zero violations throughout the codebase.

**Tradeoffs**

- The `PolymorphicComponentProps` utility is non-trivial for contributors unfamiliar with TypeScript conditional and mapped types. Mitigation: this ADR and inline JSDoc in `polymorphic.ts` explain the structure.
- Ref forwarding requires a separate `PolymorphicRef<C>` helper and a `React.forwardRef` wrapper at each component definition, adding approximately five lines per component.
- The library targets standard HTML elements only; exotic host elements (SVG, custom elements) may have attribute quirks that require manual verification. This constraint is documented in `src/utils/polymorphic.ts`.
