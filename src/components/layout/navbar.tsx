"use client";

import { useEffect, useState } from "react";
import { createScrollStore, useStore } from "@/lib/client-store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Moon, Search, Sun, X } from "lucide-react";
import { site } from "@/data/site";
import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useCommandPalette } from "@/components/search/command-palette";
import { useFavorites } from "@/components/providers/favorites-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { useModifierKey } from "@/lib/platform";
import { cn } from "@/lib/utils";

const scrollStore = createScrollStore(8);

export function Navbar() {
  const pathname = usePathname();
  const scrolled = useStore(scrollStore, false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const { open: openPalette } = useCommandPalette();
  const { favorites, ready } = useFavorites();
  const { theme, toggle } = useTheme();
  const modifier = useModifierKey();

  // Close the mobile menu on navigation, during render rather than after it.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-200",
        scrolled
          ? "border-line bg-[color-mix(in_srgb,var(--canvas)_82%,transparent)] shadow-e1 backdrop-blur-xl"
          : "border-transparent bg-canvas",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-control focus:bg-surface-2 focus:px-3 focus:py-2 focus:text-sm focus:shadow-e3"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-15 max-w-[1400px] items-center gap-4 px-5 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden md:flex md:items-center md:gap-1">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-control px-3 py-1.5 text-[13.5px] font-medium transition-colors",
                isActive(item.href) ? "text-ink" : "text-muted hover:text-ink",
              )}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={openPalette}
            className="hidden h-9 w-56 items-center gap-2 rounded-control border border-line bg-surface-2 px-2.5 text-[13px] text-soft transition-colors hover:border-line-strong hover:text-muted lg:flex"
          >
            <Search className="size-3.5" aria-hidden />
            <span className="flex-1 text-left">Search templates…</span>
            <Kbd>{modifier} K</Kbd>
          </button>

          <button
            type="button"
            onClick={openPalette}
            aria-label="Search"
            className="flex size-9 items-center justify-center rounded-control text-muted transition-colors hover:bg-surface-3 hover:text-ink lg:hidden"
          >
            <Search className="size-[18px]" aria-hidden />
          </button>

          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="hidden size-9 items-center justify-center rounded-control text-muted transition-colors hover:bg-surface-3 hover:text-ink sm:flex"
          >
            {theme === "dark" ? <Sun className="size-[18px]" aria-hidden /> : <Moon className="size-[18px]" aria-hidden />}
          </button>

          <Link
            href="/favorites"
            aria-label={`Favorites${ready && favorites.length ? ` (${favorites.length})` : ""}`}
            className={cn(
              "relative hidden size-9 items-center justify-center rounded-control transition-colors hover:bg-surface-3 hover:text-ink sm:flex",
              isActive("/favorites") ? "text-ink" : "text-muted",
            )}
          >
            <Heart className={cn("size-[18px]", ready && favorites.length > 0 && "fill-accent text-accent")} aria-hidden />
            {ready && favorites.length > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-4 text-accent-ink">
                {favorites.length}
              </span>
            ) : null}
          </Link>

          <span className="hidden md:block">
            <ButtonLink href="/submit" size="sm">
              Submit template
            </ButtonLink>
          </span>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex size-9 items-center justify-center rounded-control text-muted transition-colors hover:bg-surface-3 hover:text-ink md:hidden"
          >
            {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="fixed inset-x-0 bottom-0 top-15 z-40 overflow-y-auto border-t border-line bg-canvas px-5 py-6 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {[...site.nav, { label: "Favorites", href: "/favorites" }, { label: "Changelog", href: "/changelog" }, { label: "About", href: "/about" }].map(
              (item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-card px-3 py-3 text-[15px] font-medium transition-colors",
                    isActive(item.href) ? "bg-surface-3 text-ink" : "text-muted",
                  )}
                >
                  {item.label}
                  {item.href === "/favorites" && ready && favorites.length > 0 ? (
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">
                      {favorites.length}
                    </span>
                  ) : null}
                </Link>
              ),
            )}
          </nav>
          <div className="mt-6 flex flex-col gap-2 border-t border-line pt-6">
            <ButtonLink href="/submit" size="lg">
              Submit a template
            </ButtonLink>
            <button
              type="button"
              onClick={toggle}
              className="flex h-11 items-center justify-center gap-2 rounded-control border border-line text-sm font-medium text-muted"
            >
              {theme === "dark" ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
              Switch to {theme === "dark" ? "light" : "dark"} theme
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
