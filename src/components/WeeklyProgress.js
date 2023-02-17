import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import ProgressRing from "./ProgressRing";
import { parseCsvFile } from "../utils/parsing";
import { titleCase } from "../utils/strings";
import { getSearchParams } from "../utils/urls";
import { fetchWeeklyProgress } from "../utils/csv-fetching";

const TIME_RANGES = [
  {name: "This week", key: "this-week"},
  {name: "Last week", key: "last-week"},
  {name: "Two weeks", key: "two-weeks"},
];

export default function WeeklyProgress () {
  const {data, isLoading} = useQuery({ queryKey: ["weekly-progress"], queryFn: fetchWeeklyProgress });
  const setSearchParams = useSearchParams()[1];
  const [selectedTimeRangeKey, setSelectedTimeRangeKey] = useState(() => {
    const urlTimeRange = getSearchParams().get("timeRange")?.trim();
    if (urlTimeRange && TIME_RANGES.map(t => t.key).includes(urlTimeRange)) {
      return urlTimeRange;
    }
    return TIME_RANGES[0].key;
  });

  const parsedCsvData = useMemo(() => {
    if (isLoading) return [];
    return parseCsvFile(data);
  }, [isLoading, data]);

  const progressByTimeRangeKey = useMemo(() => {
    const result = {};
    TIME_RANGES.forEach((timeRange) => {
      result[timeRange.key] = parsedCsvData.slice(0, 3).map((progressReport) => {
        const progressNumber = (parseInt(progressReport[`${titleCase(timeRange.name)} (mins)`]) / parseInt(progressReport["Weekly Goals (mins)"])) * 100;
        return {
          progress: progressNumber,
          title: progressReport["Category"],
          progressText: progressReport[titleCase(timeRange.name)],
        };
      });
    });
    return result;
  }, [parsedCsvData]);

  const selectTimeRange = (timeRangeKey) => {
    setSearchParams({timeRange: timeRangeKey});
    setSelectedTimeRangeKey(timeRangeKey);
  };


  if (isLoading) {
    return <p className="loading-messsage">Fetching csv file...</p>;
  }

  if (Object.keys(progressByTimeRangeKey).length === 0) {
    return <p className="loading-messsage">Processing data...</p>;
  }

  return (
    <div className="WeeklyProgress">
      <h1 style={{
        margin: "4px 0 28px 0",
        padding: "0",
        fontSize: "28px",
        fontWeight: "600"
      }}>
        Weekly Progress
      </h1>
      <div className="time-range-button-container">
        {TIME_RANGES.map((timeRange, index) => {
          let buttonClassName = "button time-range-button";
          if (selectedTimeRangeKey === timeRange.key) {
            buttonClassName += " selected";
          }
          return (
            <button
              key={index}
              className={buttonClassName}
              onClick={() => selectTimeRange(timeRange.key)}
            >
              {timeRange.name}
            </button>
          );
        })}
      </div>
      <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
        {progressByTimeRangeKey[selectedTimeRangeKey].map((progressReport, index) => {
          return <ProgressRing
            key={index}
            stroke={8}
            radius={85}
            progress={progressReport["progress"]}
            title={progressReport["title"]}
            progressText={progressReport["progressText"]}
          />;
        })}
      </div>
    </div>
  );
}
