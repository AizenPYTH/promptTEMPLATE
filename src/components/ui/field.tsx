import { cn } from "@/lib/utils";

const control =
  "w-full rounded-control border border-line bg-surface-2 px-3 text-sm text-ink placeholder:text-soft transition-colors hover:border-line-strong focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] disabled:opacity-60";

export function Label({
  htmlFor,
  children,
  hint,
}: {
  htmlFor: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <label htmlFor={htmlFor} className="text-[13px] font-medium">
        {children}
      </label>
      {hint ? <span className="text-xs text-soft">{hint}</span> : null}
    </div>
  );
}

export function Input({ className, ...props }: React.ComponentPropsWithoutRef<"input">) {
  return <input className={cn(control, "h-9.5", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentPropsWithoutRef<"textarea">) {
  return <textarea className={cn(control, "min-h-28 py-2.5 leading-6", className)} {...props} />;
}

export function Select({ className, ...props }: React.ComponentPropsWithoutRef<"select">) {
  return (
    <select
      className={cn(
        control,
        "h-9.5 appearance-none bg-[length:16px] bg-[right_10px_center] bg-no-repeat pr-9",
        "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23888%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')]",
        className,
      )}
      {...props}
    />
  );
}

export function FieldError({ id, children }: { id: string; children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 text-xs text-warning">
      {children}
    </p>
  );
}

export function Checkbox({
  id,
  label,
  count,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      htmlFor={id}
      className="group flex cursor-pointer items-center gap-2.5 rounded-control py-1.5 pl-0.5 pr-1 text-[13px] transition-colors hover:text-ink"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer size-4 shrink-0 cursor-pointer appearance-none rounded-control border border-line-strong bg-surface-2 transition-colors checked:border-fill-bg checked:bg-fill-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      />
      <svg
        viewBox="0 0 16 16"
        className="pointer-events-none -ml-[26px] size-4 shrink-0 text-fill-fg opacity-0 peer-checked:opacity-100"
        aria-hidden
      >
        <path d="M4 8.5l2.5 2.5L12 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={cn("flex-1 truncate", checked ? "text-ink" : "text-muted")}>{label}</span>
      {typeof count === "number" ? (
        <span className="tabular-nums text-label text-soft">{count}</span>
      ) : null}
    </label>
  );
}
