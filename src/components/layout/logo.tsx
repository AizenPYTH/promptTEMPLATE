import Link from "next/link";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * The mark: three stacked strokes resolving into one — design, prompt, build.
 * Kept as inline SVG so it inherits colour and never 404s.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-6", className)} aria-hidden focusable="false">
      <rect x="1" y="1" width="22" height="22" rx="6.5" className="fill-accent" />
      <path
        d="M7 8.25h6.2a2.9 2.9 0 0 1 0 5.8H7"
        fill="none"
        stroke="var(--accent-ink)"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path d="M7 16.25h4" fill="none" stroke="var(--accent-ink)" strokeWidth="2.1" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 rounded-md text-[15px] font-semibold tracking-[-0.02em]",
        className,
      )}
      aria-label={`${site.name} — home`}
    >
      <LogoMark className="size-6 transition-transform duration-200 group-hover:scale-[1.04]" />
      <span>{site.name}</span>
    </Link>
  );
}
