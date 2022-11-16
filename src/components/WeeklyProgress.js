import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Papa from "papaparse";
import ProgressRing from "./ProgressRing";

const TIME_RANGES = ["This week", "Last week", "Two weeks"];

// the getter on the `useSearchParams` hook doesn't work with the hash router
// use this function instead to read search params from the URL
const getSearchParams = () => {
  return new URL(window.location.toString().replace("/#/", "/")).searchParams;
}

export default function WeeklyProgress () {
  const [parsedCsvData, setParsedCsvData] = useState([]);
  const [progressByTimeRange, setProgressByTimeRange] = useState({});
  const [selectedTimeRange, setSelectedTimeRange] = useState(TIME_RANGES[0]);
  const setSearchParams = useSearchParams()[1];

  const titleCase = (string) => {
    let splitStringArray = string.toLowerCase().split(" ");
    for (let i = 0; i < splitStringArray.length; i++) {
      splitStringArray[i] = splitStringArray[i].charAt(0).toUpperCase() + splitStringArray[i].slice(1);
    }
    return splitStringArray.join(" ");
  }

  const parseFile = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: "greedy",
      complete: (results) => {
        setParsedCsvData(results.data);
      }
    });
  };

  const selectTimeRange = (timeRange) => {
    setSearchParams({timeRange});
    setSelectedTimeRange(timeRange);
  }

  useEffect(() => {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQpattUOpPKcUSS8bxlk3P-9OdmCHcNB32FINvEfnQg81WN6OsxK6AIho-gijZROruqizBjlukxKscX/pub?gid=1631773302&single=true&output=csv")
      .then(resp => resp.text())
      .then(csv => parseFile(csv))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    let result = {};
    TIME_RANGES.forEach((timeRange) => {
      result[timeRange] = parsedCsvData.slice(0, 3).map((progressReport) => {
        const progressNumber = (parseInt(progressReport[`${titleCase(timeRange)} (mins)`]) / parseInt(progressReport["Weekly Goals (mins)"])) * 100;
        return {
          progress: progressNumber,
          title: progressReport["Category"],
          progressText: progressReport[titleCase(timeRange)],
        }
      });
    });
    setProgressByTimeRange(result);

  }, [parsedCsvData]);

  useEffect(() => {
    const urlTimeRange = getSearchParams().get("timeRange")?.trim();
    if (urlTimeRange && TIME_RANGES.includes(urlTimeRange)) {
      setSelectedTimeRange(urlTimeRange);
    }
  }, [])

  if (parsedCsvData.length === 0) {
    return <p>Parsing csv file...</p>;
  }

  if (Object.keys(progressByTimeRange).length === 0) {
    return <p>Processing data...</p>;
  }

  return (
    <div className="WeeklyProgress">
      <h1 style={{margin: "0 0 12px 0", padding: "0", fontSize: "28px", fontWeight: "600"}}>
        Weekly Progress:
      </h1>
      <div className="time-range-button-container">
        {TIME_RANGES.map((timeRange, index) => {
          let buttonClassName = "button time-range-button";
          if (selectedTimeRange === timeRange) {
            buttonClassName += " selected";
          }
          return (
            <button
              key={index}
              className={buttonClassName}
              onClick={() => selectTimeRange(timeRange)}
            >
              {timeRange}
            </button>
          )
        })}
      </div>
      <div style={{display: "flex", flexWrap: "wrap"}}>
        {progressByTimeRange[selectedTimeRange].map((progressReport, index) => {
          return <ProgressRing
            key={index}
            stroke={8}
            radius={85}
            progress={progressReport["progress"]}
            title={progressReport["title"]}
            progressText={progressReport["progressText"]}
          />
        })}
      </div>
    </div>
  );
}
