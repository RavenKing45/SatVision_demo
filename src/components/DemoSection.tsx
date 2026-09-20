import { useEffect, useRef, useState } from 'react';
import ImageComparison from './ImageComparison';
import sentinel2_10m from '../assets/demo/sentinel2_10m.png';
import superres_2_5m from '../assets/demo/superres_2_5m.png';
import './DemoSection.css';

const LOW_RES_IMAGE = sentinel2_10m;
const HIGH_RES_IMAGE = superres_2_5m;

const DemoSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="demo"
      className="demo"
      aria-label="Product Demo"
    >
      <div className="demo__edge" aria-hidden="true" />
      <div className="demo__contour" aria-hidden="true" />
      <div className="demo__grid-lines" aria-hidden="true" />

      <div className={`demo__inner ${isVisible ? 'is-visible' : ''}`}>
        <div className="demo__eyebrow">
          <span className="demo__eyebrow-line" />
          <span className="demo__eyebrow-text">
            CHAPTER 02 &nbsp;/&nbsp; DEMO
          </span>
        </div>

        <header className="demo__head">
          <div className="demo__title-wrap">
            <h2 className="demo__title">
              <span className="demo__title-main">SEE THE DIFFERENCE.</span>
            </h2>
            <p className="demo__subtitle">
              <span className="demo__subtitle-from">FROM 10 m IMAGERY</span>
              <span className="demo__subtitle-rule" aria-hidden="true" />
              <span className="demo__subtitle-to">
                TO FINER SPATIAL DETAIL.
              </span>
            </p>
          </div>
          <p className="demo__lede">
            Explore the difference between medium-resolution satellite imagery and a higher-resolution reconstruction.
          </p>
        </header>

        <div className="demo__compare">
          <ImageComparison
            lowResImage={LOW_RES_IMAGE}
            highResImage={HIGH_RES_IMAGE}
            initialPosition={0.5}
            lowResLabel={{
              primary: '10 m',
              secondary: 'SENTINEL-2 INPUT',
            }}
            highResLabel={{
              primary: '<4 m',
              secondary: 'SUPER-RESOLVED',
            }}
            ariaLabel="Compare 10 meter Sentinel-2 input and sub-4 meter super-resolved satellite imagery. Drag the divider, or use arrow keys, to adjust the comparison."
          />

          <p className="demo__provenance">
            Reference super-resolution output — Sat Vision model output will replace this during integration.
          </p>
        </div>

        <footer className="demo__meta">
          <div className="demo__meta-row">
            <div className="demo__meta-col">
              <div className="demo__meta-label">INPUT</div>
              <div className="demo__meta-value">10 m multispectral</div>
            </div>
            <div className="demo__meta-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
            <div className="demo__meta-col demo__meta-col--target">
              <div className="demo__meta-label">TARGET</div>
              <div className="demo__meta-value">&lt;4 m spatial detail</div>
            </div>
          </div>
        </footer>

        <div className="demo__nav-cta">
          <a href="#technology" className="demo__nav-btn">
            <span className="demo__nav-label">Explore the Technology</span>
            <svg
              className="demo__nav-icon"
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

export default DemoSection;
