import ProgressRing from "./ProgressRing"

export default function WeeklyProgress () {
  const progress = 100;

  return (
    <div className="progress-ring-container">
      <ProgressRing
        stroke={8}
        radius={100}
        progress={progress}
      />
      <span className="progress-text">{progress}%</span>
    </div>
  );
}
