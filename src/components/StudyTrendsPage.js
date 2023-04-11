import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { useState, useMemo, useCallback } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { getSearchParams } from "../utils/urls";
import { parseCsvFile } from "../utils/parsing";
import { fetchJpdb, fetchBunpro, fetchAnki, fetchImmersion } from "../utils/csv-fetching";

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

const DATE_RANGES = ["10D", "1M", "3M", "1Y"];

const tenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 10));
const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));
const threeMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 3));
const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1));

const tenDaysAgoDateRange = getDatesBetween(tenDaysAgo, new Date());
const oneMonthDateRange = getDatesBetween(oneMonthAgo, new Date());
const threeMonthsDateRange = getDatesBetween(threeMonthsAgo, new Date());
const oneYearDateRange = getDatesBetween(oneYearAgo, new Date());

const datesForDateRange = (dateRange) => {
  if (dateRange == "1M") {
    return oneMonthDateRange;
  }
  if (dateRange == "3M") {
    return threeMonthsDateRange;
  }
  if (dateRange == "1Y") {
    return oneYearDateRange;
  }
  // default date range is 10D
  return tenDaysAgoDateRange;
};

const chartLablesByDateRange = {};
DATE_RANGES.forEach((dateRange) => {
  chartLablesByDateRange[dateRange] = datesForDateRange(dateRange).map(d => d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", weekday: "short" }));
});


/**
 * A helper method to transform a `dataset` or several datasets into an array of chart data for a given `dateRange`,
 * filling in `0`s for missing days.
 *
 * @param {{}|[]} dataset - a single dataset or an array of datasets
 * @param {string} dateRange
 * @returns {array<{ "Date": string, "Time (mins)": string }>}
 */
const datasetToPaddedArray = (dataset, dateRange) => {
  const datasetArray = Array(dataset).flat(); // support a single dataset or an array of datasets
  return datesForDateRange(dateRange).map((date) => {
    const dateKey = date.toISOString().split("T")[0];
    const matchingDataEntries = datasetArray.map((d) => d[dateKey]).filter((d) => d != undefined);
    if (matchingDataEntries.length > 0) {
      return { date: date, minutesStudied: matchingDataEntries.map((d) => d.minutesStudied).reduce((a, b) => a + b, 0) };
    }
    return { date: date, minutesStudied: 0 };
  });
};

/**
 * Parses a CSV with at least `Date` and `Time (mins)` columns into a standardized dataset object, summing
 * `Time (mins)` for duplicate entries.
 *
 * @param {array<{ "Date": string, "Time (mins)": string }>} csvData
 * @returns {{string: {date: Date, minutesStudied: number}}} - data set keyed by date string
 */
const standardizedCsvToDataset = (csvData) => {
  const result = {};
  parseCsvFile(csvData).forEach((d) => {
    const date = new Date(d["Date"]);
    if (result[date.toISOString().split("T")[0]]) {
      const previousMinutesStudied = result[date.toISOString().split("T")[0]].minutesStudied;
      result[date.toISOString().split("T")[0]] = { date: date, minutesStudied: parseFloat(d["Time (mins)"]) + previousMinutesStudied };
    } else {
      result[date.toISOString().split("T")[0]] = { date: date, minutesStudied: parseFloat(d["Time (mins)"]) };
    }
  });
  return result;
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
  const { data: jpdbData, isLoading: jpdbIsLoading } = useQuery({ queryKey: ["jpdb"], queryFn: fetchJpdb });
  const { data: bunproData, isLoading: bunproIsLoading } = useQuery({ queryKey: ["bunpro"], queryFn: fetchBunpro });
  const { data: ankiData, isLoading: ankiDataIsLoading } = useQuery({ queryKey: ["anki"], queryFn: fetchAnki });
  const { data: immersionData, isLoading: immersionIsLoading } = useQuery({ queryKey: ["immersion"], queryFn: fetchImmersion });

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDateRange = useMemo(() => {
    const urlDateRange = getSearchParams().get("dateRange")?.trim();
    if (urlDateRange && DATE_RANGES.includes(urlDateRange)) return urlDateRange;
    return DATE_RANGES[0];
  }, [searchParams]);

  const dataSetsBySource = useMemo(() => {
    if (jpdbIsLoading || bunproIsLoading || ankiDataIsLoading || immersionIsLoading) return {};
    return {
      jpdb: standardizedCsvToDataset(jpdbData),
      bunpro: standardizedCsvToDataset(bunproData),
      anki: standardizedCsvToDataset(ankiData),
      immersion: standardizedCsvToDataset(immersionData)
    };
  }, [jpdbIsLoading, jpdbData, bunproIsLoading, bunproData, ankiDataIsLoading, ankiData, immersionIsLoading, immersionData]);

  const chartData = useMemo(() => {
    if (Object.keys(dataSetsBySource).length == 0) return {};
    return {
      labels: chartLablesByDateRange[selectedDateRange],
      datasets: [
        {
          label: "jpdb.io",
          data: datasetToPaddedArray(dataSetsBySource.jpdb, selectedDateRange).map(d => d.minutesStudied),
          borderColor: "#5dcc06",
          backgroundColor: "#5dcc06",
        },
        {
          label: "Bunpro",
          data: datasetToPaddedArray(dataSetsBySource.bunpro, selectedDateRange).map(d => d.minutesStudied),
          borderColor: "#ff9600",
          backgroundColor: "#ff9600",
        },
        {
          label: "Anki",
          data: datasetToPaddedArray(dataSetsBySource.anki, selectedDateRange).map(d => d.minutesStudied),
          borderColor: "#235390",
          backgroundColor: "#235390",
        },
        {
          label: "Immersion",
          data: datasetToPaddedArray(dataSetsBySource.immersion, selectedDateRange).map(d => d.minutesStudied),
          borderColor: "#cc348d",
          backgroundColor: "#cc348d",
        },
        {
          label: "Total",
          data: datasetToPaddedArray(
            [dataSetsBySource.jpdb, dataSetsBySource.bunpro, dataSetsBySource.anki, dataSetsBySource.immersion],
            selectedDateRange
          ).map(d => d.minutesStudied),
          borderColor: "#e5e5e5",
          backgroundColor: "#e5e5e5",
        }
      ],
    };
  }, [dataSetsBySource, selectedDateRange]);

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
            <button key={index} className="button" style={buttonStyles} onClick={() => setSearchParams({dateRange: dateRange})}>
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
