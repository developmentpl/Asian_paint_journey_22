/**
 * Pothole — an SVG water-filled hole in the road surface, for the
 * pothole scenario. `avoided` nudges the rider's swerve path to visibly
 * steer around it (RoadEnvironment positions this relative to the lane).
 */
export default function Pothole() {
  return (
    <div className="pothole-wrapper">
      <svg viewBox="0 0 90 44" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pothole">
        <ellipse cx="45" cy="24" rx="42" ry="16" fill="#0a0e16" />
        <ellipse cx="45" cy="24" rx="42" ry="16" fill="none" stroke="#000" strokeWidth="3" opacity="0.6" />
        <ellipse cx="45" cy="22" rx="32" ry="11" fill="url(#potholeWater)" />
        <defs>
          <radialGradient id="potholeWater" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="rgba(178,226,255,0.55)" />
            <stop offset="100%" stopColor="rgba(30,60,90,0.5)" />
          </radialGradient>
        </defs>
        <ellipse className="pothole-shimmer" cx="38" cy="19" rx="10" ry="3" fill="rgba(255,255,255,0.5)" />
      </svg>
    </div>
  );
}
