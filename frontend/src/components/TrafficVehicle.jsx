import RearRedCarSvg from "./RearRedCarSvg.jsx";

/**
 * TrafficVehicle — an SVG car/truck the rider shares the road with.
 * Used for the "safe following distance" and "sudden braking" scenarios,
 * where it needs to visibly sit ahead of the motorcycle and react
 * (brake lights, and a distance that visibly increases on the correct
 * answer).
 *
 * `distance`: 'close' | 'far' — controls how far ahead of the rider it
 * sits; RoadEnvironment animates this via a CSS transition when it changes.
 */
export default function TrafficVehicle({ type = "car", braking = false, distance = "close", moving = true }) {
  const isTruck = type === "truck";

  return (
    <div className={`traffic-vehicle-wrapper distance-${distance} ${braking ? "vehicle-braking" : ""} ${moving ? "vehicle-moving" : ""}`}>
      {isTruck ? <svg
        className="traffic-vehicle-svg"
        viewBox="0 0 160 90"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Truck ahead"
      >
        <ellipse cx="80" cy="82" rx="66" ry="7" fill="rgba(0,0,0,0.35)" />
        <rect x="14" y="18" width="132" height="44" rx="6" fill="#5b6478" />
        <rect x="14" y="18" width="40" height="44" rx="6" fill="#3d4658" />
        <rect x="22" y="26" width="24" height="18" rx="2" fill="#8fd7e0" opacity="0.85" />
        <circle cx="42" cy="64" r="13" fill="#141922" stroke="#05070c" strokeWidth="3" />
        <circle cx="42" cy="64" r="5" fill="#8a94a6" />
        <circle cx="118" cy="64" r="13" fill="#141922" stroke="#05070c" strokeWidth="3" />
        <circle cx="118" cy="64" r="5" fill="#8a94a6" />
      </svg> : (
        <RearRedCarSvg braking={braking} className="traffic-vehicle-svg traffic-car-svg" />
      )}
      {braking && <div className="brake-glow-halo" />}
    </div>
  );
}
