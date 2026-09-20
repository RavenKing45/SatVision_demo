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
              Medium-resolution satellite data is everywhere — but the detail
              it holds remains locked behind sensor limits. SAT VISION uses
              deep learning to reconstruct what the sensor cannot fully see,
              revealing terrain, structures, and patterns at a higher fidelity.
            </p>
            <p className="intro__sub">
              Built for urban planning, agricultural monitoring, disaster
              response, and precision Earth observation.
            </p>

            <div className="intro__markers">
              <div className="intro__marker">
                <span className="intro__marker-label">Capability</span>
                <span className="intro__marker-value">Super-Resolution</span>
              </div>
              <div className="intro__marker">
                <span className="intro__marker-label">Domain</span>
                <span className="intro__marker-value">Geospatial AI</span>
              </div>
              <div className="intro__marker">
                <span className="intro__marker-label">Initiative</span>
                <span className="intro__marker-value">SIH 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
