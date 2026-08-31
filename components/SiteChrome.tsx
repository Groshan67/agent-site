import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/radar", label: "Radar" },
  { href: "/prompts", label: "Prompts" },
  { href: "/health-codes", label: "IRC" },
  { href: "https://github.com/Groshan67", label: "GITHUB", github: true },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-mono text-sm tracking-tight text-foreground">
          roshan<span className="text-accent">.dev</span>
        </Link>

        <nav className="flex items-center gap-6 font-mono text-sm text-muted">
          {NAV_ITEMS.map((item) => {
            const isGithub = item.github;

            return (
              < Link
                key={item.href}
                href={item.href}
                // className="transition-colors hover:text-foreground"
                className={`transition-colors  ${isGithub
                  ? "font-github flex items-center gap-2  hover:text-accent"
                  : "hover:text-foreground"
                  }`}
              >
                {isGithub && (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-brand-github ">
                      <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"></path>
                    </svg>
                  </>
                )}

                {item.label}


                {isGithub && (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="tabler-icon tabler-icon-arrow-up-right ">
                      <path d="M17 7l-10 10"></path><path d="M8 7l9 0l0 9"></path>
                    </svg>

                  </>
                )}

              </Link>

            );
          })}
        </nav>
      </div>
    </header >
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
