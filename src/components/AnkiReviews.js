import { useEffect, useState, useMemo } from "react";
import { useQuery } from "react-query";
import { fetchAnki } from "../utils/csv-fetching";
import { parseCsvFile } from "../utils/parsing";
import { minutesToHoursAndMinutes } from "../utils/time";
import { HiFire } from "react-icons/hi";

import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export default function AnkiReviews () {
  const [firstDate, setFirstDate] = useState();
  const [lastDate, setLastDate] = useState();
  const [highestValue, setHighestValue] = useState();
  const [lowestValue, setLowestValue] = useState();
  const [totalAnkiTimeString, setTotalAnkiTimeString] = useState("");
  const [totalAnkiDaysString, setTotalAnkiDaysString] = useState("");
  const [timeLabel, setTimeLabel] = useState("");
  const [dayLabel, setDayLabel] = useState("");
  const {data, isLoading} = useQuery({ queryKey: ["anki"], queryFn: fetchAnki });

  const parsedCsvData = useMemo(() => {
    if (isLoading) return [];
    return parseCsvFile(data);
  }, [isLoading, data]);

  useEffect(() => {
    const sorted = parsedCsvData
      .filter((row) => row["Time (mins)"] > 0)
      .sort((a, b) => new Date(b["Date"]) - new Date(a["Date"]));
    const firstEntry = sorted[sorted.length - 1];
    if (firstEntry) {
      setFirstDate(new Date(firstEntry["Date"]));
    }
    const latestEntry = sorted[0];
    if (latestEntry) {
      setLastDate(new Date(latestEntry["Date"]));
    }
  }, [parsedCsvData]);

  useEffect(() => {
    const sorted = parsedCsvData.sort((a, b) => b["Time (mins)"] - a["Time (mins)"]);
    if (sorted[sorted.length - 1]) {
      setLowestValue(sorted[sorted.length - 1]["Time (mins)"]);
    }
    if (sorted[0]) {
      setHighestValue(sorted[0]["Time (mins)"]);
    }
  }, [parsedCsvData]);

  useEffect(() => {
    const totalMinutes = parsedCsvData.map(row => parseInt(row["Time (mins)"])).reduce((a, b) => a + b, 0);
    const formattedTime = minutesToHoursAndMinutes(totalMinutes);
    setTotalAnkiTimeString(`${formattedTime.hours}hrs ${formattedTime.minutes}mins`);
    setTimeLabel(`${formattedTime.hours}hrs ${formattedTime.minutes}mins`);

    const totalDays = parsedCsvData.filter(row => parseInt(row["Time (mins)"]) > 0).length;
    setTotalAnkiDaysString(`${totalDays} days`);
    setDayLabel(`${totalDays} days`);
  }, [parsedCsvData]);


  const colorScaleClassFromValue = (value) => {
    if (!value || !highestValue || !lowestValue) {
      return "color-empty";
    }
    const percentage = (parseFloat(value) - lowestValue) / parseFloat(highestValue - lowestValue);
    // round to nearest .25 then convert to number from 0 to 4
    const colorScaleNumber = (Math.round(percentage * 4) / 4).toFixed(2) / 0.25;
    return `color-scale-${colorScaleNumber}`;
  };

  if (isLoading) {
    return <p className="loading-messsage">Fetching csv file...</p>;
  }

  if (parsedCsvData.length === 0) {
    return <p className="loading-messsage">Parsing csv file...</p>;
  }

  if (!firstDate || !lastDate || !highestValue || !lowestValue) {
    return <p className="loading-messsage">Processing data...</p>;
  }

  const heatData = parsedCsvData.map((row) => {
    return { date: row["Date"], count: row["Time (mins)"] };
  });

  return(
    <div className="AnkiTotals" onClick={(e) => {
      if (e.target.tagName != "rect") {
        setTimeLabel(totalAnkiTimeString);
        setDayLabel(totalAnkiDaysString);
      }
    }}>
      <h1 style={{
        margin: "4px 0 2px 0",
        padding: "0",
        fontSize: "28px",
        fontWeight: "600"
      }}>
        Anki Reviews
      </h1>
      <div style={{margin: "0", fontWeight: "200", fontSize: "14px", textAlign: "center"}}>
        <p style={{margin: "0"}} data-testid="day-label">
          {dayLabel === totalAnkiDaysString && <HiFire style={{color: "#ff9600", margin: "0 3px -3px 0", fontSize: "18px", display: "inline"}} />}
          {dayLabel}
        </p>
        <p style={{margin: "0"}} data-testid="time-label">{timeLabel}</p>
      </div>
      <div className="heatmap-container">
        <CalendarHeatmap
          startDate={firstDate}
          endDate={lastDate}
          values={heatData}
          classForValue={(value) => colorScaleClassFromValue(value?.count)}
          titleForValue={(value) => value && `${value.date}, ${parseInt(value.count)} minutes`}
          onClick={(value) => {
            if (value) {
              setTimeLabel(`${parseInt(value.count)} minutes`);
              setDayLabel(value.date);
            }
          }}
        />
      </div>
    </div>
  );
}
