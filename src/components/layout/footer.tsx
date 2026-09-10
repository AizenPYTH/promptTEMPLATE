import Link from "next/link";
import { site } from "@/data/site";
import { LogoMark } from "@/components/layout/logo";
import { Container } from "@/components/layout/container";
import { catalogTotals } from "@/lib/catalog";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface-2/40">
      <Container size="wide" className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em]">
              <LogoMark className="size-6" />
              {site.name}
            </div>
            <p className="mt-3 text-[13px] leading-6 text-muted">{site.tagline}</p>
            <p className="mt-4 text-xs text-soft">
              {catalogTotals.templates} templates · {catalogTotals.creators} creators · {catalogTotals.collections} collections
            </p>
          </div>
          {site.footer.map((column) => (
            <div key={column.title}>
              <h3 className="text-label font-medium uppercase tracking-[0.12em] text-soft">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.founded}–2026 {site.name}. A front-end demonstration — no accounts, no payments, no tracking.
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-positive" aria-hidden />
            All systems operational
          </p>
        </div>
      </Container>
    </footer>
  );
}
