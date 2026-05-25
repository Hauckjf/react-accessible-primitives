import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button, type ButtonSize, type ButtonVariant } from '../';

describe('Button', () => {
  describe('element type', () => {
    it('renders a <button> element by default', () => {
      render(<Button>Click me</Button>);
      expect(
        screen.getByRole('button', { name: 'Click me' }),
      ).toBeInTheDocument();
    });

    it('renders the element specified by the as prop', () => {
      render(
        <Button as="a" href="https://example.com">
          Go there
        </Button>,
      );
      expect(
        screen.getByRole('link', { name: 'Go there' }),
      ).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('sets aria-busy="true" when isLoading is true', () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('omits aria-busy when isLoading is false', () => {
      render(<Button>Normal</Button>);
      expect(screen.getByRole('button')).not.toHaveAttribute('aria-busy');
    });

    it('renders a spinner SVG when isLoading is true', () => {
      const { container } = render(<Button isLoading>Submit</Button>);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('hides the spinner from assistive technology', () => {
      const { container } = render(<Button isLoading>Submit</Button>);
      expect(container.querySelector('svg')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
    });

    it('does not render a spinner when isLoading is false', () => {
      const { container } = render(<Button>Submit</Button>);
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('sets the disabled attribute on a native button when isDisabled is true', () => {
      render(<Button isDisabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not disable a native button when isDisabled is false', () => {
      render(<Button>Enabled</Button>);
      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    it('sets aria-disabled="true" on a non-button element when isDisabled is true', () => {
      render(
        <Button as="a" href="https://example.com" isDisabled>
          Disabled link
        </Button>,
      );
      expect(screen.getByRole('link')).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });

    it('omits aria-disabled on a non-button element when isDisabled is false', () => {
      render(
        <Button as="a" href="https://example.com">
          Link
        </Button>,
      );
      expect(screen.getByRole('link')).not.toHaveAttribute('aria-disabled');
    });
  });

  describe('variants', () => {
    it('defaults to solid variant', () => {
      render(<Button>Default</Button>);
      expect(screen.getByRole('button')).toHaveAttribute(
        'data-variant',
        'solid',
      );
    });

    it.each(['solid', 'outline', 'ghost'] as ButtonVariant[])(
      'applies data-variant="%s"',
      (variant) => {
        render(<Button variant={variant}>Button</Button>);
        expect(screen.getByRole('button')).toHaveAttribute(
          'data-variant',
          variant,
        );
      },
    );
  });

  describe('sizes', () => {
    it('defaults to md size', () => {
      render(<Button>Default</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-size', 'md');
    });

    it.each(['sm', 'md', 'lg'] as ButtonSize[])(
      'applies data-size="%s"',
      (size) => {
        render(<Button size={size}>Button</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('data-size', size);
      },
    );
  });

  describe('prop forwarding', () => {
    it('passes through additional HTML attributes', () => {
      render(
        <Button data-testid="my-button" type="submit">
          Submit
        </Button>,
      );
      expect(screen.getByTestId('my-button')).toHaveAttribute(
        'type',
        'submit',
      );
    });

    it('merges a custom className alongside the component class', () => {
      render(<Button className="extra-class">Button</Button>);
      expect(screen.getByRole('button').className).toContain('extra-class');
    });
  });
});
