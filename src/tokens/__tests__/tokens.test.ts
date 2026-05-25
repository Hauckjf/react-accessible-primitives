import { describe, expect, it } from 'vitest';
import { cssPath, tokenVar } from '../index.js';

describe('tokenVar', () => {
  it('returns the correct var reference for a space token', () => {
    expect(tokenVar('space-4')).toBe('var(--rap-space-4)');
  });

  it('returns the correct var reference for boundary space steps', () => {
    expect(tokenVar('space-1')).toBe('var(--rap-space-1)');
    expect(tokenVar('space-16')).toBe('var(--rap-space-16)');
  });

  it('returns the correct var reference for color tokens', () => {
    expect(tokenVar('color-neutral-50')).toBe('var(--rap-color-neutral-50)');
    expect(tokenVar('color-accent-500')).toBe('var(--rap-color-accent-500)');
    expect(tokenVar('color-danger-900')).toBe('var(--rap-color-danger-900)');
  });

  it('returns the correct var reference for radius tokens', () => {
    expect(tokenVar('radius-sm')).toBe('var(--rap-radius-sm)');
    expect(tokenVar('radius-full')).toBe('var(--rap-radius-full)');
  });

  it('returns the correct var reference for font-size tokens', () => {
    expect(tokenVar('font-size-xs')).toBe('var(--rap-font-size-xs)');
    expect(tokenVar('font-size-2xl')).toBe('var(--rap-font-size-2xl)');
  });

  it('returns the correct var reference for shadow tokens', () => {
    expect(tokenVar('shadow-sm')).toBe('var(--rap-shadow-sm)');
    expect(tokenVar('shadow-md')).toBe('var(--rap-shadow-md)');
    expect(tokenVar('shadow-lg')).toBe('var(--rap-shadow-lg)');
  });
});

describe('cssPath', () => {
  it('is a non-empty string pointing to the CSS file', () => {
    expect(typeof cssPath).toBe('string');
    expect(cssPath.length).toBeGreaterThan(0);
    expect(cssPath).toContain('tokens.css');
  });
});
