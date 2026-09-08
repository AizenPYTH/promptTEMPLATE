import { seededRandom } from "@/lib/utils";

export { seededRandom };

/**
 * Drawing primitives shared by every scene.
 *
 * Scenes are abstract wireframes of real interfaces, themed from the design
 * tokens so they work in both themes, tinted with the template accent and
 * varied deterministically by a seed. No network requests, no broken images.
 */

export const VIEW_W = 1200;
export const VIEW_H = 750;

export interface SceneProps {
  accent: string;
  rand: () => number;
}

export const SURFACE = "var(--surface)";
export const SUBTLE = "var(--surface-2)";
export const DEEP = "var(--surface-3)";
export const LINE = "var(--line)";
export const LINE_STRONG = "var(--line-strong)";

export function Bar({
  x,
  y,
  w,
  h = 10,
  fill = LINE_STRONG,
  r = 3,
  opacity = 1,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  fill?: string;
  r?: number;
  opacity?: number;
}) {
  return <rect x={x} y={y} width={Math.max(w, 2)} height={h} rx={r} fill={fill} opacity={opacity} />;
}

export function Panel({
  x,
  y,
  w,
  h,
  r = 10,
  fill = SURFACE,
  stroke = LINE,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  fill?: string;
  stroke?: string;
}) {
  return <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} strokeWidth={2} />;
}

export function TextBlock({
  x,
  y,
  width,
  lines,
  rand,
  gap = 18,
  h = 9,
  opacity = 0.65,
}: {
  x: number;
  y: number;
  width: number;
  lines: number;
  rand: () => number;
  gap?: number;
  h?: number;
  opacity?: number;
}) {
  return (
    <>
      {Array.from({ length: lines }, (_, i) => (
        <Bar
          key={i}
          x={x}
          y={y + i * gap}
          w={width * (i === lines - 1 ? 0.45 + rand() * 0.2 : 0.75 + rand() * 0.25)}
          h={h}
          opacity={opacity}
        />
      ))}
    </>
  );
}

export function TopBar({ accent, rand, dark = false }: SceneProps & { dark?: boolean }) {
  return (
    <>
      <rect x={0} y={0} width={VIEW_W} height={62} fill={dark ? DEEP : SUBTLE} />
      <line x1={0} y1={62} x2={VIEW_W} y2={62} stroke={LINE} strokeWidth={2} />
      <circle cx={44} cy={31} r={9} fill={accent} />
      <Bar x={62} y={26} w={54} h={10} />
      {[0, 1, 2, 3].map((i) => (
        <Bar key={i} x={168 + i * 74} y={27} w={46 + rand() * 14} h={8} opacity={0.5} />
      ))}
      <rect x={VIEW_W - 132} y={18} width={96} height={26} rx={7} fill={accent} opacity={0.9} />
    </>
  );
}

export function Sidebar({ accent, rand, width = 220 }: SceneProps & { width?: number }) {
  return (
    <>
      <rect x={0} y={0} width={width} height={VIEW_H} fill={SUBTLE} />
      <line x1={width} y1={0} x2={width} y2={VIEW_H} stroke={LINE} strokeWidth={2} />
      <circle cx={40} cy={44} r={10} fill={accent} />
      <Bar x={58} y={39} w={70} h={10} />
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          {i === 1 ? <rect x={16} y={92 + i * 44 - 12} width={width - 32} height={34} rx={7} fill={DEEP} /> : null}
          <rect x={28} y={92 + i * 44 - 4} width={14} height={14} rx={4} fill={i === 1 ? accent : LINE_STRONG} opacity={i === 1 ? 1 : 0.6} />
          <Bar x={54} y={92 + i * 44} w={60 + rand() * 60} h={8} opacity={i === 1 ? 0.9 : 0.5} />
        </g>
      ))}
      <line x1={16} y1={430} x2={width - 16} y2={430} stroke={LINE} strokeWidth={2} />
      {Array.from({ length: 3 }, (_, i) => (
        <Bar key={i} x={54} y={462 + i * 38} w={54 + rand() * 50} h={8} opacity={0.4} />
      ))}
    </>
  );
}

export function LineChart({ accent, rand, x, y, w, h }: SceneProps & { x: number; y: number; w: number; h: number }) {
  const points = Array.from({ length: 14 }, (_, i) => {
    const px = x + (i / 13) * w;
    const py = y + h - (0.18 + rand() * 0.72) * h;
    return [px, py] as const;
  });
  const path = points.map(([px, py], i) => `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
  const area = `${path} L${x + w},${y + h} L${x},${y + h} Z`;
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={x} y1={y + (i * h) / 3} x2={x + w} y2={y + (i * h) / 3} stroke={LINE} strokeWidth={1.5} />
      ))}
      <path d={area} fill={accent} opacity={0.1} />
      <path d={path} fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      {points.map(([px, py], i) =>
        i === 9 ? <circle key={i} cx={px} cy={py} r={6} fill={accent} stroke={SURFACE} strokeWidth={3} /> : null,
      )}
    </>
  );
}

export function BarSeries({ accent, rand, x, y, w, h, count = 12 }: SceneProps & { x: number; y: number; w: number; h: number; count?: number }) {
  const gap = 8;
  const barW = (w - gap * (count - 1)) / count;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const bh = (0.2 + rand() * 0.8) * h;
        return (
          <rect
            key={i}
            x={x + i * (barW + gap)}
            y={y + h - bh}
            width={barW}
            height={bh}
            rx={3}
            fill={i % 4 === 1 ? accent : LINE_STRONG}
            opacity={i % 4 === 1 ? 0.95 : 0.5}
          />
        );
      })}
    </>
  );
}

export function StatTiles({ accent, rand, x, y, w, count = 4 }: SceneProps & { x: number; y: number; w: number; count?: number }) {
  const gap = 20;
  const tw = (w - gap * (count - 1)) / count;
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <g key={i}>
          <Panel x={x + i * (tw + gap)} y={y} w={tw} h={104} />
          <Bar x={x + i * (tw + gap) + 20} y={y + 22} w={tw * 0.42} h={8} opacity={0.45} />
          <Bar x={x + i * (tw + gap) + 20} y={y + 46} w={tw * (0.34 + rand() * 0.2)} h={18} fill={i === 0 ? accent : LINE_STRONG} opacity={i === 0 ? 0.9 : 0.8} r={4} />
          <Bar x={x + i * (tw + gap) + 20} y={y + 78} w={tw * 0.28} h={7} opacity={0.35} />
        </g>
      ))}
    </>
  );
}

export function TableRows({ rand, x, y, w, rows = 6, accent }: SceneProps & { x: number; y: number; w: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <g key={i}>
          <line x1={x} y1={y + i * 44} x2={x + w} y2={y + i * 44} stroke={LINE} strokeWidth={1.5} />
          <rect x={x + 14} y={y + i * 44 + 15} width={14} height={14} rx={4} fill={LINE_STRONG} opacity={0.45} />
          <Bar x={x + 42} y={y + i * 44 + 17} w={w * (0.14 + rand() * 0.14)} h={9} opacity={0.6} />
          <Bar x={x + w * 0.44} y={y + i * 44 + 17} w={w * (0.08 + rand() * 0.08)} h={9} opacity={0.35} />
          <rect x={x + w * 0.68} y={y + i * 44 + 13} width={58} height={18} rx={9} fill={i % 3 === 0 ? accent : LINE_STRONG} opacity={i % 3 === 0 ? 0.22 : 0.25} />
          <Bar x={x + w - 88} y={y + i * 44 + 17} w={62} h={9} opacity={0.3} />
        </g>
      ))}
    </>
  );
}
