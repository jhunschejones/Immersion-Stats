import { useState, useEffect } from "react";
import { parseCsvFile } from "../utils/parsing";
import { minutesToHoursAndMinutesString } from "../utils/time";

export default function ActivityTotals () {
  const [parsedCsvData, setParsedCsvData] = useState([]);
  const [totalsByActivity, setTotalsByActivity] = useState({});
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  useEffect(() => {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQpattUOpPKcUSS8bxlk3P-9OdmCHcNB32FINvEfnQg81WN6OsxK6AIho-gijZROruqizBjlukxKscX/pub?output=csv")
      .then(resp => resp.text())
      .then(csv => parseCsvFile(csv, setParsedCsvData))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    const activities = Array.from(new Set(parsedCsvData.map((row) => row["Activity"])));
    const totalsByActivity = {};
    activities.forEach((activity) => {
      const totalTime = parsedCsvData
        .filter((row) => row["Activity"] === activity)
        .map((row) => parseInt(row["Time (mins)"]))
        .filter((row) => !isNaN(row))
        .reduce((a, b) => a + b, 0);
      totalsByActivity[activity] = totalTime;
    });
    setTotalsByActivity(totalsByActivity);

    const sorted = parsedCsvData.sort((a, b) => new Date(b["Date"]) - new Date(a["Date"]));
    const firstEntry = sorted[sorted.length - 1];
    if (firstEntry) {
      setStartDate(firstEntry["Date"]);
    }
    const latestEntry = sorted[0];
    if (latestEntry) {
      setEndDate(latestEntry["Date"]);
    }

  }, [parsedCsvData]);

  if (parsedCsvData.length === 0) {
    return <p className="loading-messsage">Parsing csv file...</p>;
  }

  if (Object.keys(totalsByActivity).length === 0) {
    return <p className="loading-messsage">Processing data...</p>;
  }

  return (
    <div className="ActivityTotals">
      <h1 style={{
        margin: "4px 0 2px 0",
        padding: "0",
        fontSize: "28px",
        fontWeight: "600"
      }}>
        Study Activities
      </h1>
      <p style={{margin: "0", fontWeight: "200", fontSize: "14px"}}>
        {startDate} - {endDate}
      </p>
      <ul className="activity-list">
        {Object
          .entries(totalsByActivity)
          .sort((a, b) => b[1] - a[1])
          .map(([activity, total], i) => {
            return (
              <li key={i} className="activity">
                <span className="activity-name">{activity}</span>
                <span className="activity-time">{minutesToHoursAndMinutesString(total)}</span>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
}
