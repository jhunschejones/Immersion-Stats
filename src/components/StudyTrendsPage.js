import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getSearchParams } from "../utils/urls";
import { parseCsvFile } from "../utils/parsing";
import { JpdbContext } from "../providers/JpdbProvider";
import { BunproContenxt } from "../providers/BunproProvider";
import { AnkiContext } from "../providers/AnkiProvider";
import { ImmersionContext } from "../providers/ImmersionProvider";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);


/**
 * Build an array of all dates between two dates
 *
 * @param {Date} startDate - the start of the date range
 * @param {Date} endDate - the end of the date range
 * @returns {array<Date>}
 */
export const getDatesBetween = (startDate, endDate) => {
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

const datesForDateRangeString = (dateRange) => {
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
  chartLablesByDateRange[dateRange] = datesForDateRangeString(dateRange).map(d => d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", weekday: "short" }));
});


/**
 * A helper method to pad a `dataSet` over a given `dateRange` filling in `0`s
 * for missing days and summing days with multiple entries.
 *
 * @param {array<{ date: Date, minutesStudied: Number }>} dataSet - the data set to pad
 * @param {string} dateRange - the date range to pad the `dataSet` over
 * @returns {array<{ date: Date, minutesStudied: Number }>}
 */
const padDataSetForDateRange = (dataSet, dateRange) => {
  return datesForDateRangeString(dateRange).map((date) => {
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
  const {jpdbData, jpdbIsLoading} = useContext(JpdbContext);
  const {bunproData, bunproIsLoading} = useContext(BunproContenxt);
  const {ankiData, ankiDataIsLoading} = useContext(AnkiContext);
  const {immersionData, immersionIsLoading} = useContext(ImmersionContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDateRange = useMemo(() => {
    const urlDateRange = getSearchParams().get("dateRange")?.trim();
    if (urlDateRange && DATE_RANGES.includes(urlDateRange)) return urlDateRange;
    return DATE_RANGES[0];
  }, [searchParams]);

  const paddedData = useMemo(() => {
    if (jpdbIsLoading || bunproIsLoading || ankiDataIsLoading || immersionIsLoading || [jpdbData, bunproData, ankiData, immersionData].includes(undefined)) return {};

    const result = {
      paddedJpdbData: standardizedCsvToPaddedDataSet(jpdbData, selectedDateRange),
      paddedBunproData: standardizedCsvToPaddedDataSet(bunproData, selectedDateRange),
      paddedAnkiData: standardizedCsvToPaddedDataSet(ankiData, selectedDateRange),
      paddedImmersionData: standardizedCsvToPaddedDataSet(immersionData, selectedDateRange),
    };

    result["paddedAllTimeData"] = padDataSetForDateRange(
      result.paddedJpdbData.concat(result.paddedBunproData).concat(result.paddedAnkiData).concat(result.paddedImmersionData), selectedDateRange
    );

    return result;
  }, [jpdbIsLoading, jpdbData, bunproIsLoading, bunproData, ankiDataIsLoading, ankiData, immersionIsLoading, immersionData, selectedDateRange]);

  const chartData = useMemo(() => {
    if (Object.keys(paddedData).length == 0) return {};
    return {
      labels: chartLablesByDateRange[selectedDateRange],
      datasets: [
        {
          label: "jpdb.io",
          data: paddedData.paddedJpdbData.map(d => d.minutesStudied),
          borderColor: "#5dcc06",
          backgroundColor: "#5dcc06",
        },
        {
          label: "Bunpro",
          data: paddedData.paddedBunproData.map(d => d.minutesStudied),
          borderColor: "#ff9600",
          backgroundColor: "#ff9600",
        },
        {
          label: "Anki",
          data: paddedData.paddedAnkiData.map(d => d.minutesStudied),
          borderColor: "#235390",
          backgroundColor: "#235390",
        },
        {
          label: "Immersion",
          data: paddedData.paddedImmersionData.map(d => d.minutesStudied),
          borderColor: "#cc348d",
          backgroundColor: "#cc348d",
        },
        {
          label: "Total",
          data: paddedData.paddedAllTimeData.map(d => d.minutesStudied),
          borderColor: "#e5e5e5",
          backgroundColor: "#e5e5e5",
        }
      ],
    };
  }, [paddedData, selectedDateRange]);

  return(
    <div style={{maxHeight: "calc(100vh - 220px)", padding: "0 12px 12px 12px", display: "flex", flexDirection: "column", alignItems: "center"}}>
      <h1 style={{margin: "4px 0 18px 0", padding: "0", fontSize: "28px", fontWeight: "600"}}>
        Study Trends
      </h1>
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
