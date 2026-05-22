import { describe, expectTypeOf, it } from 'vitest';
import type { ReactElement } from 'react';
import type {
  AsProp,
  PolymorphicComponentProps,
  PolymorphicForwardRef,
  PropsWithAs,
} from '../polymorphic.js';

describe('AsProp', () => {
  it('carries the element type in the as-prop value', () => {
    expectTypeOf<AsProp<'button'>>().toMatchTypeOf<{ as?: 'button' }>();
    expectTypeOf<AsProp<'a'>>().toMatchTypeOf<{ as?: 'a' }>();
  });
});

describe('PropsWithAs', () => {
  it('surfaces element-specific props for the given element', () => {
    // href exists on <a>
    expectTypeOf<PropsWithAs<'a'>>().toHaveProperty('href');
    // type on <button> is the submit/button/reset enum, not an arbitrary string
    expectTypeOf<PropsWithAs<'button'>['type']>().toEqualTypeOf<
      'submit' | 'button' | 'reset' | undefined
    >();
  });

  it('rejects href when as="button" — ButtonHTMLAttributes has no href', () => {
    // Extract<T, U> is never when T has no overlap with U;
    // if PropsWithAs<'button'> gained href this assertion would fail to compile.
    expectTypeOf<Extract<PropsWithAs<'button'>, { href: string }>>().toBeNever();
  });

  it('rejects a value outside the own-prop type union when as="a"', () => {
    // Omit removes the anchor's wider `type: string` when OwnProps declares `type`,
    // so only the own-prop union is assignable — 'link' is not in that union.
    type OwnProps = { type?: 'submit' | 'button' | 'reset' };
    expectTypeOf<PropsWithAs<'a', OwnProps>['type']>().toEqualTypeOf<
      'submit' | 'button' | 'reset' | undefined
    >();
  });

  it('own-props shadow a conflicting host-element prop', () => {
    type OwnProps = { disabled: 'always' };
    // ButtonHTMLAttributes.disabled is boolean; OwnProps must win.
    expectTypeOf<
      PropsWithAs<'button', OwnProps>['disabled']
    >().toEqualTypeOf<'always'>();
  });

  it('includes the as prop itself', () => {
    expectTypeOf<PropsWithAs<'a'>>().toHaveProperty('as');
  });
});

describe('PolymorphicComponentProps', () => {
  it('inherits all PropsWithAs members', () => {
    expectTypeOf<PolymorphicComponentProps<'a'>>().toHaveProperty('href');
  });

  it('adds a typed ref for the rendered element', () => {
    expectTypeOf<PolymorphicComponentProps<'a'>>().toHaveProperty('ref');
    expectTypeOf<PolymorphicComponentProps<'button'>>().toHaveProperty('ref');
  });
});

describe('PolymorphicForwardRef', () => {
  it('is a callable type', () => {
    // ReturnType<T> only resolves when T is callable; this line would not
    // compile if PolymorphicForwardRef<'button'> stopped being a function type.
    type Comp = PolymorphicForwardRef<'button'>;
    expectTypeOf<ReturnType<Comp>>().toEqualTypeOf<ReactElement | null>();
  });

  it('carries an optional displayName string property', () => {
    expectTypeOf<PolymorphicForwardRef<'button'>>().toMatchTypeOf<{
      displayName?: string;
    }>();
  });
});
