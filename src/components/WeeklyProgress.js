import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProgressRing from "./ProgressRing";
import { parseCsvFile } from "../utils/parsing";
import { titleCase } from "../utils/strings";
import { getSearchParams } from "../utils/urls";

const TIME_RANGES = [
  {name: "This week", key: "this-week"},
  {name: "Last week", key: "last-week"},
  {name: "Two weeks", key: "two-weeks"},
];

export default function WeeklyProgress () {
  const [parsedCsvData, setParsedCsvData] = useState([]);
  const [progressByTimeRangeKey, setProgressByTimeRangeKey] = useState({});
  const [selectedTimeRangeKey, setSelectedTimeRangeKey] = useState(TIME_RANGES[0].key);
  const setSearchParams = useSearchParams()[1];

  useEffect(() => {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQpattUOpPKcUSS8bxlk3P-9OdmCHcNB32FINvEfnQg81WN6OsxK6AIho-gijZROruqizBjlukxKscX/pub?gid=1631773302&single=true&output=csv")
      .then(resp => resp.text())
      .then(csv => parseCsvFile(csv, setParsedCsvData))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    let result = {};
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
    setProgressByTimeRangeKey(result);

  }, [parsedCsvData]);

  useEffect(() => {
    const urlTimeRange = getSearchParams().get("timeRange")?.trim();
    if (urlTimeRange && TIME_RANGES.map(t => t.key).includes(urlTimeRange)) {
      setSelectedTimeRangeKey(urlTimeRange);
    }
  }, []);

  const selectTimeRange = (timeRangeKey) => {
    setSearchParams({timeRange: timeRangeKey});
    setSelectedTimeRangeKey(timeRangeKey);
  };

  if (parsedCsvData.length === 0) {
    return <p className="loading-messsage">Parsing csv file...</p>;
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
      <div style={{display: "flex", flexWrap: "wrap"}}>
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
