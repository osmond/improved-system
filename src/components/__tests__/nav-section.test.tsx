import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Star } from "lucide-react";
import NavSection from "../nav-section";
import { slugify } from "@/lib/utils";
import { SidebarProvider } from "@/ui/sidebar";
import { MemoryRouter } from "react-router-dom";

describe("NavSection contentId", () => {
  const baseProps = {
    label: "Section",
    pathname: "",
    favorites: [] as string[],
    toggleFavorite: () => {},
    highlighted: null as string | null,
    setHighlighted: () => {},
    searchMatches: [] as string[],
  };

  const groups = [
    {
      label: "First Group",
      icon: Star,
      items: [{ to: "/first", label: "First" }],
    },
    {
      label: "Second Group",
      icon: Star,
      items: [{ to: "/second", label: "Second" }],
    },
  ];

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

  const renderWithProvider = (props = {}) =>
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SidebarProvider>
          <NavSection {...baseProps} {...props} />
        </SidebarProvider>
      </MemoryRouter>
    );

  it("keeps ids stable across rerenders", () => {
    const { rerender } = renderWithProvider({ groups });

    const firstTrigger = screen.getByText("First Group").closest("button");
    const firstId = firstTrigger?.getAttribute("aria-controls");

    expect(firstId).toBe(`Section-group-${slugify("First Group")}`);

    rerender(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SidebarProvider>
          <NavSection {...baseProps} groups={groups} />
        </SidebarProvider>
      </MemoryRouter>
    );
    const reRenderedTrigger = screen.getByText("First Group").closest("button");
    expect(reRenderedTrigger?.getAttribute("aria-controls")).toBe(firstId);
  });

  it("keeps ids stable when groups are reordered", () => {
    const { rerender } = renderWithProvider({ groups });

    const secondTrigger = screen.getByText("Second Group").closest("button");
    const secondId = secondTrigger?.getAttribute("aria-controls");

    rerender(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SidebarProvider>
          <NavSection {...baseProps} groups={[...groups].reverse()} />
        </SidebarProvider>
      </MemoryRouter>
    );

    const secondTriggerReordered = screen
      .getByText("Second Group")
      .closest("button");
    expect(secondTriggerReordered?.getAttribute("aria-controls")).toBe(
      secondId,
    );
  });

  it("renders badges next to route labels", () => {
    renderWithProvider({
      routes: [{ to: "/badge", label: "With Badge", badge: "Beta" }],
    });
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });
});
