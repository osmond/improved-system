import * as React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Input } from "../input";

describe("Input", () => {
  it("renders with default classes", () => {
    render(<Input placeholder="name" />);
    const input = screen.getByPlaceholderText("name");
    expect(input).toHaveClass("flex");
    expect(input).toHaveClass("h-9");
  });

  it("merges additional classes", () => {
    render(<Input placeholder="name" className="custom" />);
    const input = screen.getByPlaceholderText("name");
    expect(input.className).toMatch(/custom/);
  });

  it("forwards refs", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
