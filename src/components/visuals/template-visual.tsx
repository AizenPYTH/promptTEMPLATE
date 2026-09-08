import type { VisualKind } from "@/types/template";
import { seededRandom } from "@/lib/utils";

/**
 * Every preview in the product is drawn, not photographed.
 *
 * Each scene is an abstract wireframe of a real interface, themed from the
 * design tokens so it works in both themes, tinted with the template's accent
 * and varied deterministically by a seed so no two templates look identical.
 * No network requests, no broken images, no licensing questions.
 */

const VIEW_W = 1200;
const VIEW_H = 750;

interface SceneProps {
  accent: string;
  rand: () => number;
}

const SURFACE = "var(--surface)";
const SUBTLE = "var(--surface-2)";
const DEEP = "var(--surface-3)";
const LINE = "var(--line)";
const LINE_STRONG = "var(--line-strong)";

function Bar({
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

function Panel({
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

function TextBlock({
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

function TopBar({ accent, rand, dark = false }: SceneProps & { dark?: boolean }) {
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

function Sidebar({ accent, rand, width = 220 }: SceneProps & { width?: number }) {
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

function LineChart({ accent, rand, x, y, w, h }: SceneProps & { x: number; y: number; w: number; h: number }) {
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

function BarSeries({ accent, rand, x, y, w, h, count = 12 }: SceneProps & { x: number; y: number; w: number; h: number; count?: number }) {
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

function StatTiles({ accent, rand, x, y, w, count = 4 }: SceneProps & { x: number; y: number; w: number; count?: number }) {
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

function TableRows({ rand, x, y, w, rows = 6, accent }: SceneProps & { x: number; y: number; w: number; rows?: number }) {
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

/* ---------------------------------- scenes --------------------------------- */

function LandingScene(props: SceneProps) {
  const { accent, rand } = props;
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SUBTLE} />
      <TopBar {...props} />
      <Bar x={80} y={132} w={112} h={22} fill={accent} opacity={0.16} r={11} />
      <Bar x={80} y={182} w={520} h={30} r={6} />
      <Bar x={80} y={226} w={400} h={30} r={6} />
      <TextBlock x={80} y={290} width={430} lines={2} rand={rand} />
      <rect x={80} y={352} width={144} height={40} rx={8} fill={accent} />
      <rect x={240} y={352} width={130} height={40} rx={8} fill="none" stroke={LINE_STRONG} strokeWidth={2} />
      <Panel x={640} y={128} w={480} h={310} r={14} />
      <line x1={640} y1={170} x2={1120} y2={170} stroke={LINE} strokeWidth={2} />
      <circle cx={664} cy={149} r={5} fill={LINE_STRONG} opacity={0.6} />
      <circle cx={682} cy={149} r={5} fill={LINE_STRONG} opacity={0.6} />
      <LineChart {...props} x={672} y={200} w={416} h={200} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Bar key={i} x={80 + i * 116} y={470} w={78} h={14} opacity={0.28} r={4} />
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Panel x={80 + i * 353} w={313} y={540} h={160} />
          <rect x={104 + i * 353} y={566} width={26} height={26} rx={7} fill={accent} opacity={i === 0 ? 0.9 : 0.28} />
          <Bar x={104 + i * 353} y={614} w={140 + rand() * 60} h={10} />
          <TextBlock x={104 + i * 353} y={638} width={260} lines={2} rand={rand} gap={16} h={7} opacity={0.4} />
        </g>
      ))}
    </>
  );
}

function DashboardScene(props: SceneProps) {
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SUBTLE} />
      <Sidebar {...props} />
      <rect x={220} y={0} width={VIEW_W - 220} height={72} fill={SURFACE} />
      <line x1={220} y1={72} x2={VIEW_W} y2={72} stroke={LINE} strokeWidth={2} />
      <Bar x={252} y={30} w={150} h={12} />
      <rect x={VIEW_W - 268} y={22} width={148} height={30} rx={8} fill={SUBTLE} stroke={LINE} strokeWidth={2} />
      <rect x={VIEW_W - 104} y={22} width={72} height={30} rx={8} fill={props.accent} />
      <StatTiles {...props} x={252} y={104} w={916} count={4} />
      <Panel x={252} y={244} w={584} h={276} />
      <Bar x={276} y={272} w={132} h={10} />
      <LineChart {...props} x={276} y={310} w={536} h={182} />
      <Panel x={860} y={244} w={308} h={276} />
      <Bar x={884} y={272} w={110} h={10} />
      <BarSeries {...props} x={884} y={320} w={260} h={172} count={7} />
      <Panel x={252} y={548} w={916} h={168} />
      <Bar x={276} y={574} w={124} h={10} />
      <TableRows {...props} x={252} y={606} w={916} rows={3} />
      <line x1={252} y1={606} x2={1168} y2={606} stroke={LINE} strokeWidth={2} />
    </>
  );
}

function AnalyticsScene(props: SceneProps) {
  const { accent, rand } = props;
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SUBTLE} />
      <Sidebar {...props} width={88} />
      <rect x={88} y={0} width={VIEW_W - 88} height={68} fill={SURFACE} />
      <line x1={88} y1={68} x2={VIEW_W} y2={68} stroke={LINE} strokeWidth={2} />
      <Bar x={120} y={28} w={168} h={12} />
      <rect x={VIEW_W - 300} y={20} width={132} height={28} rx={7} fill={SUBTLE} stroke={LINE} strokeWidth={2} />
      <rect x={VIEW_W - 156} y={20} width={124} height={28} rx={7} fill={SUBTLE} stroke={LINE} strokeWidth={2} />
      <Panel x={120} y={100} w={1048} h={334} />
      <Bar x={148} y={130} w={140} h={11} />
      <Bar x={148} y={158} w={92} h={22} fill={accent} r={5} opacity={0.9} />
      <LineChart {...props} x={148} y={206} w={992} h={196} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Panel x={120 + i * 356} y={462} w={332} h={244} />
          <Bar x={148 + i * 356} y={490} w={104 + rand() * 40} h={10} />
          {i === 0 ? <BarSeries {...props} x={148} y={528} w={276} h={150} count={9} /> : null}
          {i === 1 ? (
            <>
              {Array.from({ length: 5 }, (_, r) =>
                Array.from({ length: 6 }, (_, c) => (
                  <rect
                    key={`${r}-${c}`}
                    x={504 + c * 46}
                    y={528 + r * 30}
                    width={38}
                    height={22}
                    rx={4}
                    fill={accent}
                    opacity={Math.max(0.06, 0.62 - r * 0.09 - c * 0.06)}
                  />
                )),
              )}
            </>
          ) : null}
          {i === 2 ? (
            <>
              <circle cx={982} cy={604} r={72} fill="none" stroke={LINE_STRONG} strokeWidth={18} opacity={0.35} />
              <circle
                cx={982}
                cy={604}
                r={72}
                fill="none"
                stroke={accent}
                strokeWidth={18}
                strokeLinecap="round"
                strokeDasharray={`${226 * (0.4 + rand() * 0.4)} 452`}
                transform="rotate(-90 982 604)"
              />
            </>
          ) : null}
        </g>
      ))}
    </>
  );
}

function CommerceScene(props: SceneProps) {
  const { accent, rand } = props;
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SUBTLE} />
      <TopBar {...props} />
      <Bar x={80} y={104} w={200} h={18} r={5} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={80 + i * 108} y={148} width={92} height={28} rx={14} fill={i === 0 ? accent : SURFACE} opacity={i === 0 ? 0.16 : 1} stroke={i === 0 ? accent : LINE} strokeWidth={2} />
      ))}
      <rect x={VIEW_W - 220} y={148} width={140} height={28} rx={7} fill={SURFACE} stroke={LINE} strokeWidth={2} />
      {Array.from({ length: 6 }, (_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 80 + col * 355;
        const y = 210 + row * 272;
        return (
          <g key={i}>
            <Panel x={x} y={y} w={315} h={244} />
            <rect x={x + 2} y={y + 2} width={311} height={158} rx={8} fill={DEEP} />
            <rect x={x + 96} y={y + 44} width={120} height={76} rx={6} fill={LINE_STRONG} opacity={0.35} />
            {i === 1 ? <rect x={x + 16} y={y + 16} width={62} height={20} rx={10} fill={accent} opacity={0.9} /> : null}
            <Bar x={x + 20} y={y + 180} w={140 + rand() * 60} h={10} />
            <Bar x={x + 20} y={y + 204} w={70} h={9} opacity={0.4} />
            <Bar x={x + 240} y={y + 202} w={54} h={12} fill={accent} opacity={0.85} r={4} />
          </g>
        );
      })}
    </>
  );
}

function PortfolioScene(props: SceneProps) {
  const { accent, rand } = props;
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SURFACE} />
      <circle cx={80} cy={56} r={9} fill={accent} />
      <Bar x={100} y={51} w={70} h={10} />
      {[0, 1, 2].map((i) => (
        <Bar key={i} x={960 + i * 76} y={52} w={52} h={8} opacity={0.45} />
      ))}
      <Bar x={80} y={132} w={430} h={26} r={6} />
      <Bar x={80} y={172} w={300} h={26} r={6} />
      <TextBlock x={80} y={228} width={360} lines={3} rand={rand} opacity={0.4} />
      <rect x={80} y={340} width={480} height={330} rx={4} fill={DEEP} />
      <rect x={200} y={430} width={240} height={150} rx={4} fill={LINE_STRONG} opacity={0.3} />
      <rect x={600} y={132} width={520} height={256} rx={4} fill={DEEP} />
      <rect x={720} y={200} width={280} height={120} rx={4} fill={LINE_STRONG} opacity={0.3} />
      <rect x={600} y={414} width={250} height={256} rx={4} fill={DEEP} />
      <rect x={870} y={414} width={250} height={256} rx={4} fill={DEEP} />
      <Bar x={600} y={690} w={120} h={8} opacity={0.35} />
      <Bar x={870} y={690} w={140} h={8} opacity={0.35} />
      <Bar x={80} y={694} w={160} h={8} opacity={0.35} />
    </>
  );
}

function EditorialScene(props: SceneProps) {
  const { accent, rand } = props;
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SURFACE} />
      <line x1={0} y1={72} x2={VIEW_W} y2={72} stroke={LINE} strokeWidth={2} />
      <Bar x={80} y={32} w={112} h={12} />
      {[0, 1, 2, 3].map((i) => (
        <Bar key={i} x={780 + i * 88} y={33} w={58} h={9} opacity={0.45} />
      ))}
      <Bar x={80} y={128} w={26} h={26} fill={accent} r={13} />
      <Bar x={80} y={186} w={880} h={34} r={4} />
      <Bar x={80} y={238} w={640} h={34} r={4} />
      <Bar x={80} y={290} w={420} h={34} r={4} />
      <line x1={80} y1={366} x2={1120} y2={366} stroke={LINE} strokeWidth={2} />
      <TextBlock x={80} y={400} width={470} lines={6} rand={rand} gap={22} opacity={0.45} />
      <TextBlock x={610} y={400} width={470} lines={4} rand={rand} gap={22} opacity={0.45} />
      <rect x={610} y={512} width={510} height={192} rx={4} fill={DEEP} />
      <rect x={730} y={560} width={270} height={96} rx={4} fill={LINE_STRONG} opacity={0.3} />
      <Bar x={80} y={556} w={200} h={9} fill={accent} opacity={0.7} />
    </>
  );
}

function MobileScene(props: SceneProps) {
  const { accent, rand } = props;
  const px = 452;
  const py = 40;
  const pw = 296;
  const ph = 670;
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SUBTLE} />
      <circle cx={600} cy={375} r={300} fill={accent} opacity={0.06} />
      <rect x={px} y={py} width={pw} height={ph} rx={44} fill={SURFACE} stroke={LINE_STRONG} strokeWidth={3} />
      <rect x={px + 108} y={py + 16} width={80} height={16} rx={8} fill={DEEP} />
      <Bar x={px + 26} y={py + 62} w={110} h={14} />
      <Bar x={px + 26} y={py + 88} w={70} h={9} opacity={0.4} />
      <circle cx={px + pw - 46} cy={py + 76} r={16} fill={DEEP} />
      <rect x={px + 22} y={py + 122} width={pw - 44} height={128} rx={16} fill={accent} opacity={0.12} />
      <Bar x={px + 42} y={py + 148} w={120} h={10} fill={accent} opacity={0.8} />
      <Bar x={px + 42} y={py + 176} w={168} h={18} r={5} />
      <rect x={px + 42} y={py + 208} width={96} height={26} rx={13} fill={accent} />
      {Array.from({ length: 4 }, (_, i) => (
        <g key={i}>
          <rect x={px + 22} y={py + 274 + i * 78} width={pw - 44} height={64} rx={14} fill={SUBTLE} stroke={LINE} strokeWidth={2} />
          <rect x={px + 38} y={py + 292 + i * 78} width={28} height={28} rx={9} fill={i === 0 ? accent : LINE_STRONG} opacity={i === 0 ? 0.9 : 0.4} />
          <Bar x={px + 78} y={py + 294 + i * 78} w={90 + rand() * 50} h={9} />
          <Bar x={px + 78} y={py + 312 + i * 78} w={60 + rand() * 40} h={7} opacity={0.35} />
        </g>
      ))}
      <line x1={px + 2} y1={py + ph - 74} x2={px + pw - 2} y2={py + ph - 74} stroke={LINE} strokeWidth={2} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={px + 40 + i * 58} y={py + ph - 52} width={22} height={22} rx={7} fill={i === 0 ? accent : LINE_STRONG} opacity={i === 0 ? 1 : 0.35} />
      ))}
      <Panel x={96} y={196} w={300} h={130} />
      <Bar x={120} y={222} w={120} h={10} />
      <BarSeries {...props} x={120} y={252} w={252} h={54} count={9} />
      <Panel x={824} y={400} w={280} h={150} />
      <Bar x={848} y={426} w={110} h={10} />
      <TextBlock x={848} y={452} width={230} lines={3} rand={rand} gap={18} h={7} opacity={0.35} />
    </>
  );
}

function DocsScene(props: SceneProps) {
  const { accent, rand } = props;
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SURFACE} />
      <rect x={0} y={0} width={VIEW_W} height={62} fill={SUBTLE} />
      <line x1={0} y1={62} x2={VIEW_W} y2={62} stroke={LINE} strokeWidth={2} />
      <circle cx={44} cy={31} r={9} fill={accent} />
      <Bar x={62} y={26} w={56} h={10} />
      <rect x={420} y={16} width={360} height={30} rx={8} fill={SURFACE} stroke={LINE} strokeWidth={2} />
      <Bar x={440} y={26} w={120} h={9} opacity={0.35} />
      <line x1={252} y1={62} x2={252} y2={VIEW_H} stroke={LINE} strokeWidth={2} />
      <line x1={948} y1={62} x2={948} y2={VIEW_H} stroke={LINE} strokeWidth={2} />
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i}>
          {i === 3 ? <rect x={20} y={104 + i * 40 - 10} width={212} height={30} rx={7} fill={accent} opacity={0.12} /> : null}
          <Bar x={40} y={104 + i * 40} w={70 + rand() * 90} h={8} opacity={i === 3 ? 0.9 : 0.4} fill={i === 3 ? accent : LINE_STRONG} />
        </g>
      ))}
      <Bar x={292} y={110} w={340} h={22} r={5} />
      <TextBlock x={292} y={162} width={600} lines={3} rand={rand} gap={20} opacity={0.4} />
      <rect x={292} y={246} width={608} height={150} rx={8} fill={SUBTLE} stroke={LINE} strokeWidth={2} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={306 + i * 74} y={258} width={66} height={22} rx={6} fill={i === 0 ? SURFACE : "transparent"} stroke={i === 0 ? LINE : "transparent"} strokeWidth={2} />
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <Bar key={i} x={312} y={300 + i * 22} w={(180 + rand() * 320)} h={8} fill={i === 1 ? accent : LINE_STRONG} opacity={i === 1 ? 0.7 : 0.45} />
      ))}
      <Bar x={292} y={430} w={220} h={14} r={4} />
      <TextBlock x={292} y={468} width={600} lines={4} rand={rand} gap={20} opacity={0.4} />
      <rect x={292} y={568} width={608} height={110} rx={8} fill={accent} opacity={0.07} />
      <rect x={292} y={568} width={4} height={110} rx={2} fill={accent} />
      <TextBlock x={320} y={598} width={520} lines={3} rand={rand} gap={20} opacity={0.4} />
      <Bar x={984} y={110} w={90} h={9} opacity={0.4} />
      {Array.from({ length: 6 }, (_, i) => (
        <Bar key={i} x={984} y={148 + i * 30} w={100 + rand() * 90} h={8} opacity={i === 1 ? 0.8 : 0.3} fill={i === 1 ? accent : LINE_STRONG} />
      ))}
    </>
  );
}

function PricingScene(props: SceneProps) {
  const { accent, rand } = props;
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SUBTLE} />
      <TopBar {...props} />
      <Bar x={430} y={122} w={340} h={26} r={6} />
      <Bar x={490} y={166} w={220} h={12} opacity={0.4} />
      <rect x={512} y={206} width={176} height={34} rx={17} fill={SURFACE} stroke={LINE} strokeWidth={2} />
      <rect x={516} y={210} width={84} height={26} rx={13} fill={accent} opacity={0.9} />
      {[0, 1, 2].map((i) => {
        const x = 96 + i * 344;
        const featured = i === 1;
        return (
          <g key={i}>
            <Panel x={x} y={featured ? 274 : 296} w={320} h={featured ? 400 : 356} r={14} stroke={featured ? accent : LINE} />
            {featured ? <rect x={x + 110} y={258} width={100} height={24} rx={12} fill={accent} /> : null}
            <Bar x={x + 28} y={(featured ? 274 : 296) + 34} w={94} h={11} />
            <Bar x={x + 28} y={(featured ? 274 : 296) + 66} w={110 + i * 16} h={26} fill={featured ? accent : LINE_STRONG} r={6} opacity={featured ? 0.9 : 0.8} />
            <rect x={x + 28} y={(featured ? 274 : 296) + 112} width={264} height={38} rx={9} fill={featured ? accent : "transparent"} stroke={featured ? "none" : LINE_STRONG} strokeWidth={2} />
            {Array.from({ length: 5 }, (_, r) => (
              <g key={r}>
                <circle cx={x + 36} cy={(featured ? 274 : 296) + 184 + r * 34} r={6} fill={accent} opacity={0.5} />
                <Bar x={x + 52} y={(featured ? 274 : 296) + 179 + r * 34} w={140 + rand() * 90} h={8} opacity={0.4} />
              </g>
            ))}
          </g>
        );
      })}
    </>
  );
}

function CheckoutScene(props: SceneProps) {
  const { accent, rand } = props;
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SUBTLE} />
      <TopBar {...props} />
      <Bar x={96} y={112} w={220} h={18} r={5} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Panel x={96} y={164 + i * 172} w={640} h={i === 0 ? 152 : 152} />
          <circle cx={128} cy={196 + i * 172} r={13} fill={i === 0 ? accent : LINE_STRONG} opacity={i === 0 ? 1 : 0.4} />
          <Bar x={152} y={190 + i * 172} w={140} h={11} />
          {i === 0 ? (
            <>
              <rect x={128} y={228} width={576} height={36} rx={7} fill={SUBTLE} stroke={LINE} strokeWidth={2} />
              <Bar x={144} y={241} w={180} h={9} opacity={0.35} />
              <rect x={128} y={274} width={276} height={36} rx={7} fill={SUBTLE} stroke={LINE} strokeWidth={2} />
              <rect x={428} y={274} width={276} height={36} rx={7} fill={SUBTLE} stroke={LINE} strokeWidth={2} />
            </>
          ) : (
            <TextBlock x={152} y={222 + i * 172} width={480} lines={2} rand={rand} opacity={0.3} />
          )}
        </g>
      ))}
      <Panel x={776} y={164} w={328} h={382} />
      <Bar x={804} y={192} w={120} h={11} />
      {Array.from({ length: 3 }, (_, i) => (
        <g key={i}>
          <rect x={804} y={228 + i * 68} width={52} height={52} rx={8} fill={DEEP} />
          <Bar x={870} y={240 + i * 68} w={120 + rand() * 50} h={9} />
          <Bar x={870} y={262 + i * 68} w={64} h={8} opacity={0.35} />
        </g>
      ))}
      <line x1={804} y1={444} x2={1076} y2={444} stroke={LINE} strokeWidth={2} />
      <Bar x={804} y={464} w={90} h={9} opacity={0.4} />
      <Bar x={1000} y={464} w={76} h={9} opacity={0.4} />
      <Bar x={804} y={496} w={110} h={14} />
      <Bar x={980} y={494} w={96} h={16} fill={accent} r={4} opacity={0.9} />
      <rect x={776} y={572} width={328} height={44} rx={9} fill={accent} />
    </>
  );
}

function AuthScene(props: SceneProps) {
  const { accent, rand } = props;
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SUBTLE} />
      <circle cx={600} cy={330} r={280} fill={accent} opacity={0.07} />
      <Panel x={392} y={148} w={416} h={454} r={16} />
      <circle cx={600} cy={210} r={18} fill={accent} />
      <Bar x={506} y={252} w={188} h={16} r={4} />
      <Bar x={532} y={284} w={136} h={9} opacity={0.4} />
      {[0, 1].map((i) => (
        <g key={i}>
          <Bar x={432} y={332 + i * 84} w={80} h={8} opacity={0.45} />
          <rect x={432} y={352 + i * 84} width={336} height={40} rx={8} fill={SUBTLE} stroke={LINE} strokeWidth={2} />
          <Bar x={450} y={367 + i * 84} w={140 + rand() * 60} h={8} opacity={0.3} />
        </g>
      ))}
      <rect x={432} y={510} width={336} height={42} rx={9} fill={accent} />
      <Bar x={498} y={578} w={204} h={8} opacity={0.35} />
      <Bar x={80} y={80} w={120} h={10} opacity={0.4} />
      <Bar x={1000} y={80} w={120} h={10} opacity={0.4} />
    </>
  );
}

function SettingsScene(props: SceneProps) {
  const { accent, rand } = props;
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SUBTLE} />
      <Sidebar {...props} />
      <rect x={220} y={0} width={VIEW_W - 220} height={72} fill={SURFACE} />
      <line x1={220} y1={72} x2={VIEW_W} y2={72} stroke={LINE} strokeWidth={2} />
      <Bar x={252} y={30} w={168} h={12} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <Bar x={288 + i * 128} y={104} w={82} h={9} opacity={i === 0 ? 0.9 : 0.35} fill={i === 0 ? accent : LINE_STRONG} />
          {i === 0 ? <rect x={288} y={128} width={82} height={3} rx={2} fill={accent} /> : null}
        </g>
      ))}
      <line x1={252} y1={131} x2={1168} y2={131} stroke={LINE} strokeWidth={2} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Panel x={252} y={164 + i * 186} w={916} h={162} />
          <Bar x={280} y={192 + i * 186} w={150} h={11} />
          <TextBlock x={280} y={218 + i * 186} width={420} lines={2} rand={rand} gap={18} h={7} opacity={0.35} />
          {i === 1 ? (
            <>
              <rect x={840} y={196 + i * 186} width={300} height={38} rx={8} fill={SUBTLE} stroke={LINE} strokeWidth={2} />
              <rect x={840} y={248 + i * 186} width={300} height={38} rx={8} fill={SUBTLE} stroke={LINE} strokeWidth={2} />
            </>
          ) : (
            <>
              <rect x={1064} y={200 + i * 186} width={76} height={30} rx={15} fill={i === 0 ? accent : LINE_STRONG} opacity={i === 0 ? 0.9 : 0.35} />
              <circle cx={i === 0 ? 1125 : 1079} cy={215 + i * 186} r={11} fill={SURFACE} />
            </>
          )}
        </g>
      ))}
    </>
  );
}

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
