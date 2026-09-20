import { useEffect, useState } from 'react';
import './LoadingReveal.css';

interface LoadingRevealProps {
  onComplete?: () => void;
}

interface Tile {
  col: number;
  row: number;
  delay: number;
}

const FALLBACK_COLS = 12;
const FALLBACK_ROWS = 8;
const FALLBACK_STAGGER = 75;
const FALLBACK_DURATION = 600;
const COMPLETION_BUFFER = 150;

const LoadingReveal: React.FC<LoadingRevealProps> = ({ onComplete }) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [cols, setCols] = useState(FALLBACK_COLS);
  const [rows, setRows] = useState(FALLBACK_ROWS);
  const [stagger, setStagger] = useState(FALLBACK_STAGGER);
  const [duration, setDuration] = useState(FALLBACK_DURATION);
  const [isDone, setIsDone] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mql.matches) {
      setReducedMotion(true);
      setIsDone(true);
      onComplete?.();
      return;
    }

    const root = document.documentElement;
    const cs = window.getComputedStyle(root);

    const parseNum = (varName: string, fallback: number): number => {
      const raw = cs.getPropertyValue(varName).trim();
      if (!raw) return fallback;
      const cleaned = raw.endsWith('ms') ? raw.slice(0, -2) : raw;
      const parsed = parseInt(cleaned, 10);
      return isNaN(parsed) ? fallback : parsed;
    };

    const resolvedCols = parseNum('--reveal-cols', FALLBACK_COLS);
    const resolvedRows = parseNum('--reveal-rows', FALLBACK_ROWS);
    const resolvedStagger = parseNum('--reveal-stagger', FALLBACK_STAGGER);
    const resolvedDuration = parseNum('--reveal-duration', FALLBACK_DURATION);

    setCols(resolvedCols);
    setRows(resolvedRows);
    setStagger(resolvedStagger);
    setDuration(resolvedDuration);

    const tileArray: Tile[] = [];
    for (let row = 0; row < resolvedRows; row++) {
      for (let col = 0; col < resolvedCols; col++) {
        const diagonal = (resolvedRows - 1 - row) + col;
        const delay = diagonal * resolvedStagger;
        tileArray.push({ col, row, delay });
      }
    }
    setTiles(tileArray);
  }, [onComplete]);

  useEffect(() => {
    if (reducedMotion || isDone) return;
    if (tiles.length === 0) return;

    const maxDiagonal = (rows - 1) + (cols - 1);
    const totalMs = maxDiagonal * stagger + duration + COMPLETION_BUFFER;

    const timer = window.setTimeout(() => {
      setIsDone(true);
      onComplete?.();
    }, totalMs);

    return () => window.clearTimeout(timer);
  }, [cols, rows, stagger, duration, onComplete, tiles.length, reducedMotion, isDone]);

  if (isDone) return null;

  return (
    <div
      className="reveal-overlay"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        ['--reveal-duration' as string]: `${duration}ms`,
      }}
      aria-hidden="true"
    >
      {tiles.map(({ col, row, delay }) => (
        <div key={`${row}-${col}`} className="reveal-cell">
          <div
            className="reveal-mask"
            style={{
              ['--reveal-delay' as string]: `${delay}ms`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default LoadingReveal;
