/**
 * WaterPuddle — a reflective, shimmering SVG puddle / waterlogged patch.
 * `size="large"` is used for the full waterlogging scenario; the default
 * smaller size dresses wet-road scenarios generally.
 */
export default function WaterPuddle({ size = "small" }) {
  const isLarge = size === "large";
  const rx = isLarge ? 90 : 46;
  const ry = isLarge ? 13 : 12;

  return (
    <div className={`water-puddle-wrapper puddle-size-${size}`}>
      <svg viewBox={`0 0 ${rx * 2 + 8} ${ry * 2 + 8}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Water puddle">
        <ellipse cx={rx + 4} cy={ry + 4} rx={rx} ry={ry} fill="url(#puddleGrad)" />
        <ellipse cx={rx + 4} cy={ry + 4} rx={rx} ry={ry} fill="none" stroke="rgba(178,226,255,0.35)" strokeWidth="1.5" />
        <defs>
          <linearGradient id="puddleGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(111,240,247,0.45)" />
            <stop offset="100%" stopColor="rgba(20,40,70,0.55)" />
          </linearGradient>
        </defs>
        <ellipse className="puddle-shimmer" cx={rx * 0.6 + 4} cy={ry * 0.7 + 4} rx={rx * 0.25} ry={ry * 0.18} fill="rgba(255,255,255,0.55)" />
      </svg>
    </div>
  );
}
