import { useEffect, useRef, useState } from 'react';
import './IntroSection.css';

const IntroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="intro"
      className="intro"
      aria-label="Introduction"
    >
      <div className="intro__edge" aria-hidden="true" />
      <div className="intro__contour" aria-hidden="true" />
      <div className="intro__grid-lines" aria-hidden="true" />

      <div className="intro__inner">
        <div className="intro__eyebrow">
          <span className="intro__eyebrow-line" />
          <span className="intro__eyebrow-text">
            CHAPTER 01 &nbsp;/&nbsp; VISION
          </span>
        </div>

        <div className="intro__grid">
          <div className="intro__headline">
            <h2 className={`intro__title ${isVisible ? 'is-visible' : ''}`}>
              <span className="intro__title-line">
                <span className="intro__title-inner">SATELLITE</span>
              </span>
              <span className="intro__title-line">
                <span className="intro__title-inner">IMAGERY,</span>
              </span>
              <span className="intro__title-line intro__title-line--accent">
                <span className="intro__title-inner">REIMAGINED.</span>
              </span>
            </h2>
          </div>

          <div className={`intro__body ${isVisible ? 'is-visible' : ''}`}>
            <p className="intro__lede">
              Medium-resolution satellite imagery is widely available, but useful spatial detail remains constrained by sensor resolution. Sat Vision uses deep learning to reconstruct finer spatial detail while preserving the information that makes satellite imagery useful.
            </p>
            <p className="intro__sub">
              Built for urban planning, agricultural monitoring, disaster response, and precision Earth observation.
            </p>

            <div className="intro__divider" aria-hidden="true" />

            <div className="intro__res-band">
              <div className="intro__res-col">
                <div className="intro__res-primary">10 m INPUT</div>
                <div className="intro__res-secondary">MULTISPECTRAL</div>
              </div>
              <div className="intro__res-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </div>
              <div className="intro__res-col intro__res-col--target">
                <div className="intro__res-primary">&lt;4 m TARGET</div>
                <div className="intro__res-secondary">SUPER-RESOLVED</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="intro__cta-row">
        <a href="#demo" className="intro__cta-btn">
          <span className="intro__cta-label">Explore the Demo</span>
          <svg
            className="intro__cta-icon"
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
    </section>
  );
};

export default IntroSection;
