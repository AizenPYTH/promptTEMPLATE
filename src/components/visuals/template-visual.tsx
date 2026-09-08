import type { VisualKind } from "@/types/template";
import { seededRandom } from "@/lib/utils";
import { VIEW_H, VIEW_W, type SceneProps } from "@/components/visuals/primitives";
import {
  AnalyticsScene,
  AuthScene,
  CheckoutScene,
  CommerceScene,
  DashboardScene,
  DocsScene,
  EditorialScene,
  LandingScene,
  MobileScene,
  PortfolioScene,
  PricingScene,
  SettingsScene,
} from "@/components/visuals/scenes-core";
import {
  ArchiveScene,
  CanvasScene,
  ChatScene,
  GalleryScene,
  GridScene,
  InvoiceScene,
  KanbanScene,
  LookbookScene,
  MapScene,
  ReportScene,
  TerminalScene,
  TimelineScene,
} from "@/components/visuals/scenes-extra";

/**
 * Every preview in the product is drawn, not photographed.
 *
 * A scene is an abstract wireframe of a real interface, themed from the design
 * tokens so it works in both themes, tinted with the template's accent and
 * varied deterministically by a seed. Twenty-four compositions mean a template
 * is recognisable by its silhouette alone, at thumbnail size, before any text
 * is legible — and there is nothing to 404, license or download.
 */
const scenes: Record<VisualKind, (props: SceneProps) => React.ReactElement> = {
  landing: LandingScene,
  dashboard: DashboardScene,
  analytics: AnalyticsScene,
  commerce: CommerceScene,
  portfolio: PortfolioScene,
  editorial: EditorialScene,
  mobile: MobileScene,
  docs: DocsScene,
  pricing: PricingScene,
  checkout: CheckoutScene,
  auth: AuthScene,
  settings: SettingsScene,
  chat: ChatScene,
  kanban: KanbanScene,
  terminal: TerminalScene,
  canvas: CanvasScene,
  grid: GridScene,
  gallery: GalleryScene,
  invoice: InvoiceScene,
  map: MapScene,
  timeline: TimelineScene,
  report: ReportScene,
  archive: ArchiveScene,
  lookbook: LookbookScene,
};

export function TemplateVisual({
  kind,
  accent,
  seed,
  className,
  label,
}: {
  kind: VisualKind;
  accent: string;
  seed: string;
  className?: string;
  label: string;
}) {
  const Scene = scenes[kind] ?? LandingScene;
  const rand = seededRandom(`${seed}:${kind}`);
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={className}
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMin slice"
    >
      <Scene accent={accent} rand={rand} />
    </svg>
  );
}
