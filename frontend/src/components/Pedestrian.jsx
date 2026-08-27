/**
 * Pedestrian — a small SVG walking figure with an animated scissor-leg
 * gait, used on the pedestrian-crossing scenario. `stopped` freezes the
 * figure mid-crossing once the rider has (correctly) stopped for them.
 */
export default function Pedestrian({ variant = 1, stopped = false, child = false, profile = false }) {
  const bodyColor = variant === 1 ? "var(--yellow)" : "#e07b9a";

  return (
    <div className={`pedestrian-figure pedestrian-${variant} ${child ? "child-pedestrian" : ""} ${profile ? "profile-pedestrian" : ""} ${stopped ? "pedestrian-paused" : ""}`}>
      {profile ? <svg className="profile-person-svg" viewBox="0 0 54 104" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pedestrian walking across the zebra crossing">
        <ellipse cx="27" cy="100" rx="20" ry="3" fill="rgba(0,0,0,.24)" />
        <g className="profile-person-body">
          <circle cx="29" cy="17" r="11" fill="#b87852" />
          <path d="M20 16C20 4 38 1 42 13c-7-3-12-1-16 5Z" fill="#292329" />
          <path d="M37 15q8 3 0 7" fill="#b87852" />
          <circle cx="36" cy="16" r="1.3" fill="#172033" />
          <path d="M37 23q3 1 5-2" fill="none" stroke="#7e4335" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M20 30h18l3 34H18Z" fill="#2f7fa7" />
          <path d="M20 34 10 50 7 63" fill="none" stroke="#bd8059" strokeWidth="6" strokeLinecap="round" className="profile-person-arm profile-person-arm-a" />
          <path d="M37 35 46 49 51 58" fill="none" stroke="#bd8059" strokeWidth="6" strokeLinecap="round" className="profile-person-arm profile-person-arm-b" />
          <path d="M18 61h23l-2 15H21Z" fill="#263550" />
          <g className="profile-person-leg profile-person-leg-a"><path d="M24 73v17" stroke="#b87852" strokeWidth="7" strokeLinecap="round" /><path d="m24 89 12 8" stroke="#313943" strokeWidth="7" strokeLinecap="round" /></g>
          <g className="profile-person-leg profile-person-leg-b"><path d="M36 73v17" stroke="#b87852" strokeWidth="7" strokeLinecap="round" /><path d="M36 89 24 98" stroke="#313943" strokeWidth="7" strokeLinecap="round" /></g>
        </g>
      </svg> : child ? <svg className="school-child-svg" viewBox="0 0 62 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={variant === 1 ? "Schoolboy walking across pedestrian crossing" : "Schoolgirl walking across pedestrian crossing"}>
        <ellipse cx="31" cy="96" rx="20" ry="3" fill="rgba(0,0,0,.22)" />
        <g className="school-child-body">
          <circle cx="32" cy="18" r="12" fill={variant === 1 ? "#d99a69" : "#bd7d55"} />
          <path d="M40 16q8 3 0 7" fill={variant === 1 ? "#d99a69" : "#bd7d55"} />
          {variant === 1 ? <path d="M20 17C20 3 39 1 44 13c-8-3-14-1-18 5l-6-1Z" fill="#59301e" /> : <><path d="M20 17C20 3 40 1 44 14c-8-4-15-1-18 5Z" fill="#282127" /><circle cx="20" cy="20" r="6" fill="#282127" /><path d="M17 24q-7 5-1 12" fill="none" stroke="#282127" strokeWidth="5" /></>}
          <circle cx="38" cy="17" r="1.4" fill="#172033" />
          <path d="M39 24q4 1 6-2" fill="none" stroke="#914f3e" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M23 31h18l2 31H20Z" fill={variant === 1 ? "#31965c" : "#e76591"} />
          <path d="M22 34c-8 3-10 13-8 26h8" fill={variant === 1 ? "#e67b35" : "#35a08d"} stroke={variant === 1 ? "#b85f2b" : "#247c6f"} strokeWidth="2" />
          <path d="M23 37 13 53 8 65" fill="none" stroke={variant === 1 ? "#de9b6b" : "#c8875c"} strokeWidth="6" strokeLinecap="round" className="school-child-arm school-child-arm-a" />
          <path d="M39 37 48 51 55 59" fill="none" stroke={variant === 1 ? "#de9b6b" : "#c8875c"} strokeWidth="6" strokeLinecap="round" className="school-child-arm school-child-arm-b" />
          {variant === 1 ? <path d="M20 59h23l-2 14H22Z" fill="#283a62" /> : <path d="M19 59h25l4 15H16Z" fill="#56678f" />}
          <g className="school-child-leg school-child-leg-a"><path d="M26 70v17" stroke={variant === 1 ? "#d99a69" : "#c9875b"} strokeWidth="7" strokeLinecap="round" /><path d="m26 87 11 7" stroke={variant === 1 ? "#ed7d35" : "#f05e77"} strokeWidth="6" strokeLinecap="round" /></g>
          <g className="school-child-leg school-child-leg-b"><path d="M38 70v17" stroke={variant === 1 ? "#d99a69" : "#c9875b"} strokeWidth="7" strokeLinecap="round" /><path d="M38 87 27 95" stroke={variant === 1 ? "#ed7d35" : "#f05e77"} strokeWidth="6" strokeLinecap="round" /></g>
          <path d="M24 34h15" stroke="rgba(255,255,255,.5)" strokeWidth="2" />
        </g>
      </svg> : <svg viewBox="0 0 24 46" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pedestrian">
        <circle cx="12" cy="6" r="5" fill="#c68a5e" />
        <rect x="7" y="12" width="10" height="16" rx="4" fill={bodyColor} />
        <g className="pedestrian-legs">
          <path className="pedestrian-leg-a" d="M10 28 L7 42" stroke="#2b3550" strokeWidth="3.5" strokeLinecap="round" />
          <path className="pedestrian-leg-b" d="M14 28 L17 42" stroke="#2b3550" strokeWidth="3.5" strokeLinecap="round" />
        </g>
        <path d="M8 14 L2 22" stroke={bodyColor} strokeWidth="3" strokeLinecap="round" />
        <path d="M16 14 L22 22" stroke={bodyColor} strokeWidth="3" strokeLinecap="round" />
      </svg>}
    </div>
  );
}
