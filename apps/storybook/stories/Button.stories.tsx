import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRightIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";

import { Button, buttonVariants, type ButtonSize, type ButtonVariant } from "@lab-ds/ui";

const variants: ButtonVariant[] = ["default", "secondary", "outline", "ghost", "destructive", "link"];
const sizes: ButtonSize[] = ["xs", "sm", "default", "lg"];
const iconSizes: ButtonSize[] = ["icon-xs", "icon-sm", "icon", "icon-lg"];

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Button",
    variant: "default",
    size: "default",
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: variants,
      table: { defaultValue: { summary: "default" } },
    },
    size: {
      control: "select",
      options: [...sizes, ...iconSizes],
      table: { defaultValue: { summary: "default" } },
    },
    disabled: { control: "boolean" },
    "aria-invalid": { control: "boolean", description: "Shows the invalid ring." },
    className: {
      control: "text",
      description: "Merged last with cn(), so Tailwind utilities override the component styles.",
    },
    children: { control: "text" },
    render: {
      control: false,
      description: "Base UI composition: render another element (use instead of asChild).",
    },
    onClick: { table: { category: "Events" } },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Use the Controls panel to try every prop. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Button" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {variants.map((variant) => (
        <Button {...args} key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {sizes.map((size) => (
        <Button {...args} key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

export const IconSizes: Story = {
  args: { variant: "outline" },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {iconSizes.map((size) => (
        <Button {...args} key={size} size={size} aria-label={`Add (${size})`}>
          <PlusIcon />
        </Button>
      ))}
    </div>
  ),
};

/** `data-icon="inline-start" | "inline-end"` tightens the padding on that side. */
export const WithIcons: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args}>
        <PlusIcon data-icon="inline-start" />
        New item
      </Button>
      <Button {...args} variant="secondary">
        Continue
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
      <Button {...args} variant="destructive">
        <Trash2Icon data-icon="inline-start" />
        Delete
      </Button>
      <Button {...args} size="sm">
        <PlusIcon data-icon="inline-start" />
        Small
      </Button>
    </div>
  ),
};

/** Disabled buttons ignore clicks. */
export const Disabled: Story = {
  args: { disabled: true, children: "Disabled" },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {variants.map((variant) => (
        <Button {...args} key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "default" }), {
      pointerEventsCheck: 0,
    });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Invalid: Story = {
  args: { "aria-invalid": true, variant: "outline", children: "Invalid" },
};

const interactionStates = [
  { id: "rest", label: "Rest" },
  { id: "hover", label: "Hover" },
  { id: "focus", label: "Focus visible" },
  { id: "active", label: "Active" },
  { id: "disabled", label: "Disabled" },
] as const;

/**
 * Every variant in every interaction state. Hover, focus-visible and active are
 * forced with storybook-addon-pseudo-states (toolbar: "Pseudo states").
 */
export const InteractionStates: Story = {
  parameters: {
    pseudo: {
      hover: ['[data-state="hover"]'],
      focusVisible: ['[data-state="focus"]'],
      active: ['[data-state="active"]'],
    },
  },
  render: (args) => (
    <table className="border-separate border-spacing-2 text-left text-xs">
      <thead>
        <tr>
          <th className="font-mono font-normal text-muted-foreground">variant</th>
          {interactionStates.map((state) => (
            <th key={state.id} className="font-mono font-normal text-muted-foreground">
              {state.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {variants.map((variant) => (
          <tr key={variant}>
            <td className="pr-2 font-mono text-muted-foreground">{variant}</td>
            {interactionStates.map((state) => (
              <td key={state.id}>
                <Button
                  {...args}
                  variant={variant}
                  data-state={state.id}
                  disabled={state.id === "disabled"}
                >
                  {variant}
                </Button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/** Real keyboard focus: the play function tabs to the button. */
export const KeyboardFocus: Story = {
  args: { children: "Focused" },
  parameters: { pseudo: { focusVisible: true } },
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("button", { name: "Focused" })).toHaveFocus();
  },
};

/** Base UI keeps button semantics on the rendered element. */
export const RenderAsLink: Story = {
  args: {
    children: "Rendered as <a>",
    variant: "outline",
    nativeButton: false,
    render: <a href="#render-as-link" />,
  },
};

/** `buttonVariants()` styles any element as a button. */
export const ButtonVariantsOnLink: Story = {
  render: () => (
    <a href="#button-variants" className={buttonVariants({ variant: "outline", size: "sm" })}>
      buttonVariants() on &lt;a&gt;
    </a>
  ),
};

export const ClassNameOverride: Story = {
  args: { className: "rounded-full px-6", children: "Rounded via className" },
};
