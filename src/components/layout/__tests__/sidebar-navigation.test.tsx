import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { SidebarProvider } from "@/ui/sidebar";
import SidebarNavigation from "../sidebar-navigation";

const renderWithProviders = () =>
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SidebarProvider>
        <SidebarNavigation />
      </SidebarProvider>
    </MemoryRouter>
  );

describe("SidebarNavigation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: () => ({
        matches: false,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  });

  it("toggles group expansion", () => {
    renderWithProviders();
    const trigger = screen.getByText("Maps & Routes");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(trigger);
    return waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "false"),
    );
  });

  it("highlights route on hover", () => {
    renderWithProviders();
    const link = screen.getByText("State Visits Map").closest("a")!;
    expect(link).not.toHaveClass("bg-accent");
    fireEvent.mouseEnter(link);
    expect(link).toHaveClass("bg-accent");
  });

  it("toggles favorites", async () => {
    const user = userEvent.setup();
    renderWithProviders();
    const link = screen.getByText("State Visits Map").closest("a")!;
    const star = link.querySelector("svg.lucide-star")!;
    expect(star).toHaveClass("text-muted-foreground");
    await user.click(star);
    expect(star).toHaveClass("fill-yellow-400");
    expect(screen.getByText("Favorites")).toBeInTheDocument();
  });

  it("updates highlights based on search", async () => {
    const user = userEvent.setup();
    renderWithProviders();
    const input = screen.getByRole("searchbox", { name: /search routes/i });
    await user.type(input, "interactive");
    const link = screen.getByText("State Visits Map").closest("a")!;
    expect(link).toHaveClass("bg-accent");
    await user.clear(input);
    expect(link).not.toHaveClass("bg-accent");
  });
});

