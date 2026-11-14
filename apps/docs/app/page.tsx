import { Button } from "@lab-ds/ui";

const variants = ["default", "secondary", "outline", "ghost", "link", "destructive"] as const;

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Lab-ds</h1>
        <p className="text-muted-foreground">
          A React + Tailwind v4 design system built on shadcn/ui.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-medium">Button</h2>
        <div className="flex flex-wrap gap-3">
          {variants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
          <Button asChild variant="outline">
            <a href="https://ui.shadcn.com">asChild link</a>
          </Button>
        </div>
      </section>
    </main>
  );
}
