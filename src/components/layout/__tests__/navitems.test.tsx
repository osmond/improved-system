import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import NavItems from "../NavItems";
import type { DashboardRouteGroup } from "@/routes";
import { vi } from "vitest";

vi.mock("@/ui/sheet", () => ({
  SheetClose: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const TestIcon = () => <svg data-testid="icon" />;

const groups: DashboardRouteGroup[] = [
  {
    label: "Group",
    icon: TestIcon as any,
    items: [
      { to: "/item1", label: "Item 1", icon: TestIcon as any, description: "" },
      {
        to: "/item2",
        label: "Item 2",
        icon: TestIcon as any,
        description: "",
        tags: ["foo"],
      },
    ],
  },
];

describe("NavItems Accordion", () => {
  it("toggles group items", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <NavItems groups={groups} orientation="vertical" />
      </MemoryRouter>,
    );

    const trigger = screen.getByRole("button", { name: "Group" });
    expect(trigger).toHaveAttribute("aria-controls");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.click(trigger);
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("filters items by tag search", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <NavItems groups={groups} orientation="vertical" />
      </MemoryRouter>,
    );

    const search = screen.getByPlaceholderText("Jump to...");
    await user.type(search, "foo");
    const trigger = screen.getByRole("button", { name: "Group" });
    expect(trigger).toBeInTheDocument();
    await user.click(trigger);
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
    expect(screen.getAllByText("Item 2")).toHaveLength(1);
  });
});
