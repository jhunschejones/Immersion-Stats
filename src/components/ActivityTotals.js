import { useMemo } from "react";
import { useQuery } from "react-query";
import { parseCsvFile } from "../utils/parsing";
import { minutesToHoursAndMinutesString } from "../utils/time";
import { fetchTotals } from "../utils/csv-fetching";
import { dig } from "../utils/objects";

export default function ActivityTotals () {
  const {data, isLoading} = useQuery({ queryKey: ["totals"], queryFn: fetchTotals });

  const parsedCsvData = useMemo(() => {
    if (isLoading) return [];
    return parseCsvFile(data).sort((a, b) => new Date(b["Date"]) - new Date(a["Date"]));
  }, [isLoading, data]);

  const startDate = useMemo(() => dig(["Date"], parsedCsvData[parsedCsvData.length - 1]), [parsedCsvData]);
  const endDate = useMemo(() => dig(["Date"], parsedCsvData[0]), [parsedCsvData]);

  const totalsByActivity = useMemo(() => {
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
    return totalsByActivity;
  }, [parsedCsvData]);


  if (isLoading) {
    return <p className="loading-messsage">Fetching csv file...</p>;
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
        {Object.entries(totalsByActivity)
          .sort((a, b) => b[1] - a[1])
          .map(([activity, total], i) => {
            return (
              <li key={i} className="activity">
                <span className="activity-name">{activity}</span>
                <span className="activity-time">{minutesToHoursAndMinutesString(total)}</span>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
