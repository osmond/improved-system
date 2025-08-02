import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { vi } from "vitest";

import ChartPreview from "../ChartPreview";

describe("ChartPreview", () => {
  it("renders chart content when opened", async () => {
    const user = userEvent.setup();
    render(
      <ChartPreview>
        <div>chart</div>
      </ChartPreview>
    );

    await user.click(screen.getByRole("button", { name: /view larger/i }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("chart")).toBeInTheDocument();
  });

  it("allows keyboard navigation to the close button", async () => {
    const user = userEvent.setup();
    render(
      <ChartPreview>
        <div>chart</div>
      </ChartPreview>
    );

    await user.click(screen.getByRole("button", { name: /view larger/i }));

    const dialog = await screen.findByRole("dialog");
    fireEvent.pointerMove(dialog, { clientX: 10, clientY: 10 });
    const closeButton = await screen.findByRole("button", { name: /close/i });

    await user.tab();
    expect(closeButton).toHaveFocus();
  });

  it("does not submit surrounding form when opening", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn((e) => e.preventDefault());
    render(
      <form onSubmit={handleSubmit}>
        <ChartPreview>
          <div>chart</div>
        </ChartPreview>
      </form>
    );

    await user.click(screen.getByRole("button", { name: /view larger/i }));

    expect(handleSubmit).not.toHaveBeenCalled();
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });
});

