import { useMemo } from "react";

/**
 * Reusable animated rain-particle layer. Intensity controls how many
 * drops render and how fast they fall — used to visually differentiate
 * "heavy-rain" scenarios from calmer ones.
 */
export default function RainEffect({ intensity = "normal", foreground = false }) {
  // The foreground pass renders a sparser set of larger, closer-feeling
  // drops ABOVE the motorcycle/rider (see RoadEnvironment.jsx layer 8.5) so rain
  // is visibly falling past/on the rider, not just in the distant
  // background — without ever being dense enough to obscure them.
  const baseCount = intensity === "heavy" ? 90 : intensity === "light" ? 35 : 60;
  const dropCount = foreground ? Math.round(baseCount * 0.3) : baseCount;

  const drops = useMemo(
    () =>
      Array.from({ length: dropCount }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: (foreground ? 0.4 : 0.5) + Math.random() * (intensity === "heavy" ? 0.4 : 0.7),
        drift: (Math.random() - 0.5) * 20,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dropCount, intensity, foreground]
  );

  return (
    <div className={`rain-effect rain-${intensity} ${foreground ? "rain-effect-foreground" : ""}`} aria-hidden="true">
      {drops.map((d) => (
        <span
          key={d.id}
          className="raindrop"
          style={{
            left: `${d.left}%`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            "--drift": `${d.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
