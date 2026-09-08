import { Container } from "@/components/layout/container";
import { TemplateDetailSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container size="wide" className="py-10 sm:py-14">
      <TemplateDetailSkeleton />
    </Container>
  );
}
