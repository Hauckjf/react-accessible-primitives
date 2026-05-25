import { type ElementType } from "react";
import type { PolymorphicComponentProps } from "../../types/polymorphic";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

function cx(...parts: (string | undefined | false | null)[]): string {
  return parts
    .filter((p): p is string => typeof p === "string" && p.length > 0)
    .join(" ");
}

export function Button<C extends ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  ...rest
}: PolymorphicComponentProps<C, ButtonOwnProps>) {
  const Tag = (as ?? "button") as ElementType;

  return (
    <Tag
      {...rest}
      className={cx(
        styles.button,
        styles[variant],
        styles[size],
        loading && styles.loading,
        className,
      )}
      aria-busy={loading || undefined}
    >
      {loading && (
        <span className={styles.spinner} aria-hidden="true" />
      )}
      {children}
    </Tag>
  );
}
