"use client";

import { useState } from "react";
import { Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { catalogTotals } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    yearly: 0,
    description: "Everything you need to browse the catalogue and build from free templates.",
    cta: "Current plan",
    highlight: false,
    features: [
      `Browse all ${catalogTotals.templates} templates`,
      "Copy prompts for every free template",
      "Download prompts as text files",
      "Favorites saved in your browser",
      "Command palette and full-text search",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 12,
    yearly: 108,
    description: "Every premium template, every agent variant, and the design tokens behind them.",
    cta: "Coming soon",
    highlight: true,
    features: [
      "Everything in Free",
      "Prompts for all premium templates",
      "Claude Code, Cursor and Codex variants",
      "Design token exports (CSS and JSON)",
      "New templates the week they land",
      "Commercial licence for client work",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime",
    monthly: 249,
    yearly: 249,
    description: "Pay once. Keep every template and every prompt added from here on.",
    cta: "Coming soon",
    highlight: false,
    features: [
      "Everything in Pro, permanently",
      "All future templates included",
      "Prompt revision history",
      "Team seats for up to five people",
      "Priority on template requests",
    ],
  },
];

const comparison: { label: string; free: boolean | string; pro: boolean | string; lifetime: boolean | string }[] = [
  { label: "Template browsing", free: true, pro: true, lifetime: true },
  { label: "Free template prompts", free: true, pro: true, lifetime: true },
  { label: "Premium template prompts", free: false, pro: true, lifetime: true },
  { label: "Agent-specific variants", free: "Claude Code", pro: true, lifetime: true },
  { label: "Design token export", free: false, pro: true, lifetime: true },
  { label: "Commercial licence", free: "Free templates", pro: true, lifetime: true },
  { label: "Future templates", free: true, pro: true, lifetime: true },
  { label: "Team seats", free: "1", pro: "3", lifetime: "5" },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="mx-auto size-4 text-accent" aria-label="Included" />;
  if (value === false) return <Minus className="mx-auto size-4 text-soft" aria-label="Not included" />;
  return <span className="text-xs text-muted">{value}</span>;
}

export function PricingPlans() {
  const [annual, setAnnual] = useState(true);
  const [modalPlan, setModalPlan] = useState<string | null>(null);

  return (
    <>
      <div className="mt-8 flex items-center justify-center gap-3">
        <span className={cn("text-[13px]", annual ? "text-muted" : "text-ink")}>Monthly</span>
        <button
          type="button"
          role="switch"
          aria-checked={annual}
          aria-label="Bill annually"
          onClick={() => setAnnual((v) => !v)}
          className={cn(
            "relative h-6 w-11 rounded-full border transition-colors",
            annual ? "border-accent-line bg-accent" : "border-line bg-surface-3",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 size-4.5 rounded-full bg-surface-2 transition-transform duration-200",
              annual ? "translate-x-5.5" : "translate-x-0.5",
            )}
            aria-hidden
          />
        </button>
        <span className={cn("text-[13px]", annual ? "text-ink" : "text-muted")}>
          Annual <span className="text-accent">− 25%</span>
        </span>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = plan.id === "lifetime" ? plan.monthly : annual ? Math.round(plan.yearly / 12) : plan.monthly;
          return (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-panel border bg-surface-2 p-6",
                plan.highlight ? "border-accent-line shadow-e2" : "border-line",
              )}
            >
              {plan.highlight ? (
                <span className="absolute -top-2.5 left-6 rounded-full bg-accent px-2.5 py-0.5 text-label font-semibold uppercase tracking-[0.08em] text-accent-ink">
                  Most popular
                </span>
              ) : null}
              <h2 className="text-sm font-semibold">{plan.name}</h2>
              <p className="mt-4 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold tracking-[-0.03em] tabular-nums">
                  {price === 0 ? "Free" : `$${price}`}
                </span>
                {price > 0 ? (
                  <span className="text-[13px] text-muted">{plan.id === "lifetime" ? "once" : "/ month"}</span>
                ) : null}
              </p>
              {plan.id === "pro" && annual ? (
                <p className="mt-1 text-xs tabular-nums text-soft">${plan.yearly} billed annually</p>
              ) : (
                <p className="mt-1 text-xs text-soft">
                  {plan.id === "lifetime"
                    ? "One payment, no renewal"
                    : plan.id === "pro"
                      ? "Billed monthly"
                      : "No card required"}
                </p>
              )}
              <p className="mt-4 text-[13px] leading-6 text-muted">{plan.description}</p>

              <Button
                variant={plan.highlight ? "primary" : "outline"}
                size="lg"
                className="mt-6 w-full"
                onClick={() => setModalPlan(plan.id)}
                disabled={plan.id === "free"}
              >
                {plan.cta}
              </Button>

              <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-[13px] leading-6 text-muted">
                    <Check className="mt-1 size-3.5 shrink-0 text-accent" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-[-0.025em]">Compare plans</h2>
        <div className="mt-6 overflow-x-auto scrollbar-slim rounded-panel border border-line">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-surface-3">
                <th scope="col" className="px-4 py-3 text-[13px] font-medium">Feature</th>
                <th scope="col" className="px-4 py-3 text-center text-[13px] font-medium">Free</th>
                <th scope="col" className="px-4 py-3 text-center text-[13px] font-medium">Pro</th>
                <th scope="col" className="px-4 py-3 text-center text-[13px] font-medium">Lifetime</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-b-0 hover:bg-surface-3/60">
                  <th scope="row" className="px-4 py-3 text-[13px] font-normal text-muted">{row.label}</th>
                  <td className="px-4 py-3 text-center"><Cell value={row.free} /></td>
                  <td className="px-4 py-3 text-center"><Cell value={row.pro} /></td>
                  <td className="px-4 py-3 text-center"><Cell value={row.lifetime} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        open={modalPlan !== null}
        onClose={() => setModalPlan(null)}
        title="Payments aren't live yet"
        description="Promptly is a front-end demonstration."
      >
        <div className="space-y-4 p-5 text-[13.5px] leading-6 text-muted">
          <p>
            There is no billing system behind this page — no payment provider, no accounts, no server.
            The plans exist to show what a pricing surface would look like, and the buttons deliberately
            do nothing beyond opening this dialog.
          </p>
          <p>
            Everything in the catalogue is browsable right now, and every prompt can be copied or
            downloaded without paying for anything.
          </p>
        </div>
      </Modal>
    </>
  );
}
