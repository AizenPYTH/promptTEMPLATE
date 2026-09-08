import {
  Bar,
  DEEP,
  LINE,
  LINE_STRONG,
  Panel,
  SUBTLE,
  SURFACE,
  Sidebar,
  TextBlock,
  TopBar,
  VIEW_H,
  VIEW_W,
  type SceneProps,
} from "@/components/visuals/primitives";

/*
 * Scenes that give a template its own silhouette.
 *
 * Every one of these is a different composition rather than a recoloured
 * dashboard: a conversation, a board, a canvas, a spreadsheet, a document.
 * At thumbnail size the shape alone should identify the template.
 */

/** Conversation surface — an AI product. */
export function ChatScene({ accent, rand }: SceneProps) {
  const bubbles = [
    { side: "user", w: 300, h: 44 },
    { side: "bot", w: 560, h: 96 },
    { side: "user", w: 220, h: 44 },
    { side: "bot", w: 620, h: 132 },
  ] as const;
  let y = 128;
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SUBTLE} />
      <rect x={0} y={0} width={264} height={VIEW_H} fill={DEEP} />
      <line x1={264} y1={0} x2={264} y2={VIEW_H} stroke={LINE} strokeWidth={2} />
      <rect x={24} y={28} width={216} height={34} rx={8} fill={accent} opacity={0.16} />
      <Bar x={44} y={40} w={96} h={10} fill={accent} opacity={0.9} />
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i}>
          {i === 2 ? <rect x={16} y={92 + i * 40} width={232} height={32} rx={7} fill={SURFACE} opacity={0.5} /> : null}
          <Bar x={32} y={102 + i * 40} w={110 + rand() * 90} h={8} opacity={i === 2 ? 0.85 : 0.4} />
        </g>
      ))}
      <rect x={264} y={0} width={VIEW_W - 264} height={64} fill={SURFACE} />
      <line x1={264} y1={64} x2={VIEW_W} y2={64} stroke={LINE} strokeWidth={2} />
      <Bar x={296} y={28} w={140} h={10} />
      <rect x={VIEW_W - 168} y={18} width={136} height={28} rx={14} fill={SUBTLE} stroke={LINE} strokeWidth={2} />
      <Bar x={VIEW_W - 150} y={28} w={72} h={8} opacity={0.4} />
      {bubbles.map((bubble, i) => {
        const isUser = bubble.side === "user";
        const x = isUser ? VIEW_W - 40 - bubble.w : 300;
        const node = (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={bubble.w}
              height={bubble.h}
              rx={12}
              fill={isUser ? accent : SURFACE}
              opacity={isUser ? 0.92 : 1}
              stroke={isUser ? "none" : LINE}
              strokeWidth={2}
            />
            {Array.from({ length: Math.max(1, Math.round(bubble.h / 30)) }, (_, l) => (
              <Bar
                key={l}
                x={x + 18}
                y={y + 16 + l * 26}
                w={(bubble.w - 44) * (0.62 + rand() * 0.34)}
                h={8}
                fill={isUser ? "#ffffff" : LINE_STRONG}
                opacity={isUser ? 0.75 : 0.5}
              />
            ))}
          </g>
        );
        y += bubble.h + 26;
        return node;
      })}
      <rect x={300} y={VIEW_H - 116} width={VIEW_W - 340} height={72} rx={14} fill={SURFACE} stroke={LINE} strokeWidth={2} />
      <Bar x={324} y={VIEW_H - 88} w={280} h={9} opacity={0.3} />
      <rect x={VIEW_W - 116} y={VIEW_H - 100} width={40} height={40} rx={10} fill={accent} />
      <Bar x={324} y={VIEW_H - 32} w={180} h={7} opacity={0.25} />
    </>
  );
}

/** Column board — an issue tracker. */
export function KanbanScene({ accent, rand }: SceneProps) {
  const columns = [4, 3, 5, 2];
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SUBTLE} />
      <Sidebar accent={accent} rand={rand} width={180} />
      <rect x={180} y={0} width={VIEW_W - 180} height={64} fill={SURFACE} />
      <line x1={180} y1={64} x2={VIEW_W} y2={64} stroke={LINE} strokeWidth={2} />
      <Bar x={212} y={28} w={130} h={11} />
      <rect x={VIEW_W - 132} y={18} width={100} height={28} rx={7} fill={accent} />
      {columns.map((count, c) => {
        const x = 212 + c * 248;
        return (
          <g key={c}>
            <Bar x={x} y={96} w={76 + rand() * 30} h={9} opacity={0.55} />
            <rect x={x + 108} y={92} width={26} height={16} rx={8} fill={LINE_STRONG} opacity={0.3} />
            {Array.from({ length: count }, (_, i) => {
              const y = 126 + i * 116;
              return (
                <g key={i}>
                  <Panel x={x} y={y} w={220} h={100} r={8} />
                  <rect
                    x={x + 16}
                    y={y + 16}
                    width={44}
                    height={14}
                    rx={7}
                    fill={c === 1 && i === 0 ? accent : LINE_STRONG}
                    opacity={c === 1 && i === 0 ? 0.9 : 0.28}
                  />
                  <Bar x={x + 16} y={y + 44} w={150 + rand() * 44} h={9} opacity={0.6} />
                  <Bar x={x + 16} y={y + 62} w={90 + rand() * 50} h={8} opacity={0.32} />
                  <circle cx={x + 26} cy={y + 84} r={8} fill={LINE_STRONG} opacity={0.35} />
                  <Bar x={x + 44} y={y + 80} w={54} h={7} opacity={0.28} />
                </g>
              );
            })}
          </g>
        );
      })}
    </>
  );
}

/** Terminal and editor — developer tooling. */
export function TerminalScene({ accent, rand }: SceneProps) {
  const indents = [0, 0, 1, 2, 2, 1, 0, 1, 2, 3, 2, 1, 0];
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={DEEP} />
      <rect x={0} y={0} width={244} height={VIEW_H} fill={SUBTLE} />
      <line x1={244} y1={0} x2={244} y2={VIEW_H} stroke={LINE} strokeWidth={2} />
      <Bar x={28} y={30} w={96} h={9} opacity={0.5} />
      {Array.from({ length: 11 }, (_, i) => (
        <g key={i}>
          <rect x={36 + (i % 3) * 14} y={70 + i * 32} width={11} height={11} rx={2} fill={i === 4 ? accent : LINE_STRONG} opacity={i === 4 ? 1 : 0.4} />
          <Bar x={56 + (i % 3) * 14} y={70 + i * 32} w={70 + rand() * 80} h={8} opacity={i === 4 ? 0.85 : 0.35} />
        </g>
      ))}
      <rect x={244} y={0} width={VIEW_W - 244} height={44} fill={SUBTLE} />
      <line x1={244} y1={44} x2={VIEW_W} y2={44} stroke={LINE} strokeWidth={2} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={264 + i * 132} y={8} width={124} height={28} rx={6} fill={i === 0 ? DEEP : "transparent"} stroke={i === 0 ? LINE : "transparent"} strokeWidth={2} />
          <Bar x={280 + i * 132} y={18} w={72} h={8} opacity={i === 0 ? 0.7 : 0.3} />
        </g>
      ))}
      {indents.map((indent, i) => (
        <g key={i}>
          <Bar x={268} y={78 + i * 28} w={16} h={8} opacity={0.18} />
          <Bar
            x={304 + indent * 26}
            y={78 + i * 28}
            w={(120 + rand() * 380) * (1 - indent * 0.08)}
            h={8}
            fill={i % 5 === 1 ? accent : LINE_STRONG}
            opacity={i % 5 === 1 ? 0.65 : 0.4}
          />
        </g>
      ))}
      <rect x={244} y={470} width={VIEW_W - 244} height={VIEW_H - 470} fill={SURFACE} />
      <line x1={244} y1={470} x2={VIEW_W} y2={470} stroke={LINE} strokeWidth={2} />
      <Bar x={268} y={494} w={80} h={8} opacity={0.4} />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <Bar x={268} y={528 + i * 32} w={10} h={8} fill={accent} opacity={0.7} />
          <Bar x={288} y={528 + i * 32} w={200 + rand() * 460} h={8} opacity={0.32} />
        </g>
      ))}
      <rect x={268} y={528 + 6 * 32} width={9} height={14} fill={accent} />
    </>
  );
}

/** Node canvas — automation. */
export function CanvasScene({ accent, rand }: SceneProps) {
  const nodes = [
    { x: 300, y: 140 },
    { x: 300, y: 340 },
    { x: 620, y: 240 },
    { x: 620, y: 470 },
  ];
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SUBTLE} />
      {Array.from({ length: 22 }, (_, r) =>
        Array.from({ length: 34 }, (_, c) => (
          <circle key={`${r}-${c}`} cx={40 + c * 32} cy={40 + r * 32} r={1.5} fill={LINE_STRONG} opacity={0.3} />
        )),
      )}
      <rect x={0} y={0} width={196} height={VIEW_H} fill={SURFACE} />
      <line x1={196} y1={0} x2={196} y2={VIEW_H} stroke={LINE} strokeWidth={2} />
      <Bar x={24} y={32} w={90} h={10} />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          {i === 1 ? <rect x={14} y={74 + i * 40} width={168} height={32} rx={7} fill={accent} opacity={0.12} /> : null}
          <circle cx={32} cy={90 + i * 40} r={5} fill={i === 1 ? accent : LINE_STRONG} opacity={i === 1 ? 1 : 0.4} />
          <Bar x={48} y={86 + i * 40} w={70 + rand() * 60} h={8} opacity={i === 1 ? 0.8 : 0.35} />
        </g>
      ))}
      <path d="M420 190 L520 190 L520 290 L620 290" fill="none" stroke={LINE_STRONG} strokeWidth={3} opacity={0.5} />
      <path d="M420 390 L520 390 L520 290 L620 290" fill="none" stroke={accent} strokeWidth={3} />
      <path d="M420 390 L500 390 L500 520 L620 520" fill="none" stroke={LINE_STRONG} strokeWidth={3} opacity={0.5} />
      {nodes.map((node, i) => (
        <g key={i}>
          <rect x={node.x} y={node.y} width={200} height={100} rx={10} fill={SURFACE} stroke={i === 1 ? accent : LINE} strokeWidth={i === 1 ? 3 : 2} />
          <rect x={node.x} y={node.y} width={200} height={4} rx={2} fill={i % 2 === 0 ? accent : LINE_STRONG} opacity={i % 2 === 0 ? 0.9 : 0.5} />
          <rect x={node.x + 16} y={node.y + 22} width={22} height={22} rx={6} fill={accent} opacity={0.2} />
          <Bar x={node.x + 48} y={node.y + 28} w={90 + rand() * 40} h={9} />
          <Bar x={node.x + 16} y={node.y + 62} w={140} h={7} opacity={0.3} />
          <circle cx={node.x} cy={node.y + 50} r={5} fill={SURFACE} stroke={LINE_STRONG} strokeWidth={2} />
          <circle cx={node.x + 200} cy={node.y + 50} r={5} fill={SURFACE} stroke={LINE_STRONG} strokeWidth={2} />
        </g>
      ))}
      <Panel x={880} y={100} w={280} h={420} />
      <Bar x={904} y={128} w={110} h={10} />
      {Array.from({ length: 5 }, (_, i) => (
        <g key={i}>
          <Bar x={904} y={172 + i * 76} w={64} h={8} opacity={0.4} />
          <rect x={904} y={190 + i * 76} width={232} height={34} rx={7} fill={SUBTLE} stroke={LINE} strokeWidth={2} />
          <Bar x={920} y={203 + i * 76} w={100 + rand() * 70} h={8} opacity={0.28} />
        </g>
      ))}
      <Panel x={968} y={572} w={192} h={124} r={8} />
      <rect x={996} y={598} width={54} height={30} rx={4} fill={accent} opacity={0.35} />
      <rect x={1068} y={638} width={54} height={30} rx={4} fill={LINE_STRONG} opacity={0.3} />
    </>
  );
}

/** Spreadsheet — a data grid. */
export function GridScene({ accent, rand }: SceneProps) {
  const cols = 9;
  const rows = 14;
  const colW = (VIEW_W - 120) / cols;
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SURFACE} />
      <rect x={0} y={0} width={VIEW_W} height={52} fill={SUBTLE} />
      <line x1={0} y1={52} x2={VIEW_W} y2={52} stroke={LINE_STRONG} strokeWidth={2} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={20 + i * 108} y={13} width={96} height={26} rx={0} fill={SURFACE} stroke={LINE_STRONG} strokeWidth={2} />
      ))}
      <Bar x={36} y={22} w={62} h={8} opacity={0.5} r={0} />
      <Bar x={144} y={22} w={62} h={8} opacity={0.5} r={0} />
      <Bar x={252} y={22} w={62} h={8} opacity={0.5} r={0} />
      <rect x={352} y={13} width={300} height={26} fill={accent} opacity={0.1} />
      <Bar x={366} y={22} w={260} h={8} fill={accent} opacity={0.55} r={0} />
      <rect x={0} y={52} width={120} height={VIEW_H - 52} fill={SUBTLE} />
      {Array.from({ length: rows + 1 }, (_, r) => (
        <line key={`h${r}`} x1={0} y1={92 + r * 44} x2={VIEW_W} y2={92 + r * 44} stroke={LINE} strokeWidth={1.5} />
      ))}
      {Array.from({ length: cols }, (_, c) => (
        <line key={`v${c}`} x1={120 + c * colW} y1={52} x2={120 + c * colW} y2={VIEW_H} stroke={LINE} strokeWidth={1.5} />
      ))}
      <line x1={120} y1={52} x2={120} y2={VIEW_H} stroke={LINE_STRONG} strokeWidth={3} />
      <rect x={0} y={52} width={VIEW_W} height={40} fill={SUBTLE} />
      <line x1={0} y1={92} x2={VIEW_W} y2={92} stroke={LINE_STRONG} strokeWidth={2} />
      {Array.from({ length: cols }, (_, c) => (
        <Bar key={`ch${c}`} x={134 + c * colW} y={68} w={colW * 0.5} h={8} opacity={0.55} r={0} />
      ))}
      {Array.from({ length: rows }, (_, r) => (
        <g key={r}>
          <Bar x={16} y={110 + r * 44} w={70} h={8} opacity={0.3} r={0} />
          {Array.from({ length: cols }, (_, c) => (
            <Bar
              key={c}
              x={134 + c * colW}
              y={110 + r * 44}
              w={colW * (0.32 + rand() * 0.44)}
              h={8}
              opacity={0.32}
              r={0}
            />
          ))}
        </g>
      ))}
      <rect
        x={120 + 2 * colW}
        y={92 + 3 * 44}
        width={colW * 3}
        height={44 * 4}
        fill={accent}
        opacity={0.08}
        stroke={accent}
        strokeWidth={3}
      />
    </>
  );
}

/** Contact sheet — a photographic portfolio. */
export function GalleryScene({ accent, rand }: SceneProps) {
  const cols = 6;
  const rows = 4;
  const w = 176;
  const h = 148;
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SUBTLE} />
      <Bar x={48} y={40} w={180} h={14} />
      <Bar x={VIEW_W - 220} y={42} w={172} h={9} opacity={0.35} />
      <line x1={48} y1={78} x2={VIEW_W - 48} y2={78} stroke={LINE} strokeWidth={2} />
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const highlight = r === 1 && c === 3;
          const x = 48 + c * (w + 12);
          const y = 106 + r * (h + 34);
          return (
            <g key={`${r}-${c}`}>
              <rect x={x} y={y} width={w} height={h} fill={DEEP} stroke={LINE} strokeWidth={2} />
              <rect
                x={x + 18}
                y={y + 22}
                width={w - 36}
                height={h - 44}
                fill={highlight ? accent : LINE_STRONG}
                opacity={highlight ? 0.6 : 0.36 + rand() * 0.26}
              />
              <rect
                x={x + 18}
                y={y + h - 52}
                width={(w - 36) * (0.3 + rand() * 0.4)}
                height={30}
                fill={SURFACE}
                opacity={0.16}
              />
              {highlight ? <rect x={x - 4} y={y - 4} width={w + 8} height={h + 8} fill="none" stroke={accent} strokeWidth={3} /> : null}
              <Bar x={x} y={y + h + 10} w={w * (0.4 + rand() * 0.4)} h={7} opacity={0.3} r={0} />
            </g>
          );
        }),
      )}
    </>
  );
}

/** Document editor — invoicing. */
export function InvoiceScene({ accent, rand }: SceneProps) {
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SUBTLE} />
      <TopBar accent={accent} rand={rand} />
      <Panel x={48} y={92} w={584} h={584} />
      <Bar x={76} y={120} w={140} h={11} />
      {[0, 1].map((i) => (
        <g key={i}>
          <Bar x={76} y={160 + i * 70} w={70} h={8} opacity={0.4} />
          <rect x={76} y={180 + i * 70} width={528} height={34} rx={6} fill={SUBTLE} stroke={LINE} strokeWidth={2} />
          <Bar x={92} y={193 + i * 70} w={150 + rand() * 90} h={8} opacity={0.3} />
        </g>
      ))}
      <line x1={76} y1={324} x2={604} y2={324} stroke={LINE_STRONG} strokeWidth={2} />
      {["", "", "", ""].map((_, i) => (
        <g key={i}>
          <line x1={76} y1={360 + i * 44} x2={604} y2={360 + i * 44} stroke={LINE} strokeWidth={1.5} />
          <Bar x={76} y={336 + i * 44} w={150 + rand() * 60} h={8} opacity={0.4} />
          <Bar x={340} y={336 + i * 44} w={40} h={8} opacity={0.28} />
          <Bar x={420} y={336 + i * 44} w={60} h={8} opacity={0.28} />
          <Bar x={534} y={336 + i * 44} w={70} h={8} opacity={0.45} />
        </g>
      ))}
      <rect x={76} y={548} width={528} height={40} rx={6} fill={SUBTLE} stroke={LINE} strokeWidth={2} strokeDasharray="6 5" />
      <Bar x={280} y={563} w={120} h={9} opacity={0.3} />
      <rect x={340} y={612} width={264} height={44} rx={8} fill={DEEP} />
      <Bar x={362} y={628} w={92} h={10} opacity={0.5} />
      <Bar x={520} y={626} w={66} h={14} fill={accent} opacity={0.9} r={4} />
      <Panel x={664} y={92} w={488} h={584} />
      <rect x={664} y={92} width={488} height={64} fill={SUBTLE} />
      <line x1={664} y1={156} x2={1152} y2={156} stroke={LINE} strokeWidth={2} />
      <Bar x={688} y={118} w={110} h={10} opacity={0.5} />
      <rect x={1064} y={112} width={64} height={22} rx={11} fill={accent} opacity={0.2} />
      <Bar x={704} y={196} w={200} h={18} r={4} />
      <Bar x={704} y={230} w={130} h={9} opacity={0.35} />
      <Bar x={950} y={196} w={170} h={9} opacity={0.35} />
      <Bar x={950} y={216} w={130} h={9} opacity={0.35} />
      <line x1={704} y1={280} x2={1120} y2={280} stroke={LINE} strokeWidth={2} />
      {Array.from({ length: 5 }, (_, i) => (
        <g key={i}>
          <Bar x={704} y={306 + i * 40} w={180 + rand() * 70} h={8} opacity={0.32} />
          <Bar x={1046} y={306 + i * 40} w={74} h={8} opacity={0.32} />
        </g>
      ))}
      <line x1={880} y1={520} x2={1120} y2={520} stroke={LINE} strokeWidth={2} />
      <Bar x={880} y={544} w={90} h={9} opacity={0.35} />
      <Bar x={1050} y={544} w={70} h={9} opacity={0.35} />
      <Bar x={880} y={580} w={110} h={14} />
      <Bar x={1020} y={578} w={100} h={16} fill={accent} opacity={0.9} r={4} />
    </>
  );
}

/** Results and map — travel. */
export function MapScene({ accent, rand }: SceneProps) {
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SUBTLE} />
      <rect x={0} y={0} width={VIEW_W} height={92} fill={SURFACE} />
      <line x1={0} y1={92} x2={VIEW_W} y2={92} stroke={LINE} strokeWidth={2} />
      <circle cx={44} cy={46} r={9} fill={accent} />
      <rect x={210} y={24} width={560} height={44} rx={22} fill={SUBTLE} stroke={LINE} strokeWidth={2} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Bar x={238 + i * 176} y={40} w={104} h={8} opacity={0.35} />
          {i > 0 ? <line x1={222 + i * 176} y1={34} x2={222 + i * 176} y2={58} stroke={LINE} strokeWidth={2} /> : null}
        </g>
      ))}
      <circle cx={742} cy={46} r={18} fill={accent} />
      <rect x={640} y={0} width={560} height={VIEW_H} fill={DEEP} />
      <rect x={640} y={92} width={560} height={VIEW_H - 92} fill={DEEP} />
      {Array.from({ length: 7 }, (_, i) => (
        <path
          key={`r${i}`}
          d={`M${660 + i * 80} 92 L${700 + i * 80} ${VIEW_H}`}
          stroke={LINE_STRONG}
          strokeWidth={2}
          opacity={0.25}
          fill="none"
        />
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <line key={`c${i}`} x1={640} y1={160 + i * 120} x2={VIEW_W} y2={140 + i * 120} stroke={LINE_STRONG} strokeWidth={2} opacity={0.25} />
      ))}
      {Array.from({ length: 6 }, (_, i) => {
        const x = 700 + rand() * 440;
        const y = 170 + rand() * 480;
        const active = i === 2;
        return (
          <g key={i}>
            <rect x={x} y={y} width={active ? 68 : 56} height={26} rx={13} fill={active ? accent : SURFACE} stroke={active ? "none" : LINE} strokeWidth={2} />
            <Bar x={x + 14} y={y + 9} w={active ? 40 : 28} h={8} fill={active ? "#ffffff" : LINE_STRONG} opacity={active ? 0.85 : 0.5} />
          </g>
        );
      })}
      {Array.from({ length: 4 }, (_, i) => {
        const y = 120 + i * 152;
        return (
          <g key={i}>
            <Panel x={32} y={y} w={576} h={132} />
            <rect x={32} y={y} width={180} height={132} rx={10} fill={DEEP} />
            <rect x={80} y={y + 40} width={84} height={52} rx={6} fill={LINE_STRONG} opacity={0.28} />
            <Bar x={232} y={y + 24} w={180 + rand() * 70} h={11} />
            <Bar x={232} y={y + 50} w={130} h={8} opacity={0.35} />
            {i === 0 ? <rect x={232} y={y + 74} width={78} height={20} rx={10} fill="none" stroke={accent} strokeWidth={2} /> : null}
            <Bar x={232} y={y + 104} w={96} h={8} opacity={0.28} />
            <Bar x={508} y={y + 96} w={80} h={16} fill={accent} opacity={0.9} r={4} />
            <Bar x={520} y={y + 26} w={68} h={9} opacity={0.35} />
          </g>
        );
      })}
    </>
  );
}

/** Day timeline — clinical scheduling. */
export function TimelineScene({ accent, rand }: SceneProps) {
  const hours = 10;
  const step = (VIEW_W - 300) / hours;
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SUBTLE} />
      <rect x={0} y={0} width={VIEW_W} height={72} fill={SURFACE} />
      <line x1={0} y1={72} x2={VIEW_W} y2={72} stroke={LINE} strokeWidth={2} />
      <Bar x={48} y={32} w={160} h={12} />
      <rect x={VIEW_W - 196} y={22} width={148} height={30} rx={8} fill={accent} opacity={0.14} />
      <Bar x={VIEW_W - 174} y={33} w={104} h={8} fill={accent} opacity={0.7} />
      <rect x={0} y={72} width={252} height={VIEW_H - 72} fill={SURFACE} />
      <line x1={252} y1={72} x2={252} y2={VIEW_H} stroke={LINE} strokeWidth={2} />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          {i === 1 ? <rect x={0} y={104 + i * 104} width={252} height={88} fill={accent} opacity={0.08} /> : null}
          {i === 1 ? <rect x={0} y={104 + i * 104} width={4} height={88} fill={accent} /> : null}
          <circle cx={44} cy={140 + i * 104} r={14} fill={DEEP} />
          <Bar x={70} y={126 + i * 104} w={110 + rand() * 50} h={10} />
          <Bar x={70} y={148 + i * 104} w={80} h={8} opacity={0.35} />
          <rect x={70} y={166 + i * 104} width={62} height={16} rx={8} fill={i === 1 ? accent : LINE_STRONG} opacity={i === 1 ? 0.85 : 0.25} />
        </g>
      ))}
      {Array.from({ length: hours + 1 }, (_, i) => (
        <g key={i}>
          <line x1={288 + i * step} y1={104} x2={288 + i * step} y2={VIEW_H - 40} stroke={LINE} strokeWidth={1.5} />
          <Bar x={288 + i * step - 12} y={84} w={26} h={7} opacity={0.3} />
        </g>
      ))}
      <line x1={288 + 4.4 * step} y1={104} x2={288 + 4.4 * step} y2={VIEW_H - 40} stroke={accent} strokeWidth={3} />
      {Array.from({ length: 6 }, (_, row) =>
        Array.from({ length: 3 }, (_, d) => {
          const slot = Math.floor(rand() * hours);
          const x = 288 + slot * step + 8;
          const y = 118 + row * 104;
          const done = slot < 4;
          return (
            <g key={`${row}-${d}`}>
              <rect
                x={x}
                y={y}
                width={step - 20}
                height={34}
                rx={6}
                fill={done ? LINE_STRONG : accent}
                opacity={done ? 0.22 : 0.85}
              />
              <Bar x={x + 12} y={y + 13} w={(step - 20) * 0.5} h={7} fill={done ? LINE_STRONG : "#ffffff"} opacity={done ? 0.5 : 0.8} />
            </g>
          );
        }),
      )}
    </>
  );
}

/** Tables, uptime and footnotes — infrastructure. */
export function ReportScene({ accent, rand }: SceneProps) {
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SURFACE} />
      <TopBar accent={accent} rand={rand} />
      <Bar x={64} y={104} w={280} h={20} r={4} />
      <Bar x={64} y={140} w={420} h={9} opacity={0.35} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={720 + i * 116} y={100} width={104} height={52} rx={6} fill={SUBTLE} stroke={LINE} strokeWidth={2} />
          <circle cx={738 + i * 116} cy={118} r={5} fill={i === 3 ? accent : LINE_STRONG} opacity={i === 3 ? 1 : 0.5} />
          <Bar x={750 + i * 116} y={114} w={56} h={7} opacity={0.4} />
          <Bar x={738 + i * 116} y={132} w={44} h={8} opacity={0.6} />
        </g>
      ))}
      <line x1={64} y1={186} x2={VIEW_W - 64} y2={186} stroke={LINE_STRONG} strokeWidth={2} />
      {Array.from({ length: 6 }, (_, r) => (
        <g key={r}>
          <line x1={64} y1={228 + r * 42} x2={VIEW_W - 64} y2={228 + r * 42} stroke={LINE} strokeWidth={1.5} />
          <Bar x={64} y={204 + r * 42} w={140 + rand() * 40} h={8} opacity={r === 0 ? 0.6 : 0.4} />
          {[0, 1, 2, 3].map((c) => (
            <Bar key={c} x={340 + c * 180} y={204 + r * 42} w={64 + rand() * 40} h={8} opacity={r === 0 ? 0.5 : 0.3} />
          ))}
          {r === 2 ? <rect x={56} y={196 + r * 42} width={VIEW_W - 112} height={32} fill={accent} opacity={0.06} /> : null}
        </g>
      ))}
      <Bar x={64} y={508} w={180} h={10} opacity={0.5} />
      {[0, 1, 2].map((row) => (
        <g key={row}>
          <Bar x={64} y={548 + row * 52} w={92} h={8} opacity={0.35} />
          {Array.from({ length: 46 }, (_, i) => {
            const bad = (row === 1 && i === 30) || (row === 2 && (i === 11 || i === 12));
            return (
              <rect
                key={i}
                x={200 + i * 20}
                y={540 + row * 52}
                width={12}
                height={24}
                rx={2}
                fill={bad ? accent : LINE_STRONG}
                opacity={bad ? 0.9 : 0.3}
              />
            );
          })}
        </g>
      ))}
      <line x1={64} y1={706} x2={VIEW_W - 64} y2={706} stroke={LINE} strokeWidth={2} />
      <Bar x={64} y={724} w={330} h={7} opacity={0.25} />
    </>
  );
}

/** Typographic archive — a brutalist studio index. */
export function ArchiveScene({ accent, rand }: SceneProps) {
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SURFACE} />
      {Array.from({ length: 13 }, (_, i) => (
        <line key={i} x1={64 + i * 90} y1={0} x2={64 + i * 90} y2={VIEW_H} stroke={LINE} strokeWidth={1.5} opacity={0.6} />
      ))}
      <line x1={0} y1={72} x2={VIEW_W} y2={72} stroke={LINE_STRONG} strokeWidth={2} />
      <Bar x={64} y={32} w={110} h={12} r={0} />
      <Bar x={VIEW_W - 260} y={34} w={80} h={8} opacity={0.4} r={0} />
      <Bar x={VIEW_W - 160} y={34} w={96} h={8} fill={accent} opacity={0.8} r={0} />
      <Bar x={64} y={128} w={720} h={44} r={0} />
      <Bar x={64} y={188} w={460} h={44} r={0} />
      <line x1={0} y1={286} x2={VIEW_W} y2={286} stroke={LINE_STRONG} strokeWidth={2} />
      <g>
        {["", "", "", "", "", "", ""].map((_, i) => (
          <g key={i}>
            <line x1={0} y1={344 + i * 58} x2={VIEW_W} y2={344 + i * 58} stroke={LINE} strokeWidth={1.5} />
            <Bar x={64} y={316 + i * 58} w={44} h={8} opacity={0.4} r={0} />
            <Bar x={244} y={316 + i * 58} w={150 + rand() * 120} h={9} opacity={i === 2 ? 0.85 : 0.5} r={0} />
            <Bar x={694} y={316 + i * 58} w={110 + rand() * 60} h={8} opacity={0.3} r={0} />
            {i === 2 ? <Bar x={1064} y={316 + i * 58} w={72} h={8} fill={accent} opacity={0.9} r={0} /> : null}
          </g>
        ))}
      </g>
    </>
  );
}

/** One image, one idea — a luxury lookbook. */
export function LookbookScene({ accent, rand }: SceneProps) {
  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill={SUBTLE} />
      <Bar x={168} y={44} w={120} h={11} />
      {[0, 1, 2].map((i) => (
        <Bar key={i} x={880 + i * 84} y={46} w={56} h={8} opacity={0.35} />
      ))}
      <rect x={168} y={128} width={392} height={490} fill={DEEP} stroke={LINE} strokeWidth={2} />
      <rect x={210} y={188} width={308} height={340} fill={LINE_STRONG} opacity={0.46} />
      <rect x={210} y={452} width={180} height={76} fill={SURFACE} opacity={0.18} />
      <circle cx={470} cy={236} r={26} fill={accent} opacity={0.22} />
      <Bar x={640} y={236} w={26} h={26} fill={accent} r={13} />
      <Bar x={640} y={300} w={392} h={26} r={0} />
      <Bar x={640} y={344} w={286} h={26} r={0} />
      <TextBlock x={640} y={416} width={392} lines={3} rand={rand} gap={24} h={8} opacity={0.35} />
      <line x1={640} y1={520} x2={1032} y2={520} stroke={LINE} strokeWidth={2} />
      <Bar x={640} y={548} w={150} h={9} opacity={0.45} />
      <Bar x={168} y={664} w={120} h={8} opacity={0.3} />
      <Bar x={912} y={664} w={120} h={8} opacity={0.3} />
    </>
  );
}
