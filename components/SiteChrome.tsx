import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/radar", label: "Radar" },
  { href: "/prompts", label: "Prompts" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-mono text-sm tracking-tight text-foreground">
          roshan<span className="text-accent">.dev</span>
        </Link>
        <nav className="flex items-center gap-6 font-mono text-sm text-muted">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto flex max-w-4xl flex-col gap-2 px-6 py-8 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>&copy; {new Date().getFullYear()} Ghasem Roshan — built with an agent in the loop</span>
        <a href="https://github.com" className="transition-colors hover:text-foreground">
          source
        </a>
      </div>
    </footer>
  );
}

export default function SiteChrome() {
  return <SiteHeader />;
}
