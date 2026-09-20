import { useEffect, useRef, useState } from 'react';
import './TechnologySection.css';

/* ─── Stage data ─────────────────────────────────────────────── */
const STAGES = [
  {
    id: '01',
    slug: 'input',
    label: 'INPUT',
    title: 'SENTINEL-2',
    meta: ['10 m', 'MULTISPECTRAL', 'GEOTIFF / GEOREFERENCED'],
    body: 'RGB + NIR satellite imagery.',
  },
  {
    id: '02',
    slug: 'prepare',
    label: 'PREPARE',
    title: 'TILE + NORMALIZE',
    meta: ['MASK', 'NORMALIZE', 'TILE'],
    body: 'Cloud / invalid pixels → Reflectance → Co-registered patches.',
  },
  {
    id: '03',
    slug: 'reconstruct',
    label: 'RECONSTRUCT',
    title: 'MODEL PATHS',
    meta: ['PRIMARY PATH', 'PARALLEL EVAL', 'ROUTING'],
    body: 'Final routing will be determined through quantitative, visual and reliability evaluation.',
  },
  {
    id: '04',
    slug: 'verify',
    label: 'VERIFY',
    title: 'QUALITY + CONFIDENCE',
    meta: ['SPECTRAL', 'SPATIAL', 'RELIABILITY'],
    body: 'Compare reconstruction quality before downstream use.',
  },
  {
    id: '05',
    slug: 'output',
    label: 'OUTPUT',
    title: 'HIGH-RES GEOTIFF',
    meta: ['GEOREFERENCED', 'SPECTRAL FIDELITY', 'SHARPER DETAIL'],
    body: 'Validated high-resolution product ready for Earth-observation applications.',
  },
] as const;

/* ─── Stage 01 motif — stacked spectral bands ─────────────────── */
const BandStack: React.FC = () => (
  <div className="tech-stage__motif tech-stage__motif--bands" aria-hidden="true">
    {(['R', 'G', 'B', 'NIR'] as const).map((b, i) => (
      <div key={b} className="band-layer" style={{ '--band-i': i } as React.CSSProperties}>
        <span className="band-label">{b}</span>
        <div className="band-fill" />
      </div>
    ))}
  </div>
);

/* ─── Stage 02 motif — prep sequence ─────────────────────────── */
const PrepSequence: React.FC = () => (
  <div className="tech-stage__motif tech-stage__motif--prep" aria-hidden="true">
    {['MASK', 'NORMALIZE', 'TILE', 'CO-REGISTER'].map((step, i, arr) => (
      <div key={step} className="prep-step">
        <span className="prep-step__label">{step}</span>
        {i < arr.length - 1 && <span className="prep-step__arrow">→</span>}
      </div>
    ))}
  </div>
);

/* ─── Stage 03 motif — branching model paths ─────────────────── */
const ModelBranch: React.FC = () => (
  <div className="tech-stage__motif tech-stage__motif--branch" aria-hidden="true">
    <div className="branch-row branch-row--entry">
      <span className="branch-node branch-node--entry">TILED INPUT</span>
    </div>
    <div className="branch-fork-wrap">
      <div className="branch-fork-line branch-fork-line--v" />
      <div className="branch-paths">
        <div className="branch-path branch-path--primary">
          <div className="branch-fork-line branch-fork-line--h" />
          <div className="branch-path__inner">
            <div className="branch-path__tag">PRIMARY DEVELOPMENT PATH</div>
            <div className="branch-path__chain">
              <span className="branch-node branch-node--model">SEN2SR</span>
              <span className="branch-connector">→</span>
              <span className="branch-node branch-node--model">ESRGAN REFINEMENT</span>
            </div>
          </div>
        </div>
        <div className="branch-path branch-path--alt">
          <div className="branch-fork-line branch-fork-line--h" />
          <div className="branch-path__inner">
            <div className="branch-path__tag branch-path__tag--muted">PARALLEL EVALUATION</div>
            <div className="branch-path__chain">
              <span className="branch-node branch-node--model branch-node--muted">MODIFIED ESRGAN VARIANTS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─── Stage 04 motif — validation dimensions ─────────────────── */
const ValidateGrid: React.FC = () => (
  <div className="tech-stage__motif tech-stage__motif--validate" aria-hidden="true">
    <div className="validate-dim">
      <div className="validate-dim__head">SPECTRAL</div>
      <div className="validate-dim__metric">SAM</div>
      <div className="validate-dim__sub">Consistency</div>
    </div>
    <div className="validate-sep" />
    <div className="validate-dim">
      <div className="validate-dim__head">SPATIAL</div>
      <div className="validate-dim__metric">PSNR · SSIM</div>
      <div className="validate-dim__sub">ERGAS</div>
    </div>
    <div className="validate-sep" />
    <div className="validate-dim">
      <div className="validate-dim__head">RELIABILITY</div>
      <div className="validate-dim__metric">TTA</div>
      <div className="validate-dim__sub">Uncertainty</div>
    </div>
  </div>
);

/* ─── Stage 05 motif — target + applications ─────────────────── */
const OutputApps: React.FC = () => (
  <div className="tech-stage__motif tech-stage__motif--output" aria-hidden="true">
    <div className="output-target">
      <span className="output-target__value">&lt;4 m</span>
      <span className="output-target__label">TARGET</span>
    </div>
    <div className="output-apps">
      {['AGRICULTURE', 'URBAN MAPPING', 'DISASTER ASSESSMENT', 'EARTH OBSERVATION'].map(app => (
        <span key={app} className="output-app">{app}</span>
      ))}
    </div>
  </div>
);

const MOTIFS = [BandStack, PrepSequence, ModelBranch, ValidateGrid, OutputApps] as const;

/* ─── Main component ─────────────────────────────────────────── */
const TechnologySection: React.FC = () => {
  const headerRef  = useRef<HTMLDivElement>(null);
  const stageRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [activeIdx, setActiveIdx]         = useState<number>(-1);

  /* Header entrance */
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Stage scroll activation */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stageRefs.current.forEach((el, idx) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIdx(idx);
        },
        { threshold: 0.3, rootMargin: '0px 0px -15% 0px' }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach(io => io.disconnect());
  }, []);

  return (
    <section
      id="technology"
      className="tech"
      aria-label="Technology"
    >
      <div className="tech__edge"       aria-hidden="true" />
      <div className="tech__contour"    aria-hidden="true" />
      <div className="tech__grid-lines" aria-hidden="true" />

      <div className="tech__inner">

        {/* ── Header ─────────────────────────────────────────── */}
        <div ref={headerRef} className={`tech__header ${headerVisible ? 'is-visible' : ''}`}>
          <div className="tech__eyebrow">
            <span className="tech__eyebrow-line" />
            <span className="tech__eyebrow-text">CHAPTER 03&nbsp;/&nbsp;TECHNOLOGY</span>
          </div>

          <h2 className="tech__title">
            <span className="tech__title-line">HOW SAT VISION</span>
            <span className="tech__title-line tech__title-line--accent">RECONSTRUCTS DETAIL.</span>
          </h2>

          <p className="tech__intro">
            From multispectral satellite input to a validated high-resolution product.
          </p>
        </div>

        {/* ── Pipeline ────────────────────────────────────────── */}
        <div className="tech__pipeline">
          {STAGES.map((stage, idx) => {
            const Motif          = MOTIFS[idx];
            const isActive       = activeIdx === idx;
            const isPast         = activeIdx > idx;
            const isReconstruct  = stage.slug === 'reconstruct';

            return (
              <div key={stage.id} className="tech__pipeline-row">

                {/* Connector between stages */}
                {idx > 0 && (
                  <div
                    className={`tech__connector ${isPast || isActive ? 'is-lit' : ''}`}
                    aria-hidden="true"
                  >
                    <div className="tech__connector-line" />
                    <div className="tech__connector-node" />
                  </div>
                )}

                {/* Stage */}
                <div
                  ref={el => { stageRefs.current[idx] = el; }}
                  className={[
                    'tech-stage',
                    `tech-stage--${stage.slug}`,
                    isActive       ? 'is-active' : '',
                    isPast         ? 'is-past'   : '',
                    isReconstruct  ? 'tech-stage--hero' : '',
                  ].filter(Boolean).join(' ')}
                >
                  {/* Header row */}
                  <div className="tech-stage__top">
                    <div className="tech-stage__id-wrap">
                      <span className="tech-stage__num">{stage.id}</span>
                      <span className="tech-stage__label">/ {stage.label}</span>
                    </div>
                    <div className="tech-stage__meta">
                      {stage.meta.map(m => (
                        <span key={m} className="tech-stage__meta-item">{m}</span>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="tech-stage__title">{stage.title}</h3>

                  {/* Visual motif */}
                  <Motif />

                  {/* Body */}
                  <p className="tech-stage__body">{stage.body}</p>

                  {/* Reconstruct extra note */}
                  {isReconstruct && (
                    <p className="tech-stage__note">
                      Current development — not a completed experiment result.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Principle statement ─────────────────────────────── */}
        <div className="tech__principle">
          <div className="tech__principle-rule" aria-hidden="true" />
          <p className="tech__principle-text">
            SHARPER DETAIL IS USEFUL ONLY WHEN<br />
            SPECTRAL FIDELITY, SPATIAL CONSISTENCY,<br />
            AND RELIABILITY ARE VALIDATED.
          </p>
          <div className="tech__principle-rule" aria-hidden="true" />
        </div>

        {/* ── Tech stack ──────────────────────────────────────── */}
        <div className="tech__stack">
          <span className="tech__stack-label">BUILT WITH</span>
          <div className="tech__stack-items">
            {['Python', 'PyTorch', 'Rasterio / GDAL', 'NumPy', 'OpenCV', 'CUDA / NVIDIA GPU', 'QGIS'].map(t => (
              <span key={t} className="tech__stack-item">{t}</span>
            ))}
          </div>
        </div>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <div className="tech__nav-cta">
          <a href="#impact" className="tech__nav-btn">
            <span>Explore the Impact</span>
            <svg
              className="tech__nav-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
};

export default TechnologySection;
