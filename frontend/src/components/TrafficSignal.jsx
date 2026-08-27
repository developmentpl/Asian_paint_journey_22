/**
 * TrafficSignal — an SVG traffic-light pole, or a pedestrian-crossing
 * signal when `state === "pedestrian"`. Used to dress the pedestrian and
 * turn scenarios with a real road fixture instead of empty space.
 */
export default function TrafficSignal({ state = "red" }) {
  const isPedestrian = state === "pedestrian";

  return (
    <div className={`traffic-signal-wrapper signal-state-${state}`}>
      <svg viewBox="0 0 40 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Traffic signal">
        <rect x="17" y="30" width="6" height="76" fill="#3a4150" />
        <rect x="6" y="4" width="28" height={isPedestrian ? 40 : 66} rx="6" fill="#1b2130" stroke="#05070c" strokeWidth="2" />

        {isPedestrian ? (
          <>
            <circle cx="20" cy="16" r="8" fill="var(--red)" className="pedestrian-stop-light" />
            <circle cx="20" cy="32" r="8" fill="var(--green)" className="pedestrian-go-light" />
          </>
        ) : (
          <>
            <circle cx="20" cy="16" r="7" fill={state === "red" ? "var(--red)" : "#4a1b20"} className={state === "red" ? "signal-pulse" : ""} />
            <circle cx="20" cy="36" r="7" fill={state === "yellow" ? "var(--yellow)" : "#4a3d1b"} className={state === "yellow" ? "signal-pulse" : ""} />
            <circle cx="20" cy="56" r="7" fill={state === "green" ? "var(--green)" : "#1b4a2c"} className={state === "green" ? "signal-pulse" : ""} />
          </>
        )}
      </svg>
    </div>
  );
}
