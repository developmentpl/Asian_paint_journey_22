/**
 * StreetLight — a single roadside lamp post with a lit lamp head and a
 * localized ground-light pool. Used in an evenly-spaced, seamlessly
 * looping track by RoadEnvironment so lamps repeat continuously at equal
 * distance along the road, each visibly lighting its own patch of wet
 * asphalt as it scrolls past — never a scene-wide ambient glow.
 */
export default function StreetLight({ className = "" }) {
  return (
    <div className={`streetlight-svg ${className}`}>
      <span className="streetlight-pool" />
      <svg viewBox="0 0 30 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Streetlight">
        <rect x="13" y="10" width="4" height="100" fill="#3a4150" />
        <path d="M15 10 L15 2 L28 6" stroke="#3a4150" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="28" cy="7" r="7" fill="var(--yellow)" className="streetlight-glow" />
      </svg>
    </div>
  );
}
