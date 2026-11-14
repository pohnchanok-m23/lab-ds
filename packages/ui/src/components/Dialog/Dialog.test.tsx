import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button } from "../Button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog"

function Example({ showCloseButton }: { showCloseButton?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>Open dialog</DialogTrigger>
      <DialogContent showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>Confirm the action.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

describe("Dialog", () => {
  it("opens from the trigger and labels the dialog with its title", async () => {
    render(<Example />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole("button", { name: "Open dialog" }))

    const dialog = await screen.findByRole("dialog", { name: "Are you sure?" })
    expect(dialog).toHaveAttribute("data-slot", "dialog-content")
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
  })

  it("closes through DialogClose", async () => {
    render(<Example />)
    await userEvent.click(screen.getByRole("button", { name: "Open dialog" }))
    await screen.findByRole("dialog")

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }))

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    )
  })

  it("hides the close icon when showCloseButton is false", async () => {
    render(<Example showCloseButton={false} />)
    await userEvent.click(screen.getByRole("button", { name: "Open dialog" }))
    await screen.findByRole("dialog")
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument()
  })
})
