import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { Dialog, DialogContentFullscreen, DialogTrigger } from "../dialog";
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

function TestDialogWithButton() {
  const [open, setOpen] = React.useState(true);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContentFullscreen>
        <button onClick={() => setOpen(false)}>close</button>
      </DialogContentFullscreen>
    </Dialog>
  );
}

describe("DialogContentFullscreen", () => {
  it("renders content above the overlay", () => {
    render(<TestDialog />);

    const overlay = document.querySelector('[data-state="open"]') as HTMLElement;
    const content = screen.getByRole("dialog");

    expect(overlay.className).toMatch(/z-40/);
    expect(content.className).toMatch(/z-50/);
  });

  it("closes when clicking the overlay", async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    expect(screen.getByText("content")).toBeInTheDocument();

    const overlay = document.querySelector('[data-state="open"]') as HTMLElement;

    await user.click(overlay);

    expect(screen.queryByText("content")).not.toBeInTheDocument();
  });

  it("allows interaction with content above the overlay", async () => {
    const user = userEvent.setup();
    render(<TestDialogWithButton />);

    const button = screen.getByRole("button", { name: /close/i });

    await user.click(button);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

function UncontrolledDialog() {
  return (
    <Dialog>
      <DialogTrigger>open</DialogTrigger>
      <DialogContentFullscreen>
        <div>content</div>
      </DialogContentFullscreen>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("opens uncontrolled dialog with trigger", async () => {
    const user = userEvent.setup();
    render(<UncontrolledDialog />);

    expect(screen.queryByText("content")).not.toBeInTheDocument();

    await user.click(screen.getByText("open"));

    expect(screen.getByText("content")).toBeInTheDocument();
  });
});
