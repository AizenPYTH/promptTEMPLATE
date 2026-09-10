import { cn } from "@/lib/utils";

/**
 * The ambient layer everything else sits on: three coloured blobs drifting on
 * long, unsynchronised loops. Glass only reads as glass when there is something
 * worth blurring behind it, and this is that something.
 *
 * Purely decorative, so it is hidden from assistive technology and removed
 * outright under prefers-reduced-motion.
 */
export function MeshBackground({
  className,
  intensity = "default",
}: {
  className?: string;
  intensity?: "default" | "soft" | "vivid";
}) {
  const scale = intensity === "vivid" ? 1.25 : intensity === "soft" ? 0.6 : 1;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ opacity: `calc(var(--mesh-opacity) * ${scale})` }}
    >
      <span
        className="mesh-layer absolute -left-[15%] -top-[35%] size-[70%] rounded-full blur-[110px] animate-[drift-a_26s_ease-in-out_infinite]"
        style={{ background: "var(--mesh-1)" }}
      />
      <span
        className="mesh-layer absolute -right-[10%] -top-[20%] size-[60%] rounded-full blur-[120px] animate-[drift-b_32s_ease-in-out_infinite]"
        style={{ background: "var(--mesh-2)" }}
      />
      <span
        className="mesh-layer absolute bottom-[-30%] left-[25%] size-[55%] rounded-full blur-[130px] animate-[drift-c_38s_ease-in-out_infinite]"
        style={{ background: "var(--mesh-3)" }}
      />
    </div>
  );
}
