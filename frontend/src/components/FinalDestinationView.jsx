import MotorcycleRider from "./MotorcycleRider.jsx";
import RainEffect from "./RainEffect.jsx";

export default function FinalDestinationView({ activeAction, geared, journeyProgress, motionState }) {
  const arriving = activeAction === "arriveDestination";

  return (
    <div className={`road-scene final-destination-scene destination-${motionState} ${arriving ? "destination-entering" : ""}`}>
      <div className="destination-sky"><i/><i/></div>
      <div className="destination-far-trees" aria-hidden="true">{Array.from({length: 8}).map((_, i) => <i key={i}/>)}</div>

      <div className="destination-compound">
        <div className="destination-boundary-wall"><i/><i/><i/><i/><i/><i/></div>
        <div className="destination-plant-building">
          <div className="destination-plant-brand"><b>ASIAN PAINTS</b><span>PLANT</span></div>
          <div className="destination-plant-windows">{Array.from({length: 12}).map((_, i) => <i key={i}/>)}</div>
        </div>
        <div className="destination-security-cabin"><span>SECURITY</span><i/></div>
        <div className="destination-gate"><b>ASIAN PAINTS</b><span>WELCOME</span><i/><i/></div>
        <div className="destination-tree destination-tree-two"><i/><span/></div>
      </div>

      <div className="destination-main-road">
        <div className="destination-road-reflection"/>
        <div className="destination-lane-line"/>
        <div className="destination-puddle destination-puddle-one"/>
        <div className="destination-puddle destination-puddle-two"/>
      </div>
      <div className="destination-road-sign"><b>ASIAN PAINTS PLANT</b><span>→</span></div>
      <div className="destination-ahead"><i>◆</i><span>DESTINATION AHEAD</span></div>
      <div className="destination-streetlight destination-light-one"><i/></div>
      <div className="destination-streetlight destination-light-two"><i/></div>

      <MotorcycleRider activeAction={activeAction} geared={geared} scenarioId={10} journeyProgress={journeyProgress} />
      <div className="destination-ground-shadow"/>
      <RainEffect intensity="light" />
      <div className="destination-cinematic-shade"/>
    </div>
  );
}
