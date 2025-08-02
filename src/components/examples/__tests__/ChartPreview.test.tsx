import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import ChartPreview from "../ChartPreview";

describe("ChartPreview", () => {
  it("allows keyboard navigation to the close button", async () => {
    const user = userEvent.setup();
    render(
      <ChartPreview>
        <div>chart</div>
      </ChartPreview>
    );

    await user.click(screen.getByRole("button", { name: /view larger/i }));
    const closeButton = await screen.findByRole("button", { name: /close/i });

    await user.tab();
    expect(closeButton).toHaveFocus();
  });
});

