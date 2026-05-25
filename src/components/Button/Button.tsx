import type { ElementType, ReactNode } from 'react';
import type { PolymorphicComponentProps } from '../../types/polymorphic';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children?: ReactNode;
}

const DEFAULT_ELEMENT = 'button' as const;

export type ButtonProps<C extends ElementType = typeof DEFAULT_ELEMENT> =
  PolymorphicComponentProps<C, ButtonOwnProps>;

const variantClassMap: Record<ButtonVariant, string> = {
  primary: styles.variantPrimary,
  secondary: styles.variantSecondary,
  ghost: styles.variantGhost,
};

const sizeClassMap: Record<ButtonSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

export function Button<C extends ElementType = typeof DEFAULT_ELEMENT>({
  as,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  ...rest
}: ButtonProps<C>) {
  const Component = (as ?? DEFAULT_ELEMENT) as ElementType;

  const cls = [
    styles.button,
    variantClassMap[variant],
    sizeClassMap[size],
    isLoading ? styles.loading : null,
    className,
  ]
    .filter((c): c is string => typeof c === 'string')
    .join(' ');

  return (
    <Component
      {...rest}
      className={cls}
      aria-busy={isLoading || undefined}
    >
      {isLoading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : null}
      {children}
    </Component>
  );
}
