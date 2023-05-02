import { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import { parseCsvFile } from "../utils/parsing";
import { minutesToHoursAndMinutes } from "../utils/time";
import { HiFire } from "react-icons/hi";

import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export const colorScaleClassFromValue = (value, lowestValue, highestValue) => {
  if (!value || !lowestValue || !highestValue || value == 0) {
    return "color-empty";
  }
  const percentage = (parseFloat(value) - lowestValue) / parseFloat(highestValue - lowestValue);
  // round to nearest .25 then convert to number from 0 to 4
  const colorScaleNumber = (Math.round(percentage * 4) / 4).toFixed(2) / 0.25;
  return `color-scale-${colorScaleNumber}`;
};

ReviewsHeatmap.propTypes = {
  csvData: PropTypes.any,
  csvDataIsLoading: PropTypes.bool,
  chartTitle: PropTypes.string,
};

/**
 * @param {array<{"Date": string, "Time (mins)": number}> | undefined} csvData - Data from a CSV request, should contain at least
 * `Date` and `"Time (mins)"` columns, represented as keys in the objects in the array
 * @param {boolean} csvDataIsLoading - Indicates that the data is still being loaded
 * @param {string} chartTitle - The title to be displayed over the heatmap chart.
 */
export default function ReviewsHeatmap ({csvData, csvDataIsLoading, chartTitle}) {
  const [firstDate, setFirstDate] = useState();
  const [lastDate, setLastDate] = useState();
  const [highestValue, setHighestValue] = useState();
  const [lowestValue, setLowestValue] = useState();
  const [totalTimeString, setTotalTimeString] = useState("");
  const [totalDaysString, setTotalDaysString] = useState("");
  const [timeLabel, setTimeLabel] = useState("");
  const [dayLabel, setDayLabel] = useState("");
  const [showDataModal, setShowDataModal] = useState(false);

  /**
   * Expects a CSV with at least two columns named `Date` and `Time (mins)`.
   * @example
   * ```csv
   * Date,Time (mins)
   * 2/6/2023,36
   * 2/5/2023,96
   * 2/4/2023,75
   * 2/3/2023,1
   * ```
   */
  const parsedCsvData = useMemo(() => {
    return csvDataIsLoading ? [] : parseCsvFile(csvData);
  }, [csvData, csvDataIsLoading]);

  const dataModalContent = useMemo(() => {
    return(
      <div>
        <h2
          style={{
            margin: "-14px 0",
            padding: "0",
            fontSize: "22px",
            fontWeight: "500"
          }}
        >
          {chartTitle} data
        </h2>
        <ul style={{marginTop: "24px"}}>
          {parsedCsvData.map((row, index) => {
            return(
              <li key={index}>
                {(new Date(row["Date"])).toLocaleDateString("en-US", {timeStyle: undefined, day: "2-digit", month: "2-digit", year: "numeric"})}: {row["Time (mins)"]} mins
              </li>
            );
          })}
        </ul>
      </div>
    );
  }, [parsedCsvData]);

  useEffect(() => {
    // sort by date, removing days with 0 minutes of study because these can't
    // be the first or last days of actual study
    const csvDataSortedByDate = parsedCsvData
      .filter((row) => row["Time (mins)"] > 0)
      .sort((a, b) => new Date(b["Date"]) - new Date(a["Date"]));

    const firstEntry = csvDataSortedByDate[csvDataSortedByDate.length - 1];
    if (firstEntry) {
      setFirstDate(new Date(firstEntry["Date"]));
    }
    const latestEntry = csvDataSortedByDate[0];
    if (latestEntry) {
      setLastDate(new Date(latestEntry["Date"]));
    }
  }, [parsedCsvData]);

  useEffect(() => {
    const csvDataSortedByStudyTime = parsedCsvData.sort((a, b) => b["Time (mins)"] - a["Time (mins)"]);

    const highestEntry = csvDataSortedByStudyTime[0];
    if (highestEntry) {
      setHighestValue(highestEntry["Time (mins)"]);
    }
    const lowestEntry = csvDataSortedByStudyTime[csvDataSortedByStudyTime.length - 1];
    if (lowestEntry) {
      setLowestValue(lowestEntry["Time (mins)"]);
    }
  }, [parsedCsvData]);

  useEffect(() => {
    const totalMinutes = parsedCsvData.map(row => parseInt(row["Time (mins)"])).reduce((a, b) => a + b, 0);
    const formattedTime = minutesToHoursAndMinutes(totalMinutes);
    setTotalTimeString(`${formattedTime.hours}hrs ${formattedTime.minutes}mins`);
    setTimeLabel(`${formattedTime.hours}hrs ${formattedTime.minutes}mins`);

    const totalDays = parsedCsvData.filter(row => parseInt(row["Time (mins)"]) > 0).length;
    setTotalDaysString(`${totalDays} days`);
    setDayLabel(`${totalDays} days`);
  }, [parsedCsvData]);

  if (csvDataIsLoading) {
    return <p className="loading-messsage">Fetching csv file...</p>;
  }

  if (!firstDate || !lastDate || !highestValue || !lowestValue) {
    return <p className="loading-messsage">Processing data...</p>;
  }

  // 🐛 https://github.com/kevinsqi/react-calendar-heatmap/issues/203
  // if the start date is after 11/11/2022, 03/13/2023 gets dropped from the calendar
  const maxStartDate = new Date("11/11/2022");
  const bugfixStartDate = firstDate >  maxStartDate ? maxStartDate : firstDate;

  return(
    <div
      className="ReviewsHeatmap"
      onClick={(e) => {
        if (e.target.tagName != "rect") {
          setTimeLabel(totalTimeString);
          setDayLabel(totalDaysString);
        }
      }}
      style={{width: "100%"}}
    >
      <h1
        onClick={() => setShowDataModal(s => !s)}
        style={{
          margin: "4px 0 2px 0",
          padding: "0",
          fontSize: "28px",
          fontWeight: "600"
        }}
      >
        {chartTitle}
      </h1>
      <div style={{margin: "0", fontWeight: "200", fontSize: "14px", textAlign: "center"}}>
        <p style={{margin: "0"}} data-testid="day-label">
          {dayLabel === totalDaysString && <HiFire style={{color: "#ff9600", margin: "0 3px -3px 0", fontSize: "18px", display: "inline"}} />}
          {dayLabel}
        </p>
        <p style={{margin: "0"}} data-testid="time-label">{timeLabel}</p>
      </div>
      <div className="heatmap-container">
        <CalendarHeatmap
          startDate={bugfixStartDate}
          endDate={lastDate}
          values={parsedCsvData.map((row) => {
            return { date: row["Date"], count: row["Time (mins)"] };
          })}
          classForValue={(value) => colorScaleClassFromValue(value?.count, lowestValue, highestValue)}
          titleForValue={(value) => {
            if (value) return `${value.date}, ${parseInt(value.count)} minutes`;
            return "No value";
          }}
          onClick={(value) => {
            if (value) {
              setTimeLabel(`${parseInt(value.count)} minutes`);
              setDayLabel(value.date);
            }
          }}
        />
      </div>
      {showDataModal && <Modal onClose={() => setShowDataModal(s => !s)}>{dataModalContent}</Modal>}
    </div>
  );
}
