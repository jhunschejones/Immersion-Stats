import { useEffect, useState } from "react";
import { parseCsvFile } from "../utils/parsing";
import { getSearchParams } from "../utils/urls";
import { minutesToHoursAndMinutes } from "../utils/time";

import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export default function AnkiReviews () {
  const [parsedCsvData, setParsedCsvData] = useState([]);
  const [firstDate, setFirstDate] = useState();
  const [lastDate, setLastDate] = useState();
  const [startDate, setStartDate] = useState();
  const [highestValue, setHighestValue] = useState();
  const [lowestValue, setLowestValue] = useState();
  const [totalAnkiTimeString, setTotalAnkiTimeString] = useState("");

  useEffect(() => {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRtfhZzd63RTmi_cQ4sTSpLCYbufMKNxdWBrf1fIjqomzeNFRdX1O6DBXUUNcfwNQuRaY-TTp_Fa5M3/pub?gid=0&single=true&output=csv")
      .then(resp => resp.text())
      .then(csv => parseCsvFile(csv, setParsedCsvData))
      .catch(err => console.log(err));
  }, []);

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
    const urlStartDate = getSearchParams().get("startDate")?.trim();
    if (urlStartDate && new Date(urlStartDate) != "Invalid Date") {
      setStartDate(new Date(urlStartDate));
    } else {
      setStartDate(firstDate);
    }
  }, [parsedCsvData, firstDate]);

  useEffect(() => {
    const totalMinutes = parsedCsvData.map(row => parseInt(row["Time (mins)"])).reduce((a, b) => a + b, 0);
    const formattedTime = minutesToHoursAndMinutes(totalMinutes);
    setTotalAnkiTimeString(`${formattedTime.hours}hrs ${formattedTime.minutes}mins`);
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

  if (parsedCsvData.length === 0) {
    return <p className="loading-messsage">Parsing csv file...</p>;
  }

  if (!firstDate || !lastDate || !highestValue || !lowestValue || !startDate) {
    return <p className="loading-messsage">Processing data...</p>;
  }

  const heatData = parsedCsvData.map((row) => {
    return { date: row["Date"], count: row["Time (mins)"] };
  });

  return(
    <div className="AnkiTotals">
      <h1 style={{
        margin: "4px 0 2px 0",
        padding: "0",
        fontSize: "28px",
        fontWeight: "600"
      }}>
        Anki Reviews
      </h1>
      <p style={{margin: "0", fontWeight: "200", fontSize: "14px"}}>
        {totalAnkiTimeString}
      </p>
      <div className="heatmap-container">
        <CalendarHeatmap
          startDate={startDate}
          endDate={lastDate}
          values={heatData}
          classForValue={(value) => colorScaleClassFromValue(value?.count)}
          titleForValue={(value) => value && `${value.date}, ${parseInt(value.count)} minutes`}
          showOutOfRangeDays
        />
      </div>
    </div>
  );
}
