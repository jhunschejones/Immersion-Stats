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
import { useHotkeys } from "react-hotkeys-hook";

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

// charts.js helper method to parse the chart `ctx` object and return an average value for the given dataset `index`
const avgFromChartCtx = (chartCtx, index) => {
  if (!chartCtx) return undefined;
  try {
    const values = chartCtx.chart.data.datasets.at(index).data;
    return values.reduce((a, b) => a + b, 0) / values.length;
  } catch (error) {
    return undefined;
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

const chartOptionsWithAverageAnnotation = (index) => {
  return {
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
            value: (ctx) => avgFromChartCtx(ctx, index) ?? 0,
            display: (ctx) => !ctx.chart.legend.legendItems.at(index).hidden,
            label: {
              display: true,
              content: (ctx) => `Avg: ${avgFromChartCtx(ctx, index)?.toFixed(0)} mins/day`,
              backgroundColor: (ctx) => ctx.chart.data.datasets.at(index).borderColor,
              color: (ctx) => {
                // show gray text for gray background
                if (ctx.chart.data.datasets.at(index).borderColor == "#e5e5e5") {
                  return "#777";
                }
                // show white text for all other backgrounds
                return "#FFF";
              },
              backgroundShadowColor: "#b7b7b7",
              shadowOffsetX: 3,
              shadowOffsetY: 3,
              shadowBlur: 4,
            },
            borderColor: (ctx) => ctx.chart.data.datasets.at(index).borderColor,
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

  const [datasetIndexToShowAverageFor, setDatasetIndexToShowAverageFor] = useState(undefined);
  const chartOptions = useMemo(() => {
    if (datasetIndexToShowAverageFor == undefined) return defaultChartOptions;
    return chartOptionsWithAverageAnnotation(datasetIndexToShowAverageFor);
  }, [datasetIndexToShowAverageFor]);

  // press `1` to show the average for the dataset at index `0`, the `jpdb.io` dataset
  useHotkeys("1", () => setDatasetIndexToShowAverageFor(s => s == 0 ? undefined : 0), []);
  // press `1` to show the average for the dataset at index `1`, the `Bunpro` dataset
  useHotkeys("2", () => setDatasetIndexToShowAverageFor(s => s == 1 ? undefined : 1), []);
  // press `1` to show the average for the dataset at index `2`, the `Anki` dataset
  useHotkeys("3", () => setDatasetIndexToShowAverageFor(s => s == 2 ? undefined : 2), []);
  // press `1` to show the average for the dataset at index `3`, the `Immersion` dataset
  useHotkeys("4", () => setDatasetIndexToShowAverageFor(s => s == 3 ? undefined : 3), []);
  // press `5` to show the average for the dataset at index `4`, the `totals` dataset
  useHotkeys("5", () => setDatasetIndexToShowAverageFor(s => s == 4 ? undefined : 4), []);
  // press `backspace` to remove any average lines being shown
  useHotkeys("backspace", () => setDatasetIndexToShowAverageFor(undefined), []);

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
