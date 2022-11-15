import ProgressRing from "./ProgressRing"

export default function WeeklyProgress () {
  const progressOne = 100;
  const progressTwo = 75;

  return (
    <div style={{display: "flex"}}>
      <ProgressRing
        stroke={8}
        radius={100}
        progress={progressOne}
      />
      <ProgressRing
        stroke={8}
        radius={100}
        progress={progressTwo}
      />
    </div>
  );
}
