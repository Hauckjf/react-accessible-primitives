import { describe, it } from 'vitest';
import { expectTypeOf } from 'vitest';
import { tokenVar, type TokenName } from '../index.js';

describe('tokenVar return type', () => {
  it('narrows to the exact template literal for each token name', () => {
    expectTypeOf(tokenVar('space-4')).toEqualTypeOf<'var(--rap-space-4)'>();
    expectTypeOf(tokenVar('color-accent-500')).toEqualTypeOf<'var(--rap-color-accent-500)'>();
    expectTypeOf(tokenVar('color-neutral-50')).toEqualTypeOf<'var(--rap-color-neutral-50)'>();
    expectTypeOf(tokenVar('color-danger-900')).toEqualTypeOf<'var(--rap-color-danger-900)'>();
    expectTypeOf(tokenVar('radius-full')).toEqualTypeOf<'var(--rap-radius-full)'>();
    expectTypeOf(tokenVar('font-size-2xl')).toEqualTypeOf<'var(--rap-font-size-2xl)'>();
    expectTypeOf(tokenVar('shadow-lg')).toEqualTypeOf<'var(--rap-shadow-lg)'>();
  });

  it('TokenName is assignable to string', () => {
    expectTypeOf<TokenName>().toMatchTypeOf<string>();
  });
});
