import { Container, SectionHeading } from "@/components/layout/container";
import { ClipboardCheck, FileCode2, GitBranch, ScanEye } from "lucide-react";

const points = [
  {
    icon: ScanEye,
    title: "Prompts written as briefs",
    body:
      "Every prompt carries the routes, the component list, the colour tokens, the type scale, the motion rules and the constraints. It reads like a spec a senior engineer would hand over — because that is what an agent needs.",
  },
  {
    icon: FileCode2,
    title: "Three agents, three shapes",
    body:
      "The same brief compiled for Claude Code as a narrative, for Cursor as an ordered file-by-file plan, and for Codex as numbered requirements with acceptance criteria. Pick the one your tool works best with.",
  },
  {
    icon: ClipboardCheck,
    title: "Copy, download, ship",
    body:
      "Copy to the clipboard or download the prompt as a text file, drop it into your agent, and get a repository — not a screenshot you then have to rebuild by hand.",
  },
  {
    icon: GitBranch,
    title: "Yours to change",
    body:
      "The output is ordinary code in a stack you already know. Change the palette, swap the data layer, drop half the sections. Nothing here is locked behind a builder.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-line py-16 sm:py-20">
      <Container size="wide">
        <SectionHeading
          title="A template is only half of it"
          description="Screenshots inspire, prompts build. Everything on Promptly ships with a brief detailed enough for an agent to work from without guessing."
        />
        <div className="grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <div key={point.title} className="bg-surface-2 p-6 sm:p-7">
                <span className="flex size-9 items-center justify-center rounded-card border border-line bg-surface-3 text-accent">
                  <Icon className="size-4" aria-hidden strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold">{point.title}</h3>
                <p className="mt-2 text-[13.5px] leading-6 text-muted">{point.body}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
