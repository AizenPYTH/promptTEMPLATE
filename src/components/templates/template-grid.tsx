import type { Template } from "@/types/template";
import { TemplateCard, type TemplateCardVariant } from "@/components/templates/template-card";
import { cn } from "@/lib/utils";

export function TemplateGrid({
  templates,
  variant = "grid",
  columns = 3,
  className,
}: {
  templates: Template[];
  variant?: TemplateCardVariant;
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  if (variant === "horizontal") {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} variant="horizontal" />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 sm:grid-cols-2",
        columns === 3 && "xl:grid-cols-3",
        columns === 4 && "lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {templates.map((template, index) => (
        <TemplateCard key={template.id} template={template} variant={variant} priority={index < 3} />
      ))}
    </div>
  );
}
