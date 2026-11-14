import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cn } from "cn"

import styles from "./Button.module.css"

const variantClassNames = {
  default: styles.default,
  outline: styles.outline,
  secondary: styles.secondary,
  ghost: styles.ghost,
  destructive: styles.destructive,
  link: styles.link,
}

const sizeClassNames = {
  default: styles.sizeDefault,
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  lg: styles.sizeLg,
  icon: styles.sizeIcon,
  "icon-xs": styles.sizeIconXs,
  "icon-sm": styles.sizeIconSm,
  "icon-lg": styles.sizeIconLg,
}

type ButtonVariant = keyof typeof variantClassNames
type ButtonSize = keyof typeof sizeClassNames

type ButtonStyleProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

/** Button class names, for styling other elements (e.g. links) as buttons. */
function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: ButtonStyleProps = {}) {
  return cn(
    styles.root,
    variantClassNames[variant],
    sizeClassNames[size],
    className
  )
}

type ButtonProps = Omit<ButtonPrimitive.Props, "className"> & ButtonStyleProps

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  )
}

export { Button, buttonVariants }
export type { ButtonProps, ButtonSize, ButtonVariant }
