import { useEffect, useRef, useState, useCallback } from 'react';
import './ImpactSection.css';
import satelliteImg from '../assets/impact-satellite.jpg';

/* ─── Impact category data ───────────────────────────────────── */
const CATEGORIES = [
  {
    id: 'audience' as const,
    num: '01',
    label: 'TARGET\nAUDIENCE',
    labelShort: 'AUDIENCE',
    subtitle: 'Users of high-resolution geospatial information',
    points: [
      'Government & disaster-management agencies',
      'Urban & regional planners',
      'Agriculture & land-monitoring departments',
      'Researchers & geospatial institutions',
    ],
  },
  {
    id: 'social' as const,
    num: '02',
    label: 'SOCIAL\nBENEFITS',
    labelShort: 'SOCIAL',
    subtitle: 'Finer detail for local-scale decisions',
    points: [
      'Finer road & building feature identification',
      'Improved post-event disaster-area assessment',
      'Better local-scale infrastructure mapping',
      'More accessible analysis from medium-resolution imagery',
    ],
  },
  {
    id: 'economic' as const,
    num: '03',
    label: 'ECONOMIC\nBENEFITS',
    labelShort: 'ECONOMIC',
    subtitle: 'More value from existing satellite data',
    points: [
      'Reduces dependence on costly ultra-high-resolution imagery',
      'Enables finer mapping from existing Sentinel-2 coverage',
      'Supports agriculture & infrastructure monitoring',
      'Reuses open satellite data for downstream applications',
    ],
  },
  {
    id: 'environment' as const,
    num: '04',
    label: 'ENVIRON-\nMENTAL',
    labelShort: 'ENVIRONMENTAL',
    subtitle: 'Improved observation of land and change',
    points: [
      'Improved land-cover and vegetation monitoring',
      'Finer-scale environmental feature identification',
      'Supports change detection over time',
      'Enables downstream ecological analysis',
    ],
  },
];

type CategoryId = typeof CATEGORIES[number]['id'];

/* ─── SVG Arc helpers ────────────────────────────────────────── */
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(
  cx: number, cy: number,
  innerR: number, outerR: number,
  startDeg: number, endDeg: number,
): string {
  const s1 = polar(cx, cy, outerR, startDeg);
  const e1 = polar(cx, cy, outerR, endDeg);
  const s2 = polar(cx, cy, innerR, endDeg);
  const e2 = polar(cx, cy, innerR, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${e2.x} ${e2.y}`,
    'Z',
  ].join(' ');
}

function labelPos(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  return polar(cx, cy, r, (startDeg + endDeg) / 2);
}

/* ─── Arc layout — 4 equal sectors with 2° gaps ─────────────── */
const GAP    = 2.5;
const SECTOR = (360 - 4 * GAP) / 4;  // ~88.75°
const ARC_STARTS = [0, 1, 2, 3].map((i) => i * (SECTOR + GAP));

/* ─── Main component ─────────────────────────────────────────── */
const ImpactSection: React.FC = () => {
  const sectionRef  = useRef<HTMLElement>(null);
  const [visible,  setVisible]  = useState(false);
  const [active,   setActive]   = useState<CategoryId>('audience');
  const [hovered,  setHovered]  = useState<CategoryId | null>(null);

  /* Scroll-driven entrance */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleArcClick  = useCallback((id: CategoryId) => setActive(id),  []);
  const handleArcEnter  = useCallback((id: CategoryId) => setHovered(id), []);
  const handleArcLeave  = useCallback(() => setHovered(null),              []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, id: CategoryId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActive(id);
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const idx  = CATEGORIES.findIndex((c) => c.id === id);
      const next = CATEGORIES[(idx + 1) % CATEGORIES.length];
      setActive(next.id);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const idx  = CATEGORIES.findIndex((c) => c.id === id);
      const prev = CATEGORIES[(idx - 1 + CATEGORIES.length) % CATEGORIES.length];
      setActive(prev.id);
    }
  }, []);

  /* Derived */
  const displayId  = hovered ?? active;
  const activeCat  = CATEGORIES.find((c) => c.id === displayId) ?? CATEGORIES[0];
  const activeIdx  = CATEGORIES.findIndex((c) => c.id === active);

  /* SVG canvas */
  const SIZE    = 520;
  const CX      = SIZE / 2;
  const CY      = SIZE / 2;
  const OUTER_R = 228;
  const INNER_R = 146;
  const LABEL_R = OUTER_R - 36;   // label text sits inside outer arc
  const NUM_R   = INNER_R + 18;   // number near inner edge

  return (
    <section
      id="impact"
      ref={sectionRef}
      className={`impact ${visible ? 'is-visible' : ''}`}
      aria-label="Chapter 04: Impact"
    >
      <div className="impact__edge"       aria-hidden="true" />
      <div className="impact__contour"    aria-hidden="true" />
      <div className="impact__grid-lines" aria-hidden="true" />

      <div className="impact__inner">

        {/* ── Header ─────────────────────────────────────────── */}
        <header className="impact__header">
          <div className="impact__eyebrow">
            <span className="impact__eyebrow-line" />
            <span className="impact__eyebrow-text">CHAPTER 04&nbsp;/&nbsp;IMPACT</span>
          </div>

          <h2 className="impact__title">
            <span className="impact__title-line">FROM PIXELS</span>
            <span className="impact__title-line impact__title-line--accent">TO IMPACT.</span>
          </h2>

          <p className="impact__intro">
            Sharper spatial detail can support better decisions across
            agriculture, cities, disasters, and environmental monitoring.
          </p>
        </header>

        {/* ── Body: circle + panel ─────────────────────────────── */}
        <div className="impact__body">

          {/* ──── SVG wheel ──────────────────────────────────── */}
          <div className="impact__viz-wrap">
            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="impact__svg"
              role="group"
              aria-label="Interactive impact wheel"
            >
              {/* ghost ring fill */}
              <circle
                cx={CX} cy={CY}
                r={(OUTER_R + INNER_R) / 2}
                fill="none"
                stroke="rgba(243,243,240,0.025)"
                strokeWidth={OUTER_R - INNER_R}
              />

              {/* Arc sectors */}
              {CATEGORIES.map((cat, i) => {
                const startDeg    = ARC_STARTS[i];
                const endDeg      = startDeg + SECTOR;
                const midDeg      = (startDeg + endDeg) / 2;
                const isActive    = active  === cat.id;
                const isHov       = hovered === cat.id;
                const highlighted = isActive || isHov;

                /* subtle outward push for active arc */
                const pushPx  = highlighted ? 5 : 0;
                const pushRad = ((midDeg - 90) * Math.PI) / 180;
                const tx = pushPx * Math.cos(pushRad);
                const ty = pushPx * Math.sin(pushRad);

                const path = arcPath(CX, CY, INNER_R, OUTER_R, startDeg, endDeg);
                const lp   = labelPos(CX, CY, LABEL_R, startDeg, endDeg);
                const np   = labelPos(CX, CY, NUM_R,   startDeg, endDeg);
                const lines = cat.label.split('\n');

                return (
                  <g
                    key={cat.id}
                    className={`impact__arc-group${highlighted ? ' is-active' : ''}`}
                    style={{
                      transform: `translate(${tx}px,${ty}px)`,
                    }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                    aria-label={`${cat.num} ${cat.labelShort}`}
                    onClick={() => handleArcClick(cat.id)}
                    onMouseEnter={() => handleArcEnter(cat.id)}
                    onMouseLeave={handleArcLeave}
                    onKeyDown={(e) => handleKeyDown(e, cat.id)}
                  >
                    {/* Arc fill plane */}
                    <path d={path} className="impact__arc-fill" />
                    {/* Arc stroke border */}
                    <path d={path} className="impact__arc-stroke" />

                    {/* Number — inner band */}
                    <text
                      x={np.x} y={np.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="impact__arc-num"
                    >
                      {cat.num}
                    </text>

                    {/* Label lines */}
                    {lines.map((line, li) => (
                      <text
                        key={li}
                        x={lp.x}
                        y={lp.y + (li - (lines.length - 1) / 2) * 13}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="impact__arc-label"
                      >
                        {line}
                      </text>
                    ))}
                  </g>
                );
              })}

              {/* Gap separator ticks */}
              {CATEGORIES.map((_, i) => {
                const gapMid = ARC_STARTS[i] + SECTOR + GAP / 2;
                const p1 = polar(CX, CY, INNER_R - 6, gapMid);
                const p2 = polar(CX, CY, OUTER_R + 6, gapMid);
                return (
                  <line
                    key={i}
                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                    className="impact__arc-sep"
                    aria-hidden="true"
                  />
                );
              })}

              {/* Inner boundary ring */}
              <circle
                cx={CX} cy={CY} r={INNER_R}
                fill="none"
                className="impact__inner-ring"
                aria-hidden="true"
              />

              {/* Active arc indicator tick */}
              {(() => {
                const midDeg = ARC_STARTS[activeIdx] + SECTOR / 2;
                const p1 = polar(CX, CY, INNER_R + 2, midDeg);
                const p2 = polar(CX, CY, INNER_R + 16, midDeg);
                return (
                  <line
                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                    className="impact__active-tick"
                    aria-hidden="true"
                  />
                );
              })()}
            </svg>

            {/* Center image + text (absolutely positioned over SVG) */}
            <div className="impact__center" aria-hidden="true">
              <img
                src={satelliteImg}
                alt=""
                className="impact__center-img"
                draggable={false}
              />
              <div className="impact__center-vignette" />
              <div className="impact__center-text">
                <span className="impact__center-brand">SAT VISION</span>
                <span className="impact__center-sub">FROM PIXELS<br />TO IMPACT.</span>
              </div>
            </div>
          </div>

          {/* ──── Info panel ─────────────────────────────────── */}
          <aside className="impact__panel" aria-live="polite">
            <div className="impact__panel-inner" key={activeCat.id}>

              <div className="impact__panel-eyebrow">
                <span className="impact__panel-num">{activeCat.num}</span>
                <span className="impact__panel-sep">/</span>
                <span className="impact__panel-cat">{activeCat.labelShort}</span>
              </div>

              <p className="impact__panel-subtitle">{activeCat.subtitle.toUpperCase()}</p>

              <ul className="impact__panel-list">
                {activeCat.points.map((pt) => (
                  <li key={pt} className="impact__panel-item">
                    <span className="impact__panel-dash" aria-hidden="true">—</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              {/* Dot nav */}
              <nav className="impact__dots" aria-label="Select impact category">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    className={`impact__dot${active === cat.id ? ' is-active' : ''}`}
                    onClick={() => setActive(cat.id)}
                    aria-label={`Select ${cat.labelShort}`}
                    aria-pressed={active === cat.id}
                  />
                ))}
              </nav>
            </div>
          </aside>
        </div>

        {/* ── Value strip ──────────────────────────────────────── */}
        <div className="impact__values">
          <div className="impact__values-rule" aria-hidden="true" />
          <span className="impact__value">COST-EFFICIENT</span>
          <span className="impact__value-dot" aria-hidden="true">·</span>
          <span className="impact__value">DATA-DRIVEN</span>
          <span className="impact__value-dot" aria-hidden="true">·</span>
          <span className="impact__value">SCALABLE</span>
          <div className="impact__values-rule" aria-hidden="true" />
        </div>

        {/* ── Final CTA ─────────────────────────────────────────── */}
        <div className="impact__cta-wrap">
          <a href="#demo" className="impact__cta-btn">
            <span>Explore Sat Vision</span>
            <svg
              className="impact__cta-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
};

export default ImpactSection;
