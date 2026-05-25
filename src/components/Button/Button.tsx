import { forwardRef, type ElementType } from 'react';
import type {
  PolymorphicComponentProps,
  PolymorphicForwardRef,
  PolymorphicRef,
} from '../../types/polymorphic';
import styles from './Button.module.css';

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="1em"
      viewBox="0 0 24 24"
      width="1em"
    >
      <circle
        cx="12"
        cy="12"
        opacity="0.25"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </svg>
  );
}

export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isDisabled?: boolean;
};

export type ButtonProps<C extends ElementType = 'button'> =
  PolymorphicComponentProps<C, ButtonOwnProps>;

// forwardRef does not support generic render functions in TypeScript; the cast
// to PolymorphicForwardRef restores the generic type parameter at the call site.
export const Button = forwardRef(
  <C extends ElementType = 'button'>(
    {
      as,
      variant = 'solid',
      size = 'md',
      isLoading = false,
      isDisabled = false,
      className,
      children,
      ...rest
    }: ButtonProps<C>,
    ref: PolymorphicRef<C>,
  ) => {
    const Component = (as ?? 'button') as ElementType;
    const isNativeButton = !as || as === 'button';

    return (
      <Component
        {...rest}
        ref={ref}
        aria-busy={isLoading ? true : undefined}
        className={
          className !== undefined
            ? `${styles.button} ${className}`
            : styles.button
        }
        data-size={size}
        data-variant={variant}
        {...(isNativeButton
          ? isDisabled
            ? { disabled: true }
            : {}
          : isDisabled
            ? { 'aria-disabled': true as const }
            : {})}
      >
        {isLoading && <Spinner className={styles.spinner} />}
        {children}
      </Component>
    );
  },
) as unknown as PolymorphicForwardRef<'button', ButtonOwnProps>;
