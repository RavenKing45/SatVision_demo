import { useEffect, useState } from 'react';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Technology', href: '#technology' },
  { label: 'Results', href: '#results' },
  { label: 'Team', href: '#team' },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setRevealed(true), 900);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <a href="/" className="navbar__brand" style={{ ['--nav-delay' as string]: '0ms' }}>
          <span className="navbar__brand-mark">SAT</span>
          <span className="navbar__brand-divider" />
          <span className="navbar__brand-name">VISION</span>
        </a>

        <nav className="navbar__links" aria-label="Primary">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="navbar__link"
              style={{ ['--nav-delay' as string]: `${(i + 1) * 40}ms` }}
            >
              <span className="navbar__link-label">{link.label}</span>
            </a>
          ))}
        </nav>

        <a
          href="#intro"
          className="navbar__cta"
          style={{ ['--nav-delay' as string]: '200ms' }}
        >
          <span className="navbar__cta-label">Explore</span>
          <svg
            className="navbar__cta-arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <div
        className={`navbar__reveal ${revealed ? 'is-visible' : ''}`}
        aria-hidden="true"
      />
    </header>
  );
};

export default Navbar;
