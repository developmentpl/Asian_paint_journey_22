/**
 * RoadSign — a warning-triangle roadside sign (slippery-road or general
 * caution). Used in an evenly-spaced looping track by RoadEnvironment.
 */
export default function RoadSign({ kind = "slippery" }) {
  if (kind === "pre-ride") {
    return (
      <div className="road-sign-svg road-sign-pre-ride">
        <svg viewBox="0 0 90 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Safety first: check your gear">
          <rect x="41" y="42" width="8" height="56" fill="#8a94a6" />
          <rect x="2" y="2" width="86" height="58" rx="4" fill="var(--yellow)" stroke="#1b2130" strokeWidth="3" />
          <text x="45" y="19" textAnchor="middle" fill="#1b2130" fontSize="10" fontWeight="800">SAFETY FIRST</text>
          <path d="M12 25h66" stroke="#1b2130" />
          <text x="45" y="39" textAnchor="middle" fill="#1b2130" fontSize="12" fontWeight="900">CHECK</text>
          <text x="45" y="53" textAnchor="middle" fill="#1b2130" fontSize="12" fontWeight="900">YOUR GEAR</text>
        </svg>
      </div>
    );
  }

  return (
    <div className="road-sign-svg">
      <svg viewBox="0 0 50 90" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Road sign">
        <rect x="22" y="30" width="5" height="58" fill="#8a94a6" />
        <path
          d="M24.5 2 L46 38 L3 38 Z"
          fill="var(--yellow)"
          stroke="#1b2130"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {kind === "slippery" ? (
          <path d="M12 30 Q18 20 24 30 T36 30" stroke="#1b2130" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        ) : (
          <circle cx="24.5" cy="22" r="4" fill="#1b2130" />
        )}
      </svg>
    </div>
  );
}
