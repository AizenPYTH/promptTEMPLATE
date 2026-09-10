import type { ArchetypeId } from "@/types/template";
import { cn } from "@/lib/utils";
import { TemplatePreviewFrame } from "@/components/preview/preview-frame";
import { templates } from "@/data/templates";

/**
 * Category and collection covers borrow a real template's preview rather than
 * inventing a second illustration system for them.
 */
export function ArchetypeCover({
  archetype,
  accent,
  label,
  className,
}: {
  archetype: ArchetypeId;
  accent: string;
  label: string;
  className?: string;
}) {
  const source = templates.find((t) => t.archetype === archetype) ?? templates[0];
  return (
    <TemplatePreviewFrame
      template={{ ...source, accent, title: label, tagline: label }}
      size="small"
      className={cn(className)}
    />
  );
}
