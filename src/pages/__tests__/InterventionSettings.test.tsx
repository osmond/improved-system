import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import InterventionSettingsPage from "../InterventionSettings";

describe("InterventionSettingsPage", () => {
  beforeEach(() => {
    localStorage.clear();
    document.cookie =
      "intervention_prefs=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  });

  it("toggles reminder preference", () => {
    render(<InterventionSettingsPage />);
    expect(screen.getByText("On")).toBeInTheDocument();
    const toggle = screen.getByRole("button", { name: /disable/i });
    fireEvent.click(toggle);
    expect(screen.getByText("Off")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enable/i })).toBeInTheDocument();
  });

  it("shows delay threshold", () => {
    render(<InterventionSettingsPage />);
    expect(
      screen.getByText(/Notify after 30 minutes of fragmentation./i)
    ).toBeInTheDocument();
  });
});
