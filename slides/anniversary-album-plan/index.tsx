import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';

// ─── Webfonts (load once in <head>) ───────────────────────────────────────────
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Noto+Serif+TC:wght@500;700&family=Caveat:wght@600&display=swap';
if (typeof document !== 'undefined' && !document.getElementById('osd-webfont')) {
  const link = document.createElement('link');
  link.id = 'osd-webfont';
  link.rel = 'stylesheet';
  link.href = FONT_HREF;
  document.head.appendChild(link);
}

// ─── Design tokens (panel-tweakable) ──────────────────────────────────────────
export const design: DesignSystem = {
  palette: { bg: '#e6dac3', text: '#33291b', accent: '#a8783a' },
  fonts: {
    display: '"Fraunces", "Noto Serif TC", Georgia, serif',
    body: '"Noto Serif TC", "Songti TC", serif',
  },
  typeScale: { hero: 132, body: 32 },
  radius: 8,
};

// ─── Local constants ──────────────────────────────────────────────────────────
const font = {
  display: design.fonts.display,
  body: design.fonts.body,
  hand: '"Caveat", "Noto Serif TC", cursive',
};

const desk = {
  text: '#33291b',
  soft: '#6f5d40',
  faint: '#9a866133',
  gold: '#a8783a',
  rule: '#c9b896',
};

type MaterialKey = 'kraft' | 'black' | 'white';
const MATERIAL: Record<
  MaterialKey,
  { label: string; bg: string; ink: string; sub: string; frameBg: string; frameLine: string; accent: string; tape: string }
> = {
  kraft: {
    label: '牛皮內頁',
    bg: 'linear-gradient(135deg, #c9a973 0%, #bd9a61 55%, #b08c52 100%)',
    ink: '#3f2e19',
    sub: '#6a5128',
    frameBg: '#efe3c8',
    frameLine: '#fbf6ea',
    accent: '#7c5a26',
    tape: 'rgba(255,250,235,0.45)',
  },
  black: {
    label: '黑色內頁',
    bg: 'linear-gradient(135deg, #1c1712 0%, #15110c 60%, #100d09 100%)',
    ink: '#efe5d2',
    sub: '#a99a78',
    frameBg: '#241d13',
    frameLine: '#3a2e1c',
    accent: '#cda55b',
    tape: 'rgba(205,162,80,0.28)',
  },
  white: {
    label: '白色自黏',
    bg: 'linear-gradient(135deg, #f6f1e6 0%, #f1ebdc 60%, #ece4d3 100%)',
    ink: '#2d2417',
    sub: '#7c6c50',
    frameBg: '#ffffff',
    frameLine: '#ece2cd',
    accent: '#a8783a',
    tape: 'rgba(168,120,58,0.18)',
  },
};

// ─── Shared chrome / animations ───────────────────────────────────────────────
const styles = `
  @keyframes ap-fade { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes ap-fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .ap-fade { opacity: 0; animation: ap-fade .8s cubic-bezier(.2,.7,.2,1) forwards; }
  .ap-fadeIn { opacity: 0; animation: ap-fadeIn 1s ease forwards; }
`;
const Styles = () => <style>{styles}</style>;

const grain =
  'radial-gradient(rgba(120,95,55,0.06) 1px, transparent 1px), radial-gradient(rgba(120,95,55,0.05) 1px, transparent 1px)';

const fill = {
  width: '100%',
  height: '100%',
  position: 'relative' as const,
  overflow: 'hidden' as const,
  fontFamily: font.body,
  background: 'var(--osd-bg)',
  color: desk.text,
  backgroundImage: grain,
  backgroundSize: '22px 22px, 22px 22px',
  backgroundPosition: '0 0, 11px 11px',
};

const Eyebrow = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div
    style={{
      fontFamily: font.body,
      fontSize: 24,
      letterSpacing: '0.34em',
      textTransform: 'uppercase',
      color: desk.gold,
      ...style,
    }}
  >
    {children}
  </div>
);

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 46,
        left: 120,
        right: 120,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: font.body,
        fontSize: 22,
        color: desk.soft,
        letterSpacing: '0.08em',
      }}
    >
      <span style={{ fontFamily: font.hand, fontSize: 30, color: desk.gold }}>我們的第一年</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

// ─── Photo slot ───────────────────────────────────────────────────────────────
const PhotoFrame = ({
  m,
  label,
  size,
  style,
  src,
}: {
  m: MaterialKey;
  label: string;
  size?: string;
  style?: React.CSSProperties;
  src?: string;
}) => {
  const mat = MATERIAL[m];
  return (
    <div
      style={{
        position: 'relative',
        background: src ? 'transparent' : mat.frameBg,
        border: `1px solid ${mat.frameLine}`,
        boxShadow: '0 10px 24px -14px rgba(0,0,0,0.55), inset 0 0 0 6px rgba(255,255,255,0.04)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* washi tape accent */}
      <div
        style={{
          position: 'absolute',
          top: -12,
          left: '50%',
          width: 84,
          height: 26,
          transform: 'translateX(-50%) rotate(-3deg)',
          background: mat.tape,
          borderLeft: '1px dashed rgba(255,255,255,0.3)',
          borderRight: '1px dashed rgba(255,255,255,0.3)',
        }}
      />
      {src ? (
        <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              border: `2px solid ${mat.sub}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: mat.sub,
              fontSize: 22,
            }}
          >
            ❏
          </div>
          <div style={{ fontFamily: font.body, fontSize: 24, color: mat.sub, fontWeight: 700 }}>{label}</div>
          {size && <div style={{ fontFamily: font.hand, fontSize: 26, color: mat.sub }}>{size}</div>}
        </>
      )}
    </div>
  );
};

// ─── Handwriting / text placeholder ──────────────────────────────────────────
const WriteSlot = ({
  m,
  lines = 3,
  label,
  style,
}: {
  m: MaterialKey;
  lines?: number;
  label?: string;
  style?: React.CSSProperties;
}) => {
  const mat = MATERIAL[m];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26, ...style }}>
      {label && <div style={{ fontFamily: font.hand, fontSize: 30, color: mat.sub }}>{label}</div>}
      <Rule m={m} />
      {lines >= 2 && <Rule m={m} w="92%" />}
      {lines >= 3 && <Rule m={m} w="78%" />}
      {lines >= 4 && <Rule m={m} w="88%" />}
      {lines >= 5 && <Rule m={m} w="70%" />}
    </div>
  );
};
const Rule = ({ m, w = '100%' }: { m: MaterialKey; w?: string }) => (
  <div style={{ height: 2, width: w, background: MATERIAL[m].sub, opacity: 0.45, borderRadius: 2 }} />
);

// ─── Ratio bar (圖 / 文 / 留白) ────────────────────────────────────────────────
const RatioBar = ({ img, text, blank }: { img: number; text: number; blank: number }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', height: 18, borderRadius: 9, overflow: 'hidden', border: `1px solid ${desk.rule}` }}>
      {img > 0 && <div style={{ width: `${img}%`, background: desk.gold }} />}
      {text > 0 && <div style={{ width: `${text}%`, background: '#6f5d40' }} />}
      {blank > 0 && <div style={{ width: `${blank}%`, background: 'transparent' }} />}
    </div>
    <div style={{ display: 'flex', gap: 24, fontFamily: font.body, fontSize: 21, color: desk.soft }}>
      <span><span style={{ color: desk.gold }}>■</span> 圖 {img}</span>
      <span><span style={{ color: '#6f5d40' }}>■</span> 文 {text}</span>
      <span><span style={{ color: desk.rule }}>□</span> 留白 {blank}</span>
    </div>
  </div>
);

// ─── The square album page card ───────────────────────────────────────────────
const PageCard = ({ m, children }: { m: MaterialKey; children: React.ReactNode }) => {
  const mat = MATERIAL[m];
  return (
    <div
      style={{
        width: 840,
        height: 840,
        flexShrink: 0,
        background: mat.bg,
        color: mat.ink,
        borderRadius: 6,
        boxShadow: '0 40px 70px -34px rgba(40,28,12,0.7), 0 0 0 1px rgba(0,0,0,0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* binding holes hint (left edge) */}
      <div
        style={{
          position: 'absolute',
          left: 22,
          top: 0,
          bottom: 0,
          width: 2,
          background: 'rgba(0,0,0,0.10)',
        }}
      />
      <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
    </div>
  );
};

// ─── The standard plan layout: square card + info panel ───────────────────────
const PlanPage = ({
  side,
  m,
  sheet,
  title,
  ratio,
  photo,
  write,
  tip,
  children,
}: {
  side: string;
  m: MaterialKey;
  sheet: string;
  title: string;
  ratio: { img: number; text: number; blank: number };
  photo: string[];
  write: string[];
  tip: string;
  children: React.ReactNode;
}) => {
  const mat = MATERIAL[m];
  const chipBg =
    m === 'black' ? '#2a2114' : m === 'kraft' ? '#c9a973' : '#efe6d4';
  const chipInk = m === 'black' ? '#e9dcc0' : '#3f2e19';
  return (
    <div style={fill}>
      <Styles />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '100px 120px 96px',
          display: 'flex',
          alignItems: 'center',
          gap: 72,
        }}
      >
        <div className="ap-fade">
          <PageCard m={m}>{children}</PageCard>
        </div>

        {/* info panel */}
        <div
          className="ap-fade"
          style={{ animationDelay: '0.12s', flex: 1, display: 'flex', flexDirection: 'column', gap: 26, minWidth: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span
              style={{
                fontFamily: font.body,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: chipInk,
                background: chipBg,
                border: `1px solid ${mat.accent}`,
                padding: '6px 16px',
                borderRadius: 999,
              }}
            >
              {sheet}
            </span>
            <span style={{ fontFamily: font.body, fontSize: 22, color: desk.soft, letterSpacing: '0.06em' }}>
              {side}
            </span>
          </div>

          <h2
            style={{
              fontFamily: font.display,
              fontSize: 72,
              fontWeight: 600,
              lineHeight: 1.05,
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h2>

          <RatioBar img={ratio.img} text={ratio.text} blank={ratio.blank} />

          <PanelBlock icon="📷" heading="照片建議" lines={photo} />
          <PanelBlock icon="✍️" heading="想寫的話" lines={write} />

          <div
            style={{
              marginTop: 4,
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              fontFamily: font.hand,
              fontSize: 28,
              color: desk.gold,
              lineHeight: 1.35,
            }}
          >
            <span>✦</span>
            <span>{tip}</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const PanelBlock = ({ icon, heading, lines }: { icon: string; heading: string; lines: string[] }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ fontFamily: font.body, fontSize: 23, fontWeight: 700, color: desk.text, letterSpacing: '0.04em' }}>
      <span style={{ marginRight: 8 }}>{icon}</span>
      {heading}
    </div>
    <ul style={{ margin: 0, paddingLeft: 30, fontFamily: font.body, fontSize: 25, lineHeight: 1.5, color: desk.soft }}>
      {lines.map((l) => (
        <li key={l}>{l}</li>
      ))}
    </ul>
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 1 · DECK COVER
// ══════════════════════════════════════════════════════════════════════════════
const Cover: Page = () => (
  <div style={fill}>
    <Styles />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '130px 150px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div className="ap-fade" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Eyebrow>Anniversary Album · Layout Plan</Eyebrow>
        <span style={{ fontFamily: font.hand, fontSize: 34, color: desk.gold }}>給你的 ♡</span>
      </div>

      <div>
        <div className="ap-fade" style={{ fontFamily: font.hand, fontSize: 56, color: desk.gold, marginBottom: 6 }}>
          我們的
        </div>
        <h1
          className="ap-fade"
          style={{
            fontFamily: font.display,
            fontSize: 200,
            fontWeight: 600,
            lineHeight: 0.92,
            margin: 0,
            letterSpacing: '-0.02em',
            animationDelay: '0.1s',
          }}
        >
          第一年
        </h1>
        <p
          className="ap-fade"
          style={{ marginTop: 40, fontSize: 38, color: desk.soft, maxWidth: 1100, lineHeight: 1.5, animationDelay: '0.25s' }}
        >
          一本手做綁繩相本的版面規劃 — 圖、文、與想說的話，留好位置，等你填進回憶。
        </p>
      </div>

      <div
        className="ap-fade"
        style={{ display: 'flex', gap: 40, fontFamily: font.body, fontSize: 24, color: desk.soft, animationDelay: '0.4s' }}
      >
        <Swatch label="白色自黏 ×1" c="#f1ebdc" ink="#3f2e19" />
        <Swatch label="黑色自黏 ×1" c="#15110c" ink="#e9dcc0" />
        <Swatch label="牛皮內頁 ×7" c="#bd9a61" ink="#3f2e19" />
        <Swatch label="黑色內頁 ×4" c="#15110c" ink="#e9dcc0" />
      </div>
    </div>
    <Footer />
  </div>
);

const Swatch = ({ label, c, ink }: { label: string; c: string; ink: string }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
    <span style={{ width: 26, height: 26, borderRadius: 6, background: c, border: '1px solid rgba(0,0,0,0.18)', color: ink }} />
    {label}
  </span>
);

// ══════════════════════════════════════════════════════════════════════════════
// 2 · HOW TO USE
// ══════════════════════════════════════════════════════════════════════════════
const HowTo: Page = () => (
  <div style={fill}>
    <Styles />
    <div style={{ position: 'absolute', inset: 0, padding: '110px 150px 110px', display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div className="ap-fade">
        <Eyebrow>How to read this</Eyebrow>
        <h2 style={{ fontFamily: font.display, fontSize: 84, fontWeight: 600, margin: '18px 0 0', lineHeight: 1.04 }}>
          怎麼看這份規劃
        </h2>
      </div>

      <div className="ap-fade" style={{ animationDelay: '0.12s', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56 }}>
        <LegendCard
          title="① 材質＝底色"
          body="每一張方形卡＝相本的一個面。卡片底色就是那張紙的材質：牛皮（暖棕）、黑頁、白頁。順序與材質都可以自由調換。"
        />
        <LegendCard
          title="② 看圖文留白比例"
          body="每頁右側有一條比例條：金=照片、深棕=文字、空白=留白。整本盡量不要每面都塞滿字，留點呼吸空間更耐看。"
        />
        <LegendCard
          title="③ 照片是佔位框"
          body="方框只是「這裡貼一張照片」的位置與建議尺寸。你之後印出真照片，剪好貼上即可。框上膠帶感只是示意。"
        />
        <LegendCard
          title="④ 文字照著提示寫"
          body="橫線＝手寫區。右側『想寫的話』給你開頭引導，照著延伸就好。不用全部寫滿，短短一兩句也很動人。"
        />
      </div>

      <div className="ap-fade" style={{ animationDelay: '0.24s', fontFamily: font.hand, fontSize: 32, color: desk.gold }}>
        ✦ 全書 13 張紙、正反共 26 面 — 這份規劃只用其中約 19 面，其餘留白或當備用。
      </div>
    </div>
    <Footer />
  </div>
);

const LegendCard = ({ title, body }: { title: string; body: string }) => (
  <div
    style={{
      background: 'rgba(255,252,244,0.5)',
      border: `1px solid ${desk.rule}`,
      borderRadius: 12,
      padding: '30px 34px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}
  >
    <div style={{ fontFamily: font.display, fontSize: 38, fontWeight: 600, color: desk.text }}>{title}</div>
    <div style={{ fontFamily: font.body, fontSize: 27, lineHeight: 1.55, color: desk.soft }}>{body}</div>
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 3 · LAYOUT ARCHETYPES
// ══════════════════════════════════════════════════════════════════════════════
const Archetypes: Page = () => (
  <div style={fill}>
    <Styles />
    <div style={{ position: 'absolute', inset: 0, padding: '96px 120px 100px', display: 'flex', flexDirection: 'column', gap: 36 }}>
      <div className="ap-fade">
        <Eyebrow>Six simple templates</Eyebrow>
        <h2 style={{ fontFamily: font.display, fontSize: 76, fontWeight: 600, margin: '16px 0 0', lineHeight: 1.04 }}>
          六種好手做的版型
        </h2>
      </div>
      <div
        className="ap-fade"
        style={{ animationDelay: '0.12s', flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: 30 }}
      >
        <ArchCard name="A · 滿版大圖" desc="一張照片鋪滿，標題壓在上面。封面、跨頁瞬間。" mini={<MiniFull />} />
        <ArchCard name="B · 大圖＋短句" desc="上圖下字，一句話收尾。最百搭、最好貼。" mini={<MiniHeroCaption />} />
        <ArchCard name="C · 圖文左右" desc="一邊照片、一邊手寫故事。適合說一段回憶。" mini={<MiniSplit />} />
        <ArchCard name="D · 四宮格拼貼" desc="2×2 小照片＋短籤。日常、旅行美食。" mini={<MiniGrid />} />
        <ArchCard name="E · 純文字留白" desc="整頁手寫＋大量留白。情書、想說的話。" mini={<MiniText />} />
        <ArchCard name="F · 扉頁分隔" desc="大標題＋小圖，開啟新篇章。如濟州島。" mini={<MiniDivider />} />
      </div>
    </div>
    <Footer />
  </div>
);

const ArchCard = ({ name, desc, mini }: { name: string; desc: string; mini: React.ReactNode }) => (
  <div
    style={{
      background: 'rgba(255,252,244,0.5)',
      border: `1px solid ${desk.rule}`,
      borderRadius: 12,
      padding: 22,
      display: 'flex',
      gap: 20,
      alignItems: 'center',
    }}
  >
    <div style={{ width: 132, height: 132, flexShrink: 0, background: '#bd9a61', borderRadius: 6, padding: 12, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)' }}>
      {mini}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontFamily: font.display, fontSize: 30, fontWeight: 600, color: desk.text }}>{name}</div>
      <div style={{ fontFamily: font.body, fontSize: 21, lineHeight: 1.4, color: desk.soft }}>{desc}</div>
    </div>
  </div>
);

const mb = { background: '#efe3c8', border: '1px solid #fbf6ea' } as const;
const ml = { background: '#6a5128', opacity: 0.5, borderRadius: 1 } as const;
const MiniFull = () => <div style={{ ...mb, width: '100%', height: '100%' }} />;
const MiniHeroCaption = () => (
  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ ...mb, flex: 1 }} />
    <div style={{ ...ml, height: 6, width: '70%' }} />
  </div>
);
const MiniSplit = () => (
  <div style={{ width: '100%', height: '100%', display: 'flex', gap: 8 }}>
    <div style={{ ...mb, flex: 1 }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 7 }}>
      <div style={{ ...ml, height: 5 }} />
      <div style={{ ...ml, height: 5, width: '80%' }} />
      <div style={{ ...ml, height: 5, width: '60%' }} />
    </div>
  </div>
);
const MiniGrid = () => (
  <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8 }}>
    <div style={mb} />
    <div style={mb} />
    <div style={mb} />
    <div style={mb} />
  </div>
);
const MiniText = () => (
  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 9 }}>
    <div style={{ ...ml, height: 5 }} />
    <div style={{ ...ml, height: 5, width: '90%' }} />
    <div style={{ ...ml, height: 5, width: '75%' }} />
    <div style={{ ...ml, height: 5, width: '85%' }} />
  </div>
);
const MiniDivider = () => (
  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
    <div style={{ ...ml, height: 8, width: '60%' }} />
    <div style={{ ...mb, width: 38, height: 38, borderRadius: '50%' }} />
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 4 · STORY FLOW MAP
// ══════════════════════════════════════════════════════════════════════════════
const FlowMap: Page = () => (
  <div style={fill}>
    <Styles />
    <div style={{ position: 'absolute', inset: 0, padding: '90px 120px 100px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div className="ap-fade">
        <Eyebrow>The whole arc · cover → back</Eyebrow>
        <h2 style={{ fontFamily: font.display, fontSize: 70, fontWeight: 600, margin: '14px 0 0', lineHeight: 1.04 }}>
          整本故事線
        </h2>
      </div>
      <div className="ap-fade" style={{ animationDelay: '0.12s', flex: 1, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18, alignContent: 'start' }}>
        <FlowItem n="05" m="white" t="封面" />
        <FlowItem n="06" m="white" t="開場白" />
        <FlowItem n="07" m="kraft" t="我們的開始" />
        <FlowItem n="08" m="kraft" t="第一次約會" />
        <FlowItem n="09" m="kraft" t="日常拼貼" />
        <FlowItem n="10" m="kraft" t="我喜歡你的" />
        <FlowItem n="11" m="black" t="濟州島·扉頁" />
        <FlowItem n="12" m="black" t="濟州島·風景" />
        <FlowItem n="13" m="kraft" t="濟州島·日記" />
        <FlowItem n="14" m="kraft" t="濟州島·美食" />
        <FlowItem n="15" m="black" t="濟州島·我們" />
        <FlowItem n="16" m="kraft" t="這一年時間軸" />
        <FlowItem n="17" m="black" t="給你的信" />
        <FlowItem n="18" m="kraft" t="未來·第二年" />
        <FlowItem n="19" m="black" t="封底" />
      </div>
      <div className="ap-fade" style={{ animationDelay: '0.24s', fontFamily: font.hand, fontSize: 30, color: desk.gold }}>
        ✦ 順序、材質都可調換 — 牛皮 6·7、黑頁 4 與部分背面，刻意留白備用。
      </div>
    </div>
    <Footer />
  </div>
);

const FlowItem = ({ n, m, t }: { n: string; m: MaterialKey; t: string }) => {
  const mat = MATERIAL[m];
  const chipInk = m === 'black' ? '#e9dcc0' : '#3f2e19';
  return (
    <div
      style={{
        background: mat.bg,
        color: chipInk,
        borderRadius: 8,
        padding: '16px 18px',
        height: 116,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 12px 24px -16px rgba(40,28,12,0.6)',
      }}
    >
      <span style={{ fontFamily: font.body, fontSize: 18, opacity: 0.7, letterSpacing: '0.1em' }}>相本 {n} 面</span>
      <span style={{ fontFamily: font.display, fontSize: 27, fontWeight: 600, lineHeight: 1.1 }}>{t}</span>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// 5 · 白自黏 正 — 封面
// ══════════════════════════════════════════════════════════════════════════════
const P_Cover: Page = () => (
  <PlanPage
    sheet="白色自黏"
    side="正面 · 第 1 面"
    title="封面"
    m="white"
    ratio={{ img: 80, text: 15, blank: 5 }}
    photo={['一張你們最喜歡的合照，鋪滿整頁', '建議印 15×15 cm 滿版，四邊各留 1 cm']}
    write={['書名：我們的第一年', '小字落款：日期 + 你的名字']}
    tip="自黏頁直接撕背貼，最適合做滿版封面。"
  >
    <PhotoFrame m="white" label="主合照 · 滿版" size="約 15×15 cm" style={{ position: 'absolute', inset: 40 }} />
    <div style={{ position: 'absolute', left: 70, bottom: 80, right: 70 }}>
      <div style={{ fontFamily: font.display, fontSize: 78, fontWeight: 600, color: '#fff', textShadow: '0 2px 14px rgba(0,0,0,0.55)' }}>
        我們的第一年
      </div>
      <div style={{ fontFamily: font.hand, fontSize: 38, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)', marginTop: 8 }}>
        2025 – 2026 · ♡
      </div>
    </div>
  </PlanPage>
);

// ══════════════════════════════════════════════════════════════════════════════
// 6 · 白自黏 背 — 開場白
// ══════════════════════════════════════════════════════════════════════════════
const P_Opening: Page = () => (
  <PlanPage
    sheet="白色自黏"
    side="背面 · 第 2 面"
    title="開場白 · 扉頁"
    m="white"
    ratio={{ img: 10, text: 55, blank: 35 }}
    photo={['可放一張小小的票根 / 拍立得（選配）', '靠角落貼，留大量空白']}
    write={['致：（她的名字）', '「翻開這本，是我們的第一年…」', '兩三行就好，慢慢開場']}
    tip="留白是主角 — 別寫滿，呼吸感最重要。"
  >
    <div style={{ position: 'absolute', inset: 0, padding: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ fontFamily: font.hand, fontSize: 44, color: MATERIAL.white.accent, marginBottom: 30 }}>致 親愛的你 —</div>
      <WriteSlot m="white" lines={4} />
      <div style={{ flex: 1 }} />
      <PhotoFrame m="white" label="小票根" size="6×4 cm" style={{ width: 150, height: 110, alignSelf: 'flex-end' }} />
    </div>
  </PlanPage>
);

// ══════════════════════════════════════════════════════════════════════════════
// 7 · 牛皮1 正 — 我們的開始
// ══════════════════════════════════════════════════════════════════════════════
const P_Start: Page = () => (
  <PlanPage
    sheet="牛皮內頁 ①"
    side="正面 · 第 3 面"
    title="我們的開始"
    m="kraft"
    ratio={{ img: 40, text: 55, blank: 5 }}
    photo={['一張早期的合照或當時的場景', '左側直放，約 9×11 cm']}
    write={['我們怎麼認識的？', '第一次見面你的樣子、我的心跳', '那天的天氣 / 地點']}
    tip="版型 C 圖文左右 — 一張圖配一段故事。"
  >
    <div style={{ position: 'absolute', inset: 0, padding: 64, display: 'flex', gap: 40, alignItems: 'center' }}>
      <PhotoFrame m="kraft" label="初遇" size="9×11 cm" style={{ width: 300, height: 380 }} />
      <WriteSlot m="kraft" lines={5} label="故事，從這裡開始…" style={{ flex: 1, height: 420 }} />
    </div>
  </PlanPage>
);

// ══════════════════════════════════════════════════════════════════════════════
// 8 · 牛皮1 背 — 第一次約會
// ══════════════════════════════════════════════════════════════════════════════
const P_FirstDate: Page = () => (
  <PlanPage
    sheet="牛皮內頁 ①"
    side="背面 · 第 4 面"
    title="第一次約會"
    m="kraft"
    ratio={{ img: 70, text: 25, blank: 5 }}
    photo={['一張大照片，當天的你 / 你們', '上方橫放，約 13×10 cm']}
    write={['一句話標題：「我們的第一次」', '一行小註：去了哪、做了什麼']}
    tip="版型 B 大圖＋短句 — 最百搭。"
  >
    <div style={{ position: 'absolute', inset: 0, padding: 64, display: 'flex', flexDirection: 'column', gap: 30 }}>
      <PhotoFrame m="kraft" label="第一次約會" size="13×10 cm" style={{ width: '100%', flex: 1 }} />
      <div style={{ fontFamily: font.hand, fontSize: 40, color: MATERIAL.kraft.ink }}>我們的第一次 ♡</div>
      <WriteSlot m="kraft" lines={1} />
    </div>
  </PlanPage>
);

// ══════════════════════════════════════════════════════════════════════════════
// 9 · 牛皮2 正 — 日常拼貼
// ══════════════════════════════════════════════════════════════════════════════
const P_Daily: Page = () => (
  <PlanPage
    sheet="牛皮內頁 ②"
    side="正面 · 第 5 面"
    title="那些日常"
    m="kraft"
    ratio={{ img: 80, text: 20, blank: 0 }}
    photo={['四張生活小照：吃飯、散步、耍笨…', '2×2 等大，每張約 6×6 cm']}
    write={['每張下方一句小籤即可', '例：「你笑成這樣」「又吃太多」']}
    tip="版型 D 四宮格 — 等距對齊就很整齊。"
  >
    <div style={{ position: 'absolute', inset: 0, padding: 60, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 30 }}>
      <PhotoFrame m="kraft" label="日常 1" size="6×6 cm" />
      <PhotoFrame m="kraft" label="日常 2" size="6×6 cm" />
      <PhotoFrame m="kraft" label="日常 3" size="6×6 cm" />
      <PhotoFrame m="kraft" label="日常 4" size="6×6 cm" />
    </div>
  </PlanPage>
);

// ══════════════════════════════════════════════════════════════════════════════
// 10 · 牛皮2 背 — 我喜歡你的
// ══════════════════════════════════════════════════════════════════════════════
const P_LoveList: Page = () => (
  <PlanPage
    sheet="牛皮內頁 ②"
    side="背面 · 第 6 面"
    title="我最喜歡你的⋯"
    m="kraft"
    ratio={{ img: 15, text: 60, blank: 25 }}
    photo={['右下角一張你的小特寫（選配）', '約 7×7 cm']}
    write={['條列 3–5 點你最愛她的地方', '「你的笑」「認真的側臉」「不講理時也可愛」']}
    tip="清單式手寫 — 留白讓清單更有重量。"
  >
    <div style={{ position: 'absolute', inset: 0, padding: 64, display: 'flex', flexDirection: 'column', gap: 26 }}>
      <div style={{ fontFamily: font.hand, fontSize: 42, color: MATERIAL.kraft.ink }}>我最喜歡你的⋯</div>
      <ListLine m="kraft" t="01" />
      <ListLine m="kraft" t="02" />
      <ListLine m="kraft" t="03" />
      <div style={{ flex: 1 }} />
      <PhotoFrame m="kraft" label="你的特寫" size="7×7 cm" style={{ width: 170, height: 170, alignSelf: 'flex-end' }} />
    </div>
  </PlanPage>
);

const ListLine = ({ m, t }: { m: MaterialKey; t: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
    <span style={{ fontFamily: font.display, fontSize: 34, fontWeight: 600, color: MATERIAL[m].accent }}>{t}</span>
    <div style={{ flex: 1, height: 2, background: MATERIAL[m].sub, opacity: 0.45, borderRadius: 2 }} />
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 11 · 黑1 正 — 濟州島 扉頁
// ══════════════════════════════════════════════════════════════════════════════
const P_JejuDivider: Page = () => (
  <PlanPage
    sheet="黑色內頁 ①"
    side="正面 · 第 7 面"
    title="濟州島 · 扉頁"
    m="black"
    ratio={{ img: 25, text: 30, blank: 45 }}
    photo={['一張代表性的小圖（機票 / 海岸）', '置中，約 8×8 cm']}
    write={['大標題：濟州島 JEJU', '副標：出發日期 / 幾天幾夜']}
    tip="版型 F 扉頁 — 黑底＋留白最有電影感。"
  >
    <div style={{ position: 'absolute', inset: 0, padding: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 34 }}>
      <div style={{ fontFamily: font.body, fontSize: 26, letterSpacing: '0.4em', color: MATERIAL.black.sub }}>CHAPTER · JEJU</div>
      <div style={{ fontFamily: font.display, fontSize: 96, fontWeight: 600, color: MATERIAL.black.ink, lineHeight: 1 }}>濟州島</div>
      <PhotoFrame m="black" label="代表照" size="8×8 cm" style={{ width: 200, height: 200 }} />
      <div style={{ fontFamily: font.hand, fontSize: 34, color: MATERIAL.black.accent }}>2025 · 我們的第一次旅行</div>
    </div>
  </PlanPage>
);

// ══════════════════════════════════════════════════════════════════════════════
// 12 · 黑1 背 — 濟州島 風景滿版
// ══════════════════════════════════════════════════════════════════════════════
const P_JejuView: Page = () => (
  <PlanPage
    sheet="黑色內頁 ①"
    side="背面 · 第 8 面"
    title="濟州島 · 風景"
    m="black"
    ratio={{ img: 92, text: 8, blank: 0 }}
    photo={['一張最美的風景／海景，鋪滿', '滿版約 14×14 cm，黑邊留窄框']}
    write={['角落一行小白字地名即可', '例：涯月海岸 · 城山日出峰']}
    tip="版型 A 滿版 — 黑頁襯風景特別深邃。"
  >
    <PhotoFrame m="black" label="風景 · 滿版" size="14×14 cm" style={{ position: 'absolute', inset: 36 }} />
    <div style={{ position: 'absolute', left: 60, bottom: 60, fontFamily: font.hand, fontSize: 34, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>
      城山日出峰 ·
    </div>
  </PlanPage>
);

// ══════════════════════════════════════════════════════════════════════════════
// 13 · 牛皮3 正 — 濟州島 日記
// ══════════════════════════════════════════════════════════════════════════════
const P_JejuDiary: Page = () => (
  <PlanPage
    sheet="牛皮內頁 ③"
    side="正面 · 第 9 面"
    title="濟州島 · 旅行日記"
    m="kraft"
    ratio={{ img: 50, text: 50, blank: 0 }}
    photo={['兩張旅途照片，一上一下錯落', '各約 8×6 cm']}
    write={['像日記一樣記下那幾天', '最難忘的一刻 / 一句你說的話']}
    tip="圖文交錯 — 照片與字輪流出現更耐讀。"
  >
    <div style={{ position: 'absolute', inset: 0, padding: 60, display: 'flex', gap: 36 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, width: 280 }}>
        <PhotoFrame m="kraft" label="旅途 1" size="8×6 cm" style={{ width: '100%', height: 220 }} />
        <PhotoFrame m="kraft" label="旅途 2" size="8×6 cm" style={{ width: '100%', height: 220 }} />
      </div>
      <WriteSlot m="kraft" lines={5} label="Day 1 — " style={{ flex: 1, height: 480 }} />
    </div>
  </PlanPage>
);

// ══════════════════════════════════════════════════════════════════════════════
// 14 · 牛皮3 背 — 濟州島 美食
// ══════════════════════════════════════════════════════════════════════════════
const P_JejuFood: Page = () => (
  <PlanPage
    sheet="牛皮內頁 ③"
    side="背面 · 第 10 面"
    title="濟州島 · 吃了什麼"
    m="kraft"
    ratio={{ img: 72, text: 28, blank: 0 }}
    photo={['三張美食 / 小物照，橫向排', '各約 6×8 cm']}
    write={['每張配一句評語或店名', '「黑豬肉 ★★★★★」']}
    tip="一排三張＋短籤 — 旅行美食頁最歡樂。"
  >
    <div style={{ position: 'absolute', inset: 0, padding: 58, display: 'flex', flexDirection: 'column', gap: 30 }}>
      <div style={{ fontFamily: font.hand, fontSize: 40, color: MATERIAL.kraft.ink }}>我們吃遍濟州 🍊</div>
      <div style={{ flex: 1, display: 'flex', gap: 24 }}>
        <FoodCol n="1" />
        <FoodCol n="2" />
        <FoodCol n="3" />
      </div>
    </div>
  </PlanPage>
);

const FoodCol = ({ n }: { n: string }) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
    <PhotoFrame m="kraft" label={`美食 ${n}`} size="6×8 cm" style={{ width: '100%', flex: 1 }} />
    <div style={{ height: 2, width: '80%', background: MATERIAL.kraft.sub, opacity: 0.45, borderRadius: 2, alignSelf: 'center' }} />
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 15 · 黑2 正 — 濟州島 我們倆
// ══════════════════════════════════════════════════════════════════════════════
const P_JejuUs: Page = () => (
  <PlanPage
    sheet="黑色內頁 ②"
    side="正面 · 第 11 面"
    title="濟州島 · 我們倆"
    m="black"
    ratio={{ img: 78, text: 22, blank: 0 }}
    photo={['一張你們倆的合照，置中偏上', '約 12×12 cm']}
    write={['一句最浪漫的話收尾', '「謝謝你陪我看了這片海」']}
    tip="大圖＋一句深情 — 旅行篇的句點。"
  >
    <div style={{ position: 'absolute', inset: 0, padding: 64, display: 'flex', flexDirection: 'column', gap: 34, alignItems: 'center', justifyContent: 'center' }}>
      <PhotoFrame m="black" label="我們倆" size="12×12 cm" style={{ width: 460, height: 460 }} />
      <div style={{ fontFamily: font.hand, fontSize: 40, color: MATERIAL.black.ink, textAlign: 'center' }}>
        謝謝你陪我，看了這片海
      </div>
    </div>
  </PlanPage>
);

// ══════════════════════════════════════════════════════════════════════════════
// 16 · 牛皮4 正 — 這一年時間軸
// ══════════════════════════════════════════════════════════════════════════════
const P_Timeline: Page = () => (
  <PlanPage
    sheet="牛皮內頁 ④"
    side="正面 · 第 12 面"
    title="這一年 · 時間軸"
    m="kraft"
    ratio={{ img: 40, text: 55, blank: 5 }}
    photo={['每個里程碑配一張小圖（選配）', '小圓 / 小方，約 4×4 cm']}
    write={['標出 3–4 個重要日子', '在一起 / 第一次旅行 / 紀念日']}
    tip="一條線＋幾個點 — 簡單就有儀式感。"
  >
    <div style={{ position: 'absolute', inset: 0, padding: '70px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 40 }}>
      <div style={{ fontFamily: font.hand, fontSize: 40, color: MATERIAL.kraft.ink }}>我們走過的這一年</div>
      <TLNode t="在一起" />
      <TLNode t="第一次旅行 · 濟州島" />
      <TLNode t="一週年紀念日" />
    </div>
  </PlanPage>
);

const TLNode = ({ t }: { t: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
    <PhotoFrame m="kraft" label="" size="" style={{ width: 96, height: 96, borderRadius: '50%' }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
      <div style={{ fontFamily: font.display, fontSize: 34, fontWeight: 600, color: MATERIAL.kraft.ink }}>{t}</div>
      <div style={{ height: 2, width: '70%', background: MATERIAL.kraft.sub, opacity: 0.4, borderRadius: 2 }} />
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// 17 · 黑3 正 — 給你的信
// ══════════════════════════════════════════════════════════════════════════════
const P_Letter: Page = () => (
  <PlanPage
    sheet="黑色內頁 ③"
    side="正面 · 第 13 面"
    title="給你的一封信"
    m="black"
    ratio={{ img: 0, text: 80, blank: 20 }}
    photo={['這頁不放照片 — 純文字', '讓字本身成為主角']}
    write={['整頁手寫情書，最重要的一頁', '想說的話、感謝、與承諾']}
    tip="純文字＋留白 — 慢慢寫，這頁她會讀很多次。"
  >
    <div style={{ position: 'absolute', inset: 0, padding: 76, display: 'flex', flexDirection: 'column', gap: 30, justifyContent: 'center' }}>
      <div style={{ fontFamily: font.hand, fontSize: 46, color: MATERIAL.black.accent }}>親愛的你：</div>
      <WriteSlot m="black" lines={5} />
      <div style={{ fontFamily: font.hand, fontSize: 34, color: MATERIAL.black.sub, alignSelf: 'flex-end', marginTop: 10 }}>
        愛你的 ＿＿＿
      </div>
    </div>
  </PlanPage>
);

// ══════════════════════════════════════════════════════════════════════════════
// 18 · 牛皮5 正 — 未來
// ══════════════════════════════════════════════════════════════════════════════
const P_Future: Page = () => (
  <PlanPage
    sheet="牛皮內頁 ⑤"
    side="正面 · 第 14 面"
    title="未來 · 第二年"
    m="kraft"
    ratio={{ img: 40, text: 55, blank: 5 }}
    photo={['一張帶點未來感的合照（選配）', '右側直放，約 9×11 cm']}
    write={['想一起做的事、想去的地方', '對第二年的小小願望清單']}
    tip="收尾要往前看 — 留一格給還沒發生的我們。"
  >
    <div style={{ position: 'absolute', inset: 0, padding: 64, display: 'flex', gap: 40, alignItems: 'center' }}>
      <WriteSlot m="kraft" lines={5} label="第二年，我們要…" style={{ flex: 1, height: 420 }} />
      <PhotoFrame m="kraft" label="未來的我們" size="9×11 cm" style={{ width: 300, height: 380 }} />
    </div>
  </PlanPage>
);

// ══════════════════════════════════════════════════════════════════════════════
// 19 · 黑自黏 — 封底
// ══════════════════════════════════════════════════════════════════════════════
const P_Back: Page = () => (
  <PlanPage
    sheet="黑色自黏"
    side="封底 · 第 15 面"
    title="封底"
    m="black"
    ratio={{ img: 35, text: 30, blank: 35 }}
    photo={['一張小小的合照或背影', '置中偏上，約 8×8 cm']}
    write={['一句收尾：「未完待續⋯」', '落款日期 + 你的名字']}
    tip="自黏黑頁收尾 — 少即是多，留白告別。"
  >
    <div style={{ position: 'absolute', inset: 0, padding: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36 }}>
      <PhotoFrame m="black" label="背影 / 合照" size="8×8 cm" style={{ width: 220, height: 220 }} />
      <div style={{ fontFamily: font.display, fontSize: 56, fontWeight: 600, color: MATERIAL.black.ink }}>未完待續⋯</div>
      <div style={{ fontFamily: font.hand, fontSize: 32, color: MATERIAL.black.accent }}>To be continued · 2026</div>
    </div>
  </PlanPage>
);

// ══════════════════════════════════════════════════════════════════════════════
// 20 · 備用 & 手做提醒
// ══════════════════════════════════════════════════════════════════════════════
const Tips: Page = () => (
  <div style={fill}>
    <Styles />
    <div style={{ position: 'absolute', inset: 0, padding: '100px 150px', display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div className="ap-fade">
        <Eyebrow>Spare sheets & hand-making notes</Eyebrow>
        <h2 style={{ fontFamily: font.display, fontSize: 80, fontWeight: 600, margin: '16px 0 0', lineHeight: 1.04 }}>
          留白備用 · 手做小提醒
        </h2>
      </div>
      <div className="ap-fade" style={{ animationDelay: '0.12s', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56 }}>
        <LegendCard title="🗂 備用的紙" body="牛皮 ⑥⑦、黑色內頁 ④、以及多數背面，刻意留白。臨時想加照片或多寫幾句時，它們就是你的餘裕。" />
        <LegendCard title="🖨 印照片" body="霧面相紙比亮面好寫字也不反光。先依框上建議尺寸裁切，乾膠 / 雙面膠四角點貼，避免整面塗膠起皺。" />
        <LegendCard title="🖊 筆的選擇" body="牛皮頁用白色 / 金色中性筆最跳；黑頁用白筆或金筆；白頁用深棕 / 黑筆。先在邊角試寫再下筆。" />
        <LegendCard title="🌬 比例原則" body="一面之內：圖、文、留白盡量別三者全滿。滿版圖頁就少字，情書頁就別放圖 — 一頁一個重點。" />
      </div>
      <div className="ap-fade" style={{ animationDelay: '0.24s', fontFamily: font.hand, fontSize: 34, color: desk.gold }}>
        ✦ 慢慢做，這份心意她會收一輩子。— 完 —
      </div>
    </div>
    <Footer />
  </div>
);

// ─── Subtle deck-wide transition (RISE) ───────────────────────────────────────
export const transition = {
  duration: 200,
  exit: {
    duration: 140,
    easing: 'cubic-bezier(0.4, 0, 1, 1)',
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-4px)' },
    ],
  },
  enter: {
    duration: 200,
    delay: 80,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

export const meta: SlideMeta = {
  title: '我們的第一年 · 相本規劃',
  createdAt: '2026-06-17T12:00:00Z',
};

export default [
  Cover,
  HowTo,
  Archetypes,
  FlowMap,
  P_Cover,
  P_Opening,
  P_Start,
  P_FirstDate,
  P_Daily,
  P_LoveList,
  P_JejuDivider,
  P_JejuView,
  P_JejuDiary,
  P_JejuFood,
  P_JejuUs,
  P_Timeline,
  P_Letter,
  P_Future,
  P_Back,
  Tips,
] satisfies Page[];
