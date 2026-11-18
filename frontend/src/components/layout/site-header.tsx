import Link from "next/link";
import { Suspense } from "react";
import { ShoppingCart, User } from "lucide-react";
import { UserMenu } from "@/components/layout/user-menu";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/promos", label: "Promos" },
] as const;

function NavLinks({ className }: { className?: string }) {
  return (
    <nav aria-label="Main" className={className}>
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-bronze-dark focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-heading text-xl font-bold tracking-tight">
          Rakgadi <span className="text-bronze">Eatery</span>
        </Link>

        <NavLinks className="hidden items-center gap-1 sm:flex" />

        <div className="flex items-center gap-1">
          <Link
            href="/cart"
            aria-label="Cart"
            className="rounded-md p-2 transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <ShoppingCart className="size-5" />
          </Link>
          <Suspense
            fallback={
              <span aria-hidden="true" className="inline-block p-2">
                <User className="size-5 text-muted-foreground" />
              </span>
            }
          >
            <UserMenu />
          </Suspense>
        </div>
      </div>

      <NavLinks className="flex items-center justify-center gap-1 border-t px-4 py-1 sm:hidden" />
    </header>
  );
}
