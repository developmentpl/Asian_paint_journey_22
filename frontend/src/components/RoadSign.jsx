/**
 * RoadSign — a warning-triangle roadside sign (slippery-road or general
 * caution). Used in an evenly-spaced looping track by RoadEnvironment.
 */
export default function RoadSign({ kind = "slippery" }) {
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
