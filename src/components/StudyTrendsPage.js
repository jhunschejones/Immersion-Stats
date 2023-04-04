import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { useState, useMemo, useEffect } from "react";
import { useQuery } from "react-query";
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

// const twoYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 2));
// const threeMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 3));
const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));
const chartDateRange = getDatesBetween(oneMonthAgo, new Date());

/**
 * A helper method to pad a `dataSet` over a given `dateRange` filling in `0`s
 * for missing days and summing days with multiple entries.
 *
 * @param {array<{ date: Date, minutesStudied: Number }>} dataSet - the data set to pad
 * @param {array<Date>} dateRange - the date range to pad the `dataSet` over
 * @returns {array<{ date: Date, minutesStudied: Number }>}
 */
const padDataSetForDateRange = (dataSet, dateRange = chartDateRange) => {
  return dateRange.map((date) => {
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
const standardizedCsvToPaddedDataSet = (csvData) => {
  const parsedCsv = parseCsvFile(csvData)
    .map((d) => { return { date: new Date(d["Date"]), minutesStudied: parseFloat(d["Time (mins)"]) }; })
    .sort((a, b) => a.date - b.date);

  return padDataSetForDateRange(parsedCsv);
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

export default function StudyTrendsPage () {
  const [chartData, setChartData] = useState({});
  const jpdbResponse = useQuery({ queryKey: ["jpdb"], queryFn: fetchJpdb });
  const bunproResponse = useQuery({ queryKey: ["bunpro"], queryFn: fetchBunpro });
  const ankiResponse = useQuery({ queryKey: ["anki"], queryFn: fetchAnki });
  const immersionResponse = useQuery({ queryKey: ["immersion"], queryFn: fetchImmersion });

  const paddedJpdbData = useMemo(() => {
    if (jpdbResponse.isLoading) return [];
    return standardizedCsvToPaddedDataSet(jpdbResponse.data);
  }, [jpdbResponse.isLoading, jpdbResponse.data]);

  const paddedBunproData = useMemo(() => {
    if (bunproResponse.isLoading) return [];
    return standardizedCsvToPaddedDataSet(bunproResponse.data);
  }, [bunproResponse.isLoading, bunproResponse.data]);

  const paddedAnkiData = useMemo(() => {
    if (ankiResponse.isLoading) return [];
    return standardizedCsvToPaddedDataSet(ankiResponse.data);
  }, [ankiResponse.isLoading, ankiResponse.data]);

  const paddedImmersionData = useMemo(() => {
    if (immersionResponse.isLoading) return [];
    return standardizedCsvToPaddedDataSet(immersionResponse.data);
  }, [immersionResponse.isLoading, immersionResponse.data]);

  const paddedAllTimeData = useMemo(() => {
    if (paddedJpdbData.length == 0 || paddedBunproData.length == 0 || paddedAnkiData.length == 0 || paddedImmersionData.length == 0) {
      return [];
    }
    return padDataSetForDateRange(paddedJpdbData.concat(paddedBunproData).concat(paddedAnkiData).concat(paddedImmersionData));
  }, [paddedJpdbData, paddedBunproData, paddedAnkiData, paddedImmersionData]);

  useEffect(() => {
    if (paddedJpdbData.length == 0 || paddedBunproData.length == 0 || paddedAnkiData.length == 0 || paddedImmersionData.length == 0 || paddedAllTimeData.length == 0) {
      return setChartData({});
    }

    setChartData({
      labels: chartDateRange.map(d => d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })),
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
          borderColor: "#ce82ff",
          backgroundColor: "#ce82ff",
        },
        {
          label: "All Study Time",
          data: paddedAllTimeData.map(d => d.minutesStudied),
          borderColor: "#e5e5e5",
          backgroundColor: "#e5e5e5",
        }
      ],
    });
  }, [paddedJpdbData, paddedBunproData, paddedAnkiData, paddedImmersionData, paddedAllTimeData]);

  return(
    <div style={{maxHeight: "calc(100vh - 220px)", padding: "0 12px 12px 12px", display: "flex", flexDirection: "column", alignItems: "center"}}>
      <h1 style={{
        margin: "4px 0 24px 0",
        padding: "0",
        fontSize: "28px",
        fontWeight: "600"
      }}>Study Trends</h1>
      {
        !chartData?.datasets ?
          <p style={{textAlign: "center"}}>Loading...</p> :
          <Line options={chartOptions} data={chartData} />
      }
    </div>
  );
}
