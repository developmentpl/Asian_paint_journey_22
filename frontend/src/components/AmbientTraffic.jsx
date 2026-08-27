/**
 * AmbientTraffic — small, softly-blurred background car silhouettes that
 * continuously loop in a distant lane. Purely decorative (never tied to
 * scenario logic/scoring) — this is what keeps the road feeling like a
 * live, moving environment between the scenario-specific TrafficVehicle
 * appearances.
 */
export default function AmbientCar({ variant = 0, depth = 0 }) {
  const bodyColor = variant === 0 ? "#5a6b8a" : "#7a5a5e";
  return (
    <div className={`ambient-car-svg ambient-car-depth-${depth}`} aria-hidden="true">
      <svg viewBox="0 0 70 34" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(70 0) scale(-1 1)">
        <ellipse cx="35" cy="30" rx="30" ry="3" fill="rgba(0,0,0,0.3)" />
        <path d="M6 24 L10 12 Q14 7 24 7 L50 7 Q58 7 62 14 L66 24 Z" fill={bodyColor} />
        <path d="M18 11 L26 18 L48 18 L54 11 Q48 9 36 9 Q24 9 18 11 Z" fill="rgba(140,200,230,0.55)" />
        <circle cx="18" cy="25" r="5" fill="#0c0f16" />
        <circle cx="54" cy="25" r="5" fill="#0c0f16" />
        <rect x="4" y="15" width="4" height="5" rx="1.5" fill="#ffd97a" opacity="0.85" />
        </g>
      </svg>
    </div>
  );
}
