import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { Dialog, DialogContentFullscreen } from "../dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";

function TestDialog() {
  const [open, setOpen] = React.useState(true);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContentFullscreen>
        <DialogPrimitive.Title>title</DialogPrimitive.Title>
        <div>content</div>
      </DialogContentFullscreen>
    </Dialog>
  );
}

describe("DialogContentFullscreen", () => {
  it("closes when clicking the overlay", async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    expect(screen.getByText("content")).toBeInTheDocument();

    const overlay = document.querySelector('[data-state="open"]') as HTMLElement;

    await user.click(overlay);

    expect(screen.queryByText("content")).not.toBeInTheDocument();
  });
});
