// Borrowed from https://css-tricks.com/building-progress-ring-quickly/
import PropTypes from "prop-types";

ProgressRing.propTypes = {
  radius: PropTypes.number,
  stroke: PropTypes.number,
  progress: PropTypes.number,
  title: PropTypes.string,
  progressText: PropTypes.string
};

export default function ProgressRing ({radius, stroke, progress, title, progressText=null}) {
  const adjustedProgress = progress > 100 ? 100 : progress;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - adjustedProgress / 100 * circumference;
  const titleOffsetPixels = 32;
  const showFullCircle = adjustedProgress === 100;

  return (
    <div
      className="progress-ring-container"
      style={{maxWidth: radius * 2, maxHeight: (radius * 2) + titleOffsetPixels}}
    >
      <h4 className="progress-title">{title}</h4>
      <div className="progress-ring" data-testid="progress-ring">
        <svg
          height={radius * 2}
          width={radius * 2}
        >
          <circle
            data-full={showFullCircle}
            stroke={showFullCircle ? "#5dcc06" : "#235390"}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + " " + circumference}
            style={{strokeDashoffset}}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
      </div>
      <span className="progress-text" data-testid="progress-text">
        {progressText ? progressText : `${progress}%`}
      </span>
    </div>
  );
}
