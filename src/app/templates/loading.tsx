import { Container } from "@/components/layout/container";
import { Skeleton, TemplateGridSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container size="wide" className="py-10 sm:py-14">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-10 w-72" />
      <Skeleton className="mt-4 h-4 w-full max-w-2xl" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[228px_minmax(0,1fr)] lg:gap-10">
        <div className="hidden space-y-6 lg:block">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-2.5">
              <Skeleton className="h-3 w-20" />
              {Array.from({ length: 4 }, (_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
        <div>
          <Skeleton className="h-10 w-full" />
          <div className="mt-8">
            <TemplateGridSkeleton count={9} />
          </div>
        </div>
      </div>
    </Container>
  );
}
