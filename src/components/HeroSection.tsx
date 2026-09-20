import { useEffect, useRef } from 'react';
import './HeroSection.css';

export const HERO_IMAGE =
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=high%20resolution%20satellite%20aerial%20view%20of%20agricultural%20crop%20fields%20with%20geometric%20patterns%20dry%20desert%20terrain%20patchwork%20farmland%20geometric%20land%20parcels%20earth%20observation%20from%20orbit%20photorealistic%20no%20clouds&image_size=landscape_16_9';

const HeroSection: React.FC = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;

    const onScroll = () => {
      const y = window.scrollY;
      if (bgRef.current) {
        const parallax = Math.min(y * 0.18, 200);
        bgRef.current.style.transform = `translate3d(0, ${parallax}px, 0) scale(1.08)`;
      }
      if (contentRef.current) {
        const shift = Math.min(y * 0.35, 300);
        const fade = Math.max(1 - y / 600, 0);
        contentRef.current.style.transform = `translate3d(0, ${shift * 0.3}px, 0)`;
        contentRef.current.style.opacity = String(fade);
      }
    };

    const tick = () => {
      onScroll();
      raf = 0;
    };

    const listener = () => {
      if (!raf) raf = window.requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', listener, { passive: true });
    return () => {
      window.removeEventListener('scroll', listener);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hero" id="hero" aria-label="Hero">
      <div className="hero__bg-wrap">
        <div ref={bgRef} className="hero__bg">
          <img
            src={HERO_IMAGE}
            alt="Satellite view of agricultural terrain"
            className="hero__bg-img"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src =
                'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2400&q=80';
            }}
          />
        </div>
        <div className="hero__overlay" />
        <div className="hero__vignette" />
        <div className="hero__grain" aria-hidden="true" />
      </div>

      <div className="hero__scanline" aria-hidden="true" />

      <div className="hero__content" ref={contentRef}>
        <div className="hero__content-inner">
          <div className="hero__meta-row">
            <span className="hero__meta-tag">
              <span className="hero__meta-dot" />
              SMART INDIA HACKATHON 2026
            </span>
            <span className="hero__meta-tag hero__meta-tag--muted">
              GEO-SPATIAL &nbsp;·&nbsp; AI &nbsp;·&nbsp; EARTH OBSERVATION
            </span>
          </div>

          <h1 className="hero__title">
            <span className="hero__title-line">
              <span className="hero__title-word">
                <span className="hero__title-inner">SEE MORE.</span>
              </span>
            </span>
            <span className="hero__title-line hero__title-line--shifted">
              <span className="hero__title-word">
                <span className="hero__title-inner">FROM EVERY</span>
                <span className="hero__title-inner hero__title-inner--accent">
                  &nbsp;PIXEL.
                </span>
              </span>
            </span>
          </h1>

          <p className="hero__subtitle">
            AI-powered satellite image enhancement
            <br className="hero__sub-break" />
            for sharper, more detailed Earth observation.
          </p>

          <div className="hero__actions">
            <a href="#intro" className="hero__btn hero__btn--primary">
              <span className="hero__btn-label">Begin Exploration</span>
              <svg
                className="hero__btn-icon"
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
            <a href="#technology" className="hero__btn hero__btn--ghost">
              <span className="hero__btn-play">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="hero__btn-label">Watch Demo</span>
            </a>
          </div>
        </div>

        <aside className="hero__side-meta" aria-hidden="true">
          <div className="hero__coord">
            <span className="hero__coord-label">LAT</span>
            <span className="hero__coord-value">28.6139° N</span>
          </div>
          <div className="hero__coord">
            <span className="hero__coord-label">LON</span>
            <span className="hero__coord-value">77.2090° E</span>
          </div>
          <div className="hero__coord-divider" />
          <div className="hero__coord">
            <span className="hero__coord-label">ZOOM</span>
            <span className="hero__coord-value">12.4x</span>
          </div>
          <div className="hero__coord">
            <span className="hero__coord-label">RES</span>
            <span className="hero__coord-value">
              0.31<span className="hero__coord-unit">m/px</span>
            </span>
          </div>
        </aside>
      </div>

      <div className="hero__bottom-bar" aria-hidden="true">
        <div className="hero__bottom-left">
          <div className="hero__progress">
            <div className="hero__progress-fill" />
          </div>
          <span className="hero__progress-label">ORBIT&nbsp;·&nbsp;PASS 047 / 365</span>
        </div>
        <div className="hero__scroll-cue">
          <span className="hero__scroll-label">Scroll</span>
          <span className="hero__scroll-line" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
