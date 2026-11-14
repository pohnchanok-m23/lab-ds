import {
  Button,
  buttonVariants,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@lab-ds/ui";

const variants = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const;
const sizes = ["xs", "sm", "default", "lg"] as const;

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-16 text-sm">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Lab-ds</h1>
        <p className="text-muted-foreground">
          A React + Tailwind v4 design system built on shadcn/ui and Base UI.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-medium">Button</h2>
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {sizes.map((size) => (
            <Button key={size} size={size}>
              {size}
            </Button>
          ))}
          <Button disabled>Disabled</Button>
          <Button variant="outline" aria-invalid>
            Invalid
          </Button>
          <a href="#dialog" className={buttonVariants({ variant: "outline" })}>
            buttonVariants() on a link
          </a>
          <Button className="rounded-full px-6">className override</Button>
        </div>
      </section>

      <section id="dialog" className="flex flex-col gap-4">
        <h2 className="text-xl font-medium">Dialog</h2>
        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger render={<Button />}>Open dialog</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  Press Esc, click outside, or use a button below to close this dialog.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                <DialogClose render={<Button />}>Continue</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>Footer close</DialogTrigger>
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>What&apos;s new</DialogTitle>
                <DialogDescription>Components now ship from @lab-ds/ui.</DialogDescription>
              </DialogHeader>
              <DialogFooter showCloseButton />
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </main>
  );
}
