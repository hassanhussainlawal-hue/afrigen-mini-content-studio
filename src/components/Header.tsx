const NAV_ITEMS = [
  { label: "Create", href: "#create" },
  { label: "Explore posts", href: "#posts" },
  { label: "Publish test post", href: "#publish" },
];

function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground"
          >
            A
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight sm:text-base">
              Afrigen Mini Content Studio
            </p>
            <p className="text-xs text-muted-foreground">Content workspace</p>
          </div>
        </div>

        <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
          <span className="text-xs font-medium text-muted-foreground">
            Built by Real Twins CoderX
          </span>
        </nav>
      </div>
    </header>
  );
}

export default Header;
