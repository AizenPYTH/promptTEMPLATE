import type { ArchetypeId, Template } from "@/types/template";
import { cn } from "@/lib/utils";
import { LandingPreview } from "@/components/preview/archetypes/landing";
import { DashboardPreview } from "@/components/preview/archetypes/dashboard";
import { PortfolioPreview } from "@/components/preview/archetypes/portfolio";
import { CommercePreview } from "@/components/preview/archetypes/commerce";
import { DataGridPreview } from "@/components/preview/archetypes/data-grid";
import { BoardPreview } from "@/components/preview/archetypes/board";
import { DocsPreview } from "@/components/preview/archetypes/docs";
import { CanvasPreview } from "@/components/preview/archetypes/canvas";
import { LaunchPreview } from "@/components/preview/archetypes/launch";
import { EditorialPreview } from "@/components/preview/archetypes/editorial";

const archetypes: Record<ArchetypeId, () => React.ReactElement> = {
  landing: LandingPreview,
  dashboard: DashboardPreview,
  portfolio: PortfolioPreview,
  commerce: CommercePreview,
  "data-grid": DataGridPreview,
  board: BoardPreview,
  docs: DocsPreview,
  canvas: CanvasPreview,
  launch: LaunchPreview,
  editorial: EditorialPreview,
};

/**
 * A template preview is the site itself, rendered small — not a picture of it.
 *
 * `small` holds frame one (charts drawn, marquees parked, no caret) until the
 * card is hovered or focused; `large` runs from the start. Both render exactly
 * the same markup at the same design size, so nothing is approximated twice.
 */
export function TemplatePreviewFrame({
  template,
  size = "small",
  playing,
  className,
}: {
  template: Template;
  size?: "small" | "large";
  playing?: boolean;
  className?: string;
}) {
  const Archetype = archetypes[template.archetype] ?? LandingPreview;
  const running = size === "large" ? playing !== false : playing === true;

  return (
    <div
      className={cn("preview-frame", className)}
      role="img"
      aria-label={`${template.title} — ${template.tagline}, live preview`}
    >
      <div
        className={cn("preview-stage", size === "small" && !running && "preview-idle")}
        data-playing={running ? "true" : "false"}
        style={{ "--tpl-accent": template.accent } as React.CSSProperties}
        aria-hidden
      >
        <Archetype />
      </div>
    </div>
  );
}
