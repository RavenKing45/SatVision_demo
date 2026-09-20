import { useEffect, useMemo, useState } from 'react';
import './LoadingReveal.css';

interface LoadingRevealProps {
  onComplete?: () => void;
}

const LoadingReveal: React.FC<LoadingRevealProps> = ({ onComplete }) => {
  const [isDone, setIsDone] = useState(false);

  const { cols, rows, tiles } = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const cols = isMobile ? 6 : 12;
    const rows = isMobile ? 10 : 8;
    const tileArray: { col: number; row: number; delay: number }[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const diag = (rows - 1 - row) + col;
        const delay = diag * (isMobile ? 28 : 22);
        tileArray.push({ col, row, delay });
      }
    }

    return { cols, rows, tiles: tileArray };
  }, []);

  useEffect(() => {
    const maxDiag = (rows - 1) + (cols - 1);
    const stagger = typeof window !== 'undefined' && window.innerWidth <= 768 ? 28 : 22;
    const totalMs = maxDiag * stagger + 650 + 100;

    const timer = window.setTimeout(() => {
      setIsDone(true);
      onComplete?.();
    }, totalMs);

    return () => window.clearTimeout(timer);
  }, [cols, rows, onComplete]);

  if (isDone) return null;

  return (
    <div
      className="reveal-overlay"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
      aria-hidden="true"
    >
      {tiles.map(({ col, row, delay }) => (
        <span
          key={`${col}-${row}`}
          className="reveal-tile"
          style={{
            ['--reveal-delay' as string]: `${delay}ms`,
          }}
        />
      ))}
    </div>
  );
};

export default LoadingReveal;
