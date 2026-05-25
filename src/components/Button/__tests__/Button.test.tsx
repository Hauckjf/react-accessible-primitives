import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import styles from "../Button.module.css";
import { Button } from "../Button";

describe("Button", () => {
  describe("a11y", () => {
    it("has no axe violations with default props", async () => {
      const { container } = render(<Button>Click me</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no axe violations in loading state", async () => {
      const { container } = render(<Button loading>Submit</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("exposes aria-busy when loading", () => {
      render(<Button loading>Submit</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    });

    it("omits aria-busy when not loading", () => {
      render(<Button>Submit</Button>);
      expect(screen.getByRole("button")).not.toHaveAttribute("aria-busy");
    });
  });

  describe("polymorphic as prop", () => {
    it("renders a <button> by default", () => {
      render(<Button>Click</Button>);
      expect(screen.getByRole("button", { name: "Click" })).toBeInTheDocument();
    });

    it("renders an <a> when as='a'", () => {
      render(
        <Button as="a" href="/about">
          About
        </Button>,
      );
      const link = screen.getByRole("link", { name: "About" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/about");
    });

    it("forwards extra props to the underlying element", () => {
      render(<Button data-testid="btn">Click</Button>);
      expect(screen.getByTestId("btn")).toBeInTheDocument();
    });
  });

  describe("variants", () => {
    it.each(["primary", "secondary", "ghost"] as const)(
      "applies the %s variant class",
      (variant) => {
        render(<Button variant={variant}>Button</Button>);
        expect(screen.getByRole("button").className).toContain(styles[variant]);
      },
    );

    it("defaults to the primary variant", () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole("button").className).toContain(styles.primary);
    });
  });

  describe("sizes", () => {
    it.each(["sm", "md", "lg"] as const)("applies the %s size class", (size) => {
      render(<Button size={size}>Button</Button>);
      expect(screen.getByRole("button").className).toContain(styles[size]);
    });

    it("defaults to the md size", () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole("button").className).toContain(styles.md);
    });
  });

  describe("loading state", () => {
    it("renders a spinner element when loading", () => {
      render(<Button loading>Save</Button>);
      expect(
        screen.getByRole("button").querySelector('[aria-hidden="true"]'),
      ).not.toBeNull();
    });

    it("applies the loading class when loading", () => {
      render(<Button loading>Save</Button>);
      expect(screen.getByRole("button").className).toContain(styles.loading);
    });

    it("does not render a spinner when not loading", () => {
      render(<Button>Save</Button>);
      expect(
        screen.getByRole("button").querySelector('[aria-hidden="true"]'),
      ).toBeNull();
    });
  });

  describe("className merging", () => {
    it("appends consumer className to the component classes", () => {
      render(<Button className="extra">Click</Button>);
      const el = screen.getByRole("button");
      expect(el.className).toContain("extra");
      expect(el.className).toContain(styles.button);
    });
  });
});
