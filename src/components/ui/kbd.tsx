import { cn } from "@/lib/utils";

export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-xs border border-line bg-surface-2 px-1 font-sans text-2xs font-medium text-muted",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
