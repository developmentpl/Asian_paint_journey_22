import RainEffect from "./RainEffect.jsx";

/** Scenario 9 only: bird's-eye view of a wet turning road and motorcycle. */
export default function TopDownTurnView({ activeAction, geared }) {
  const isSafeTurn = activeAction === "slowTurn";
  const isSkidTurn = activeAction === "skidTurn";
  // Exact visible sub-curve of the road centre Bézier, shifted 70 units
  // left (in the 1000-wide viewBox) of the actual centre line — riding
  // exactly on the centre line put the bike right on top of the yellow
  // dashes, so this rides it in the left lane instead. It's a plain
  // translation of the same curve (every coordinate shifted by the same
  // amount), so the shape/timing/easing of the ride is unchanged — only
  // its position. Must stay in sync with the offset-path value on
  // .topdown-bike-motion in index.css. The first point and tangent also
  // define the stationary start pose, preventing a jump.
  const bikePath = "M177.419 650.011 C186.801 473.606 227.93 382.818 375 345 C555 300 650 190 650 -60";

  const bikeArtwork = (
    <g className={isSafeTurn ? "topdown-bike-lean-safe" : isSkidTurn ? "topdown-bike-lean-skid" : ""}>
      <ellipse cx="43" cy="145" rx="19" ry="9" fill="rgba(0,0,0,.3)" />
      <rect x="35" y="7" width="16" height="38" rx="8" fill="#101820" stroke="#667887" strokeWidth="3" />
      <rect x="35" y="116" width="16" height="38" rx="8" fill="#101820" stroke="#667887" strokeWidth="3" />
      <path d="M43 35 25 71l18 55 18-55Z" fill="#248fc2" stroke="#082d49" strokeWidth="4" />
      <path d="M19 59h48M16 65l10-12m44 12L60 53" fill="none" stroke="#161e27" strokeWidth="5" strokeLinecap="round" />
      <path d="M22 58 10 40M64 58 76 40" fill="none" stroke="#667887" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="9" cy="37" rx="7" ry="5" fill="#a3cedf" stroke="#161e27" strokeWidth="2" />
      <ellipse cx="77" cy="37" rx="7" ry="5" fill="#a3cedf" stroke="#161e27" strokeWidth="2" />
      <ellipse cx="43" cy="79" rx="21" ry="28" fill={geared ? "#f1de18" : "#47799b"} stroke="#17273a" strokeWidth="3" />
      <circle cx="43" cy="63" r="13" fill={geared ? "#222c36" : "#b87852"} stroke="#111820" strokeWidth="3" />
      {geared && <path d="M32 63h22" stroke="#c8effa" strokeWidth="5" strokeLinecap="round" />}
      <path d="M25 76 15 61m46 15 10-15" stroke={geared ? "#f1de18" : "#47799b"} strokeWidth="7" strokeLinecap="round" />
      <path d="M31 96 24 119m31-23 7 23" stroke="#244d72" strokeWidth="8" strokeLinecap="round" />
      <circle cx="43" cy="42" r="6" fill="#dff8ff" opacity=".9" />
    </g>
  );

  return (
    <div className="road-scene topdown-turn-scene">
      <div className="topdown-ground" aria-hidden="true">
        <i /><i /><i /><i /><i /><i />
      </div>

      <svg className="topdown-road-map" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="wetTurnRoad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#172637" />
            <stop offset=".5" stopColor="#344a5a" />
            <stop offset="1" stopColor="#162433" />
          </linearGradient>
        </defs>
        <path className="topdown-road-edge" d="M245 760 C245 510 270 390 445 345 C625 300 720 190 720 -60" />
        <path className="topdown-road-surface" d="M245 760 C245 510 270 390 445 345 C625 300 720 190 720 -60" />
        {/* The reflection stripe (a translucent band traced along the
            same centre path as the yellow lane dashes) previously read
            as a separate grey band running under the dashes, breaking
            the road's single asphalt color — removed so the surface is
            one consistent color. */}
        <path className="topdown-road-center" d="M245 760 C245 510 270 390 445 345 C625 300 720 190 720 -60" />
        {isSkidTurn && <>
          <path className="topdown-skid-path" d={bikePath} transform="translate(-8 0)" />
          <path className="topdown-skid-path topdown-skid-path-late" d={bikePath} transform="translate(8 0)" />
        </>}

        {/* Driven by CSS motion-path (offset-path/offset-distance) rather
            than SMIL <animateMotion> — the previous SMIL element had to be
            fully remounted (via `key={activeAction}`) the instant an answer
            was picked, which raced against the removal of the group's
            static resting transform and could leave the bike rendered at
            its untransformed local coordinates for a frame — reading as
            the rider vanishing instead of riding the curve. The CSS
            version has one continuous transform the whole time (resting
            at offset-distance 0%, animated to 100% on answer), so there is
            no state to race and the bike is never unplaced. */}
        <g className={`topdown-bike-motion ${isSafeTurn ? "topdown-bike-anim-safe" : isSkidTurn ? "topdown-bike-anim-skid" : ""}`}>
          <g transform="scale(.62)">
            <g transform="translate(-43 -80)">
              <g transform="rotate(90 43 80)">{bikeArtwork}</g>
            </g>
          </g>
        </g>
      </svg>

      <div className="topdown-turn-warning" aria-hidden="true">
        <div className="topdown-turn-warning-face"><span>↱</span><small>SLIPPERY CURVE</small></div>
        <div className="topdown-turn-warning-post" />
        <div className="topdown-turn-warning-base" />
      </div>
      <div className="topdown-puddle topdown-puddle-one" aria-hidden="true" />
      <div className="topdown-puddle topdown-puddle-two" aria-hidden="true" />

      <RainEffect intensity="normal" />
      <div className="topdown-rain-glaze" aria-hidden="true" />
    </div>
  );
}
