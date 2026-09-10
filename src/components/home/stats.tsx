import { Container } from "@/components/layout/container";
import { site } from "@/data/site";

export function Stats() {
  return (
    <section className="border-t border-line bg-surface-2/40">
      <Container size="wide" className="py-12">
        <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {site.stats.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <dt className="order-2 mt-1.5 text-xs text-muted">{stat.label}</dt>
              <dd className="order-1 text-2xl font-semibold tracking-[-0.03em] tabular-nums sm:text-3xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
