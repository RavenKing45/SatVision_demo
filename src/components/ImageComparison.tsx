import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import './ImageComparison.css';

export interface ImageComparisonProps {
  lowResImage: string;
  highResImage: string;
  lowResLabel?: { primary: string; secondary: string };
  highResLabel?: { primary: string; secondary: string };
  initialPosition?: number;
  ariaLabel?: string;
  className?: string;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const DEFAULT_LOW = {
  primary: '10 m',
  secondary: 'MEDIUM RESOLUTION',
};

const DEFAULT_HIGH = {
  primary: '<4 m',
  secondary: 'SUPER-RESOLVED',
};

const STEP_PCT = 0.02;

const ImageComparison: React.FC<ImageComparisonProps> = ({
  lowResImage,
  highResImage,
  lowResLabel = DEFAULT_LOW,
  highResLabel = DEFAULT_HIGH,
  initialPosition = 0.5,
  ariaLabel = 'Compare satellite imagery between resolutions by dragging the divider or using the arrow keys.',
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const positionRef = useRef<number>(clamp01(initialPosition));
  const draggingRef = useRef<boolean>(false);
  const rafRef = useRef<number>(0);
  const pendingRef = useRef<number | null>(null);

  const [isFocused, setIsFocused] = useState(false);

  const applyPosition = useCallback((pct: number) => {
    const v = clamp01(pct);
    positionRef.current = v;
    const overlay = overlayRef.current;
    const divider = dividerRef.current;
    const valuePct = `${(v * 100).toFixed(4)}%`;
    if (overlay) overlay.style.clipPath = `inset(0 ${100 - v * 100}% 0 0)`;
    if (divider) divider.style.transform = `translate3d(calc(${valuePct} - 50%), 0, 0)`;
    const input = inputRef.current;
    if (input && document.activeElement !== input) {
      input.value = String(Math.round(v * 1000));
    }
  }, []);

  const flush = useCallback(() => {
    rafRef.current = 0;
    if (pendingRef.current != null) {
      const v = pendingRef.current;
      pendingRef.current = null;
      applyPosition(v);
    }
  }, [applyPosition]);

  const schedulePosition = useCallback(
    (pct: number) => {
      pendingRef.current = clamp01(pct);
      if (!rafRef.current) {
        rafRef.current = window.requestAnimationFrame(flush);
      }
    },
    [flush],
  );

  const updateFromPointer = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const w = rect.width || 1;
      const pct = (clientX - rect.left) / w;
      schedulePosition(pct);
    },
    [schedulePosition],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest('[data-ic-input]')) return;
      draggingRef.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      updateFromPointer(e.clientX);
      try {
        if (inputRef.current) inputRef.current.focus({ preventScroll: true });
      } catch {
        /* noop */
      }
      e.preventDefault();
    },
    [updateFromPointer],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      updateFromPointer(e.clientX);
    },
    [updateFromPointer],
  );

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const cur = positionRef.current;
      let next: number | null = null;
      switch (e.key) {
        case 'ArrowLeft':
          next = cur - STEP_PCT;
          break;
        case 'ArrowRight':
          next = cur + STEP_PCT;
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = 1;
          break;
      }
      if (next != null) {
        e.preventDefault();
        schedulePosition(next);
      }
    },
    [schedulePosition],
  );

  const onInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number(e.currentTarget.value) / 1000;
      schedulePosition(v);
    },
    [schedulePosition],
  );

  useLayoutEffect(() => {
    applyPosition(initialPosition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onResize = () => applyPosition(positionRef.current);
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [applyPosition]);

  const wrapperClass = [
    'ic',
    className ?? '',
    isFocused ? 'is-focused' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={containerRef}
      className={wrapperClass}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      aria-hidden={false}
    >
      <div className="ic__frame" aria-hidden="true">
        <img
          className="ic__img ic__img--base"
          src={lowResImage}
          alt="Medium-resolution satellite view"
          draggable={false}
        />
        <div
          ref={overlayRef}
          className="ic__overlay"
          style={{ clipPath: 'inset(0 50% 0 0)' }}
        >
          <img
            className="ic__img ic__img--overlay"
            src={highResImage}
            alt="Super-resolved satellite view"
            draggable={false}
          />
        </div>

        <div className="ic__corner ic__corner--br">
          <div className="ic__corner-primary">{lowResLabel.primary}</div>
          <div className="ic__corner-secondary">{lowResLabel.secondary}</div>
        </div>

        <div className="ic__corner ic__corner--bl">
          <div className="ic__corner-primary ic__corner-primary--accent">
            {highResLabel.primary}
          </div>
          <div className="ic__corner-secondary">
            {highResLabel.secondary}
          </div>
        </div>

        <div ref={dividerRef} className="ic__divider" aria-hidden="true">
          <div className="ic__divider-line" />
          <div className="ic__handle" role="presentation">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9 6L4 12l5 6"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 6L20 12l-5 6"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <label className="ic__sr-only" htmlFor="ic-range">
        {ariaLabel}
      </label>
      <input
        id="ic-range"
        data-ic-input
        ref={inputRef}
        className="ic__input"
        type="range"
        min={0}
        max={1000}
        defaultValue={Math.round(clamp01(initialPosition) * 1000)}
        step={1}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamp01(initialPosition) * 100)}
        onKeyDown={onKeyDown}
        onChange={onInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};

export default ImageComparison;
