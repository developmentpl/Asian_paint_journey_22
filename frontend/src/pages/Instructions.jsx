import { useState } from "react";
import WelcomeScreen from "../components/WelcomeScreen.jsx";
import Countdown from "../components/Countdown.jsx";

/**
 * Instructions page — shows the pre-ride instructions/rules card, then the
 * 3-2-1-GO countdown, then hands off to the Game page. (Renamed from
 * "Welcome" — this is the flow's explicit Instructions step.)
 */
export default function Instructions({ player, onStart }) {
  const [phase, setPhase] = useState("intro"); // 'intro' | 'countdown'

  return (
    <div className="rain-backdrop">
      <div className="reg-bg" aria-hidden="true">
        <div className="reg-bg-sky" />
        <div className="reg-bg-road" />
      </div>
      {phase === "intro" && (
        <div className="screen-center">
          <WelcomeScreen playerName={player.name} onStartJourney={() => setPhase("countdown")} />
        </div>
      )}
      {phase === "countdown" && <Countdown onFinish={onStart} />}
    </div>
  );
}
