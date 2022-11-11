import { useState, useEffect } from "react";
import Papa from "papaparse";

export default function ActivityTotals () {
  const [parsedCsvData, setParsedCsvData] = useState([]);
  const [totalsByActivity, setTotalsByActivity] = useState({});

  const parseFile = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: "greedy",
      complete: (results) => {
        setParsedCsvData(results.data);
      }
    });
  };

  const toHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  }

  useEffect(() => {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQpattUOpPKcUSS8bxlk3P-9OdmCHcNB32FINvEfnQg81WN6OsxK6AIho-gijZROruqizBjlukxKscX/pub?output=csv")
      .then(resp => resp.text())
      .then(csv => parseFile(csv))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    const activities = Array.from(new Set(parsedCsvData.map((row) => row["Activity"])));
    const totalsByActivity = {};
    activities.forEach((activity) => {
      const totalTime = parsedCsvData
        .filter((row) => row["Activity"] === activity)
        .map((row) => parseInt(row["Time (mins)"]))
        .reduce((a, b) => a + b, 0);
      totalsByActivity[activity] = totalTime;
    })
    setTotalsByActivity(totalsByActivity);
  }, [parsedCsvData])

  if (parsedCsvData.length === 0) {
    return <p>Parsing csv file...</p>
  }

  if (Object.keys(totalsByActivity).length === 0) {
    return <p>Processing data...</p>
  }

  return (
    <div className="ActivityTotals">
      <h1>Study Activities:</h1>
      <ol>
        {Object
          .entries(totalsByActivity)
          .sort((a, b) => b[1] - a[1])
          .map(([activity, total], i) => {
            const [ hours, minutes ] = Object.values(toHoursAndMinutes(total));
            return (
              <li key={i}>
                <span className="activity-name">{activity}</span>: {hours}:{minutes.toString().padEnd(2, "0")}
              </li>
            )
          })
        }
      </ol>
    </div>
  );
}
