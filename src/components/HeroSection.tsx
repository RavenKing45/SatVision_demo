import { useEffect, useRef } from 'react';
import satelliteHero from '../assets/satellite-hero.png';
import './HeroSection.css';

export const HERO_IMAGE = satelliteHero;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      raf = 0;
      const hero = heroRef.current;
      const bg = bgRef.current;
      const content = contentRef.current;
      if (!hero || !bg || !content) return;

      const vh = window.innerHeight;
      const rect = hero.getBoundingClientRect();
      const total = Math.max(rect.height, vh);
      const progressed = clamp01((-rect.top) / (total * 0.9));

      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

      const scaleStart = isMobile ? 1.05 : 1.08;
      const scaleEnd = isMobile ? 1.10 : 1.15;
      const scale = scaleStart + (scaleEnd - scaleStart) * progressed;

      const maxYBg = isMobile ? -40 : -90;
      const maxXBg = isMobile ? 4 : 16;
      const yBg = progressed * maxYBg;
      const xBg = progressed * maxXBg;

      bg.style.transform = `translate3d(${xBg}px, ${yBg}px, 0) scale(${scale.toFixed(4)})`;

      const maxYContent = isMobile ? 80 : 150;
      const yContent = progressed * maxYContent;
      const fade = clamp01(1 - (progressed - 0.25) / 0.65);

      content.style.transform = `translate3d(0, ${yContent}px, 0)`;
      content.style.opacity = String(fade);
    };

    const listener = () => {
      if (!raf) raf = window.requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener('scroll', listener, { passive: true });
    window.addEventListener('resize', listener, { passive: true });
    return () => {
      window.removeEventListener('scroll', listener);
      window.removeEventListener('resize', listener);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={heroRef} className="hero" id="hero" aria-label="Hero">
      <div className="hero__bg-wrap">
        <div ref={bgRef} className="hero__bg">
          <img
            src={HERO_IMAGE}
            alt="Satellite view of terrain"
            className="hero__bg-img"
            draggable={false}
          />
        </div>
        <div className="hero__overlay" />
        <div className="hero__vignette" />
        <div className="hero__grain" aria-hidden="true" />
      </div>

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
      </div>

      <div className="hero__bottom-bar" aria-hidden="true">
        <div className="hero__scroll-cue hero__scroll-cue--right">
          <span className="hero__scroll-label">Scroll</span>
          <span className="hero__scroll-line" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
