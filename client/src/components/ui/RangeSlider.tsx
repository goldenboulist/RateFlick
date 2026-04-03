import { useCallback, useEffect, useRef, useState } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

export function RangeSlider({
  min,
  max,
  step = 0.1,
  value,
  onChange,
  className = "",
}: RangeSliderProps) {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const minValRef = useRef(value[0]);
  const maxValRef = useRef(value[1]);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  useEffect(() => {
    setMinVal(value[0]);
    setMaxVal(value[1]);
    minValRef.current = value[0];
    maxValRef.current = value[1];
  }, [value]);

  return (
    <div className={`relative flex items-center h-6 w-48 ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - step);
          setMinVal(value);
          minValRef.current = value;
          onChange([value, maxVal]);
        }}
        className="thumb thumb--left"
        style={{ zIndex: minVal > max - 100 ? "5" : undefined }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + step);
          setMaxVal(value);
          maxValRef.current = value;
          onChange([minVal, value]);
        }}
        className="thumb thumb--right"
      />

      <div className="slider">
        <div className="slider__track" />
        <div ref={range} className="slider__range" />
      </div>

      <style>{`
        .slider {
          position: relative;
          width: 100%;
        }

        .slider__track,
        .slider__range {
          border-radius: 3px;
          height: 4px;
          position: absolute;
        }

        .slider__track {
          background-color: var(--border);
          width: 100%;
          z-index: 1;
        }

        .slider__range {
          background-color: var(--accent);
          z-index: 2;
        }

        /* Removing the default appearance */
        .thumb,
        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          -webkit-tap-highlight-color: transparent;
        }

        .thumb {
          pointer-events: none;
          position: absolute;
          height: 0;
          width: 100%;
          outline: none;
          background: none;
        }

        .thumb--left {
          z-index: 3;
        }

        .thumb--right {
          z-index: 4;
        }

        /* For Chrome browsers */
        .thumb::-webkit-slider-thumb {
          background-color: var(--accent);
          border: 2px solid var(--on-accent);
          border-radius: 50%;
          box-shadow: 0 0 1px 1px var(--ring);
          cursor: pointer;
          height: 16px;
          width: 16px;
          margin-top: 4px;
          pointer-events: all;
          position: relative;
        }

        /* For Firefox browsers */
        .thumb::-moz-range-thumb {
          background-color: var(--accent);
          border: 2px solid var(--on-accent);
          border-radius: 50%;
          box-shadow: 0 0 1px 1px var(--ring);
          cursor: pointer;
          height: 16px;
          width: 16px;
          pointer-events: all;
          position: relative;
        }
      `}</style>
    </div>
  );
}
