import { cn } from "@/lib/utils";

/**
 * Effect 4: three blobs drifting on unsynchronised loops. Glass only reads as
 * glass when there is something worth blurring behind it, and this is that
 * something — so the sizes and loop lengths come straight from the handoff
 * (teal 26s, violet 34s, amber 41s) rather than being tuned by eye.
 *
 * Decorative, so it is hidden from assistive technology and removed outright
 * under prefers-reduced-motion.
 */
const BLOBS = [
  { token: "--mesh-a", className: "-left-[12%] -top-[38%] size-[62vw] max-w-[880px]", animation: "mesh-a 26s var(--ease-inout) infinite", blur: 120 },
  { token: "--mesh-b", className: "-right-[10%] -top-[22%] size-[52vw] max-w-[720px]", animation: "mesh-b 34s var(--ease-inout) infinite", blur: 120 },
  { token: "--mesh-c", className: "bottom-[-34%] left-[24%] size-[48vw] max-w-[660px]", animation: "mesh-c 41s var(--ease-inout) infinite", blur: 130 },
];

export function MeshBackground({
  className,
  intensity = "default",
}: {
  className?: string;
  intensity?: "default" | "soft" | "vivid";
}) {
  const scale = intensity === "vivid" ? 1 : intensity === "soft" ? 0.45 : 0.7;

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {BLOBS.map((blob) => (
        <span
          key={blob.token}
          className={cn("mesh-blob absolute rounded-full", blob.className)}
          style={{
            background: `var(${blob.token})`,
            filter: `blur(${blob.blur}px)`,
            opacity: scale,
            animation: blob.animation,
          }}
        />
      ))}
    </div>
  );
}
