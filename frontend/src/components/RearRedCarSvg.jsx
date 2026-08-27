/** Shared rear-view red car used whenever the rider follows a car ahead. */
export default function RearRedCarSvg({ braking = false, indicating = false, className = "" }) {
  return (
    <svg className={className} viewBox="0 0 220 132" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rear view of a red car travelling ahead">
      <ellipse cx="110" cy="121" rx="91" ry="8" fill="rgba(0,0,0,.36)" />

      <path d="M44 69 61 27c3-8 10-13 19-14h60c9 1 16 6 19 14l17 42Z" fill="#e52320" stroke="#861817" strokeWidth="4" />
      <path d="m69 30 8-10h66l8 10 10 31H59Z" fill="#151c22" stroke="#8f1b19" strokeWidth="4" />
      <path d="M75 29h70l8 27H67Z" fill="#53636b" />
      <path d="M82 32h56" stroke="rgba(205,226,231,.25)" strokeWidth="3" strokeLinecap="round" />
      <rect x="101" y="35" width="18" height="5" rx="2" fill="#22292e" />
      <path d="M48 59h-9c-5 0-8 3-8 8v5h17M172 59h9c5 0 8 3 8 8v5h-17" fill="#d9dedf" stroke="#20262b" strokeWidth="3" />

      <path d="M25 68c2-8 8-13 17-15l18-4h100l18 4c9 2 15 7 17 15l5 34c1 8-5 14-13 14H33c-8 0-14-6-13-14Z" fill="#ed2723" stroke="#861817" strokeWidth="4" />
      <path d="M31 75h158" stroke="#f55348" strokeWidth="3" opacity=".75" />
      <path d="M38 79h47l-9 18H36Z" fill={indicating ? "#ffc21c" : "#a91e20"} stroke="#741518" strokeWidth="2" className={`${braking ? "fpv-tail-light" : ""} ${indicating ? "fpv-indicator-light" : ""}`} />
      <path d="M135 79h47l2 18h-40Z" fill={indicating ? "#ffc21c" : "#a91e20"} stroke="#741518" strokeWidth="2" className={`${braking ? "fpv-tail-light" : ""} ${indicating ? "fpv-indicator-light" : ""}`} />
      <path d="M29 103h162v12H29Z" fill="#bd1d1b" />
      <path d="M68 108h84" stroke="#20262b" strokeWidth="5" strokeLinecap="round" />
      <g aria-label="Vehicle registration number MH 01 AB 1234">
        <rect x="82" y="97" width="56" height="18" rx="2.5" fill="#f4f1dc" stroke="#171c20" strokeWidth="2" />
        <rect x="85" y="100" width="50" height="12" rx="1" fill="none" stroke="#777463" strokeWidth=".7" />
        <text x="110" y="108.8" textAnchor="middle" fill="#111820" fontFamily="Arial, sans-serif" fontSize="6.5" fontWeight="700" letterSpacing=".35">MH 01 AB 1234</text>
      </g>
      <rect x="97" y="84" width="26" height="5" rx="2" fill="#8d1716" />
      <rect x="39" y="104" width="15" height="6" rx="2" fill="#171c20" />
      <rect x="166" y="104" width="15" height="6" rx="2" fill="#171c20" />

      <g className="rear-car-wheel rear-car-wheel-left">
        <path d="M36 108h24v14c0 5-3 8-8 8H44c-5 0-8-3-8-8Z" fill="#191c20" stroke="#080a0c" strokeWidth="3" />
        <g className="rear-car-wheel-rotation">
          <circle cx="48" cy="116" r="5" fill="#b9c0c2" /><path d="M48 111v10m-5-5h10" stroke="#667177" strokeWidth="1.5" />
        </g>
      </g>
      <g className="rear-car-wheel rear-car-wheel-right">
        <path d="M160 108h24v14c0 5-3 8-8 8h-8c-5 0-8-3-8-8Z" fill="#191c20" stroke="#080a0c" strokeWidth="3" />
        <g className="rear-car-wheel-rotation">
          <circle cx="172" cy="116" r="5" fill="#b9c0c2" /><path d="M172 111v10m-5-5h10" stroke="#667177" strokeWidth="1.5" />
        </g>
      </g>
    </svg>
  );
}
