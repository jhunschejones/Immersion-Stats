import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { Line } from "react-chartjs-2";
import { useContext, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getSearchParams } from "../utils/urls";
import { parseCsvFile } from "../utils/parsing";
import { JpdbContext } from "../providers/JpdbProvider";
import { BunproContenxt } from "../providers/BunproProvider";
import { AnkiContext } from "../providers/AnkiProvider";
import { ImmersionContext } from "../providers/ImmersionProvider";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, annotationPlugin);


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
 * A helper method to transform a `dataset` or several datasets into an array of chart data for a given `dateRange`,
 * filling in `0`s for missing days.
 *
 * @param {{} | []} dataset - a single dataset or an array of datasets
 * @param {string | array<Date>} dateRange
 * @returns {array<{ "Date": string, "Time (mins)": string }>}
 */
export const datasetToPaddedArray = (dataset, dateRange) => {
  const datasetArray = Array(dataset).flat(); // support a single dataset or an array of datasets
  const range = (typeof dateRange == "string") ? datesForDateRangeString(dateRange) : dateRange;

  return range.map((date) => {
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
export const standardizedCsvToDataset = (csvData) => {
  const result = {};
  parseCsvFile(csvData).forEach((d) => {
    const date = new Date(d["Date"]);
    const dateStringKey = date.toISOString().split("T")[0];
    if (result[dateStringKey]) {
      const previousMinutesStudied = result[dateStringKey].minutesStudied;
      result[dateStringKey] = { date: date, minutesStudied: parseFloat(d["Time (mins)"]) + previousMinutesStudied };
    } else {
      result[dateStringKey] = { date: date, minutesStudied: parseFloat(d["Time (mins)"]) };
    }
  });
  return result;
};

const TOTALS_INDEX_IN_CHART_CTX = -1;

// charts.js helper method to parse the chart `ctx` object and return an average value for the "totals" dataset
const totalsAvgFromChartCtx = (chartCtx) => {
  if (!chartCtx) return undefined;
  try {
    const values = chartCtx.chart.data.datasets.at(TOTALS_INDEX_IN_CHART_CTX).data;
    return values.reduce((a, b) => a + b, 0) / values.length;
  } catch (error) {
    return undefined;
  }
};

// charts.js helper method to parse the chart `ctx` object and return a boolean whether the "totals" line his hidden
const totalsHiddenFromChartCtx = (chartCtx) => {
  try {
    return chartCtx.chart.legend.legendItems.at(TOTALS_INDEX_IN_CHART_CTX).hidden;
  } catch (error) {
    return false;
  }
};

const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    annotation: {
      animation: false,
      annotations: {
        averageTotal: {
          display: false
        }
      }
    }
  },
  scales: {
    y: {
      title: {
        display: true,
        text: "Study minutes"
      }
    }
  }
};

const chartOptionsWithAverageAnnotation = {
  ...defaultChartOptions,
  plugins: {
    ...defaultChartOptions.plugins,
    annotation: {
      ...defaultChartOptions.plugins.annotation,
      annotations: {
        ...defaultChartOptions.plugins.annotation.annotations,
        averageTotal: {
          type: "line",
          scaleID: "y",
          value: (ctx) => totalsAvgFromChartCtx(ctx) ?? 0,
          display: (ctx) => !totalsHiddenFromChartCtx(ctx),
          label: {
            display: true,
            content: (ctx) => `Avg: ${totalsAvgFromChartCtx(ctx)?.toFixed(0)} mins/day`,
            backgroundColor: "#e5e5e5",
            color: "#777",
            backgroundShadowColor: "#b7b7b7",
            shadowOffsetX: 3,
            shadowOffsetY: 3,
            shadowBlur: 4,
          },
          borderColor: "#e5e5e5",
          borderDash: [6, 6],
          borderWidth: 3,
          drawTime: "afterDraw",
          shadowOffsetX: 3,
          shadowOffsetY: 3,
          shadowBlur: 4,
          borderShadowColor: "#b7b7b7",
        }
      }
    }
  }
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

  const [showAvg, setShowAvg] = useState(false);
  const chartOptions = useMemo(() => showAvg ? chartOptionsWithAverageAnnotation : defaultChartOptions, [showAvg]);

  const dataSetsBySource = useMemo(() => {
    if (jpdbIsLoading || bunproIsLoading || ankiDataIsLoading || immersionIsLoading) return {};
    if ([jpdbData, bunproData, ankiData, immersionData].includes(undefined)) return {};
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
      <h1
        style={{margin: "4px 0 18px 0", padding: "0", fontSize: "28px", fontWeight: "600"}}
        onClick={() => setShowAvg(s => !s)}
      >
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