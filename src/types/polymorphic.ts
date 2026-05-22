import type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ElementType,
  ReactElement,
} from 'react';

export type AsProp<C extends ElementType> = {
  as?: C;
};

/**
 * OwnProps shadow same-named host-element props before intersection,
 * preventing accidental widening of own-prop types through the host element.
 */
export type PropsWithAs<
  C extends ElementType,
  OwnProps = Record<never, never>,
> = OwnProps &
  AsProp<C> &
  Omit<ComponentPropsWithoutRef<C>, keyof OwnProps | 'as'>;

export type PolymorphicComponentProps<
  C extends ElementType,
  OwnProps = Record<never, never>,
> = PropsWithAs<C, OwnProps> & {
  ref?: ComponentPropsWithRef<C>['ref'];
};

/**
 * Restores the generic `as` signature that forwardRef's inference erases,
 * giving consumers correct prop narrowing per rendered element.
 */
export type PolymorphicForwardRef<
  DefaultAs extends ElementType,
  OwnProps = Record<never, never>,
> = {
  <C extends ElementType = DefaultAs>(
    props: PolymorphicComponentProps<C, OwnProps>
  ): ReactElement | null;
  displayName?: string;
};
