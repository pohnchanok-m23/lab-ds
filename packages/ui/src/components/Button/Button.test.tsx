import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button, buttonVariants } from "./Button"

describe("Button", () => {
  it("renders a native button with data-slot", () => {
    render(<Button>Save</Button>)
    const button = screen.getByRole("button", { name: "Save" })
    expect(button.tagName).toBe("BUTTON")
    expect(button).toHaveAttribute("data-slot", "button")
  })

  it("merges className last", () => {
    render(<Button className="rounded-full">Rounded</Button>)
    expect(screen.getByRole("button", { name: "Rounded" })).toHaveClass(
      "rounded-full"
    )
  })

  it("buttonVariants returns the same classes the component uses", () => {
    render(
      <Button variant="outline" size="sm">
        Outline
      </Button>
    )
    const button = screen.getByRole("button", { name: "Outline" })
    expect(button.className).toBe(
      buttonVariants({ variant: "outline", size: "sm" })
    )
    expect(buttonVariants({ variant: "outline", size: "sm" })).not.toBe(
      buttonVariants()
    )
  })

  it("renders another element through the render prop", () => {
    render(
      <Button render={<a href="/docs" />} nativeButton={false}>
        Docs
      </Button>
    )
    // Base UI keeps button semantics (role="button") on the rendered element.
    const element = screen.getByRole("button", { name: "Docs" })
    expect(element.tagName).toBe("A")
    expect(element).toHaveAttribute("href", "/docs")
    expect(element).toHaveAttribute("data-slot", "button")
  })

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>
    )
    await userEvent.click(screen.getByRole("button", { name: "Disabled" }))
    expect(onClick).not.toHaveBeenCalled()
  })
})
