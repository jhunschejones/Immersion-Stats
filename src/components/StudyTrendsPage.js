import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { getSearchParams } from "../utils/urls";
import { parseCsvFile } from "../utils/parsing";
import { fetchJpdb, fetchBunpro, fetchAnki, fetchImmersion } from "../utils/csv-fetching";
import { useCallback } from "react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);


/**
 * Build an array of all dates between two dates
 *
 * @param {Date} startDate - the start of the date range
 * @param {Date} endDate - the end of the date range
 * @returns {array<Date>}
 */
const getDatesBetween = (startDate, endDate) => {
  const currentDate = new Date(startDate.getTime());
  const dates = [];
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

const DATE_RANGES = ["10D", "1M", "3M"];

const tenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 10));
const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));
const threeMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 3));
// const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1));

const tenDaysAgoDateRange = getDatesBetween(tenDaysAgo, new Date());
const oneMonthDateRange = getDatesBetween(oneMonthAgo, new Date());
const threeMonthsDateRange = getDatesBetween(threeMonthsAgo, new Date());
// const oneYearDateRange = getDatesBetween(oneYearAgo, new Date());

const datesForDateRange = (dateRange) => {
  if (dateRange == "1M") {
    return oneMonthDateRange;
  }
  if (dateRange == "3M") {
    return threeMonthsDateRange;
  }
  // if (dateRange == "1Y") {
  //   return oneYearDateRange;
  // }
  return tenDaysAgoDateRange;
};

/**
 * A helper method to pad a `dataSet` over a given `dateRange` filling in `0`s
 * for missing days and summing days with multiple entries.
 *
 * @param {array<{ date: Date, minutesStudied: Number }>} dataSet - the data set to pad
 * @param {string} dateRange - the date range to pad the `dataSet` over
 * @returns {array<{ date: Date, minutesStudied: Number }>}
 */
const padDataSetForDateRange = (dataSet, dateRange) => {
  return datesForDateRange(dateRange).map((date) => {
    const entriesMatchingDate = dataSet.filter(entry => {
      // Compare without timezone
      return entry.date.toISOString().split("T")[0] == date.toISOString().split("T")[0];
    });
    let minutesStudied = 0;
    if (entriesMatchingDate.length > 0) {
      minutesStudied = entriesMatchingDate.map((entry) => entry.minutesStudied).reduce((a, b) => a + b);
    }
    return { date: date, minutesStudied: minutesStudied };
  });
};

/**
 * Parses a CSV with at least `Date` and `Time (mins)` columns out into a standardized, padded dataset
 *
 * @param {array<{ "Date": string, "Time (mins)": string }>} csvData
 * @returns {array<{ date: Date, minutesStudied: Number }>}
 */
const standardizedCsvToPaddedDataSet = (csvData, dateRange) => {
  const parsedCsv = parseCsvFile(csvData).map((d) => {
    return { date: new Date(d["Date"]), minutesStudied: parseFloat(d["Time (mins)"]) };
  });

  return padDataSetForDateRange(parsedCsv, dateRange);
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
  },
  scales: {
    y: {
      title: {
        display: true,
        text: "Study minutes"
      }
    }
  },
};

export default function StudyTrendsPage () {
  const [chartData, setChartData] = useState({});
  const jpdbResponse = useQuery({ queryKey: ["jpdb"], queryFn: fetchJpdb });
  const bunproResponse = useQuery({ queryKey: ["bunpro"], queryFn: fetchBunpro });
  const ankiResponse = useQuery({ queryKey: ["anki"], queryFn: fetchAnki });
  const immersionResponse = useQuery({ queryKey: ["immersion"], queryFn: fetchImmersion });

  const setSearchParams = useSearchParams()[1];
  const [selectedDateRange, setSelectedDateRange] = useState(() => {
    const urlDateRange = getSearchParams().get("dateRange")?.trim();
    if (urlDateRange && DATE_RANGES.includes(urlDateRange)) {
      return urlDateRange;
    }
    return DATE_RANGES[0];
  });

  const selectDateRange = useCallback((dateRange) => {
    setSearchParams({dateRange: dateRange});
    setSelectedDateRange(dateRange);
  }, []);

  const paddedJpdbData = useMemo(() => {
    if (jpdbResponse.isLoading) return [];
    return standardizedCsvToPaddedDataSet(jpdbResponse.data, selectedDateRange);
  }, [jpdbResponse.isLoading, jpdbResponse.data, selectedDateRange]);

  const paddedBunproData = useMemo(() => {
    if (bunproResponse.isLoading) return [];
    return standardizedCsvToPaddedDataSet(bunproResponse.data, selectedDateRange);
  }, [bunproResponse.isLoading, bunproResponse.data, selectedDateRange]);

  const paddedAnkiData = useMemo(() => {
    if (ankiResponse.isLoading) return [];
    return standardizedCsvToPaddedDataSet(ankiResponse.data, selectedDateRange);
  }, [ankiResponse.isLoading, ankiResponse.data, selectedDateRange]);

  const paddedImmersionData = useMemo(() => {
    if (immersionResponse.isLoading) return [];
    return standardizedCsvToPaddedDataSet(immersionResponse.data, selectedDateRange);
  }, [immersionResponse.isLoading, immersionResponse.data, selectedDateRange]);

  const paddedAllTimeData = useMemo(() => {
    if (paddedJpdbData.length == 0 || paddedBunproData.length == 0 || paddedAnkiData.length == 0 || paddedImmersionData.length == 0) {
      return [];
    }
    return padDataSetForDateRange(paddedJpdbData.concat(paddedBunproData).concat(paddedAnkiData).concat(paddedImmersionData), selectedDateRange);
  }, [paddedJpdbData, paddedBunproData, paddedAnkiData, paddedImmersionData, selectedDateRange]);

  useEffect(() => {
    // if (paddedJpdbData.length == 0 || paddedBunproData.length == 0 || paddedAnkiData.length == 0 || paddedImmersionData.length == 0 || paddedAllTimeData.length == 0) {
    //   return setChartData({});
    // }
    setChartData({
      labels: datesForDateRange(selectedDateRange).map(d => d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", weekday: "short" })),
      datasets: [
        {
          label: "JPDB Study Time",
          data: paddedJpdbData.map(d => d.minutesStudied),
          borderColor: "#5dcc06",
          backgroundColor: "#5dcc06",
        },
        {
          label: "Bunpro Study Time",
          data: paddedBunproData.map(d => d.minutesStudied),
          borderColor: "#ff9600",
          backgroundColor: "#ff9600",
        },
        {
          label: "Anki Study Time",
          data: paddedAnkiData.map(d => d.minutesStudied),
          borderColor: "#235390",
          backgroundColor: "#235390",
        },
        {
          label: "Total Immersion Time",
          data: paddedImmersionData.map(d => d.minutesStudied),
          borderColor: "#cc348d",
          backgroundColor: "#cc348d",
        },
        {
          label: "All Study Time",
          data: paddedAllTimeData.map(d => d.minutesStudied),
          borderColor: "#e5e5e5",
          backgroundColor: "#e5e5e5",
        }
      ],
    });
  }, [paddedJpdbData, paddedBunproData, paddedAnkiData, paddedImmersionData, paddedAllTimeData, selectedDateRange]);

  return(
    <div style={{maxHeight: "calc(100vh - 220px)", padding: "0 12px 12px 12px", display: "flex", flexDirection: "column", alignItems: "center"}}>
      <h1 style={{
        margin: "4px 0 18px 0",
        padding: "0",
        fontSize: "28px",
        fontWeight: "600"
      }}>Study Trends</h1>
      <div style={{display: "flex", marginBottom: "12px"}}>
        {DATE_RANGES.map((dateRange, index) => {
          const buttonStyles = { backgroundColor: "#1baff6", borderColor: "#1a99d6", margin: "0 2px" };
          if (selectedDateRange === dateRange) {
            buttonStyles.backgroundColor = "#ce82ff";
            buttonStyles.borderColor = "#a567cc";
          }
          return (
            <button key={index} className="button" style={buttonStyles} onClick={() => selectDateRange(dateRange)}>
              {dateRange}
            </button>
          );
        })}
      </div>
      {
        !chartData?.datasets ?
          <p style={{textAlign: "center"}}>Loading...</p> :
          <Line options={chartOptions} data={chartData} />
      }
    </div>
  );
}
