import * as React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Button } from "../button";

describe("Button", () => {
  it("defaults to type button", () => {
    render(<Button>click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "button");
  });

  it("uses default variant and size classes", () => {
    render(<Button>class test</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toMatch(/bg-primary/);
    expect(button.className).toMatch(/h-10/);
  });

  it("applies variant and size classes", () => {
    render(
      <Button variant="outline" size="lg">
        styled
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button.className).toMatch(/border-input/);
    expect(button.className).toMatch(/h-11/);
  });

  it("merges additional classes", () => {
    render(<Button className="custom">custom</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toMatch(/custom/);
  });

  it("forwards refs", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
