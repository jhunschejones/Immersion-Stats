import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { Line } from "react-chartjs-2";

import { useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getSearchParams } from "../utils/urls";
import { parseCsvFile } from "../utils/parsing";
import { oneMonthDateRange, threeMonthsDateRange, oneYearDateRange, tenDaysDateRange, twoYearsDateRange, threeYearsDateRange } from "../utils/date";
import { JpdbContext } from "../providers/JpdbProvider";
import { BunproContenxt } from "../providers/BunproProvider";
import { AnkiContext } from "../providers/AnkiProvider";
import { ImmersionContext } from "../providers/ImmersionProvider";
import useDatasetIndexFromHotKeys from "../hooks/use-dataset-index-from-hot-keys";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, annotationPlugin);


const DATE_RANGES = ["10D", "1M", "3M", "1Y", "2Y", "3Y"];
const HIDDEN_DATE_RANGES = ["2Y", "3Y"];
const DATE_RANGES_TO_SHOW = DATE_RANGES.filter((dateRange) => !HIDDEN_DATE_RANGES.includes(dateRange));

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
  if (dateRange == "2Y") {
    return twoYearsDateRange;
  }
  if (dateRange == "3Y") {
    return threeYearsDateRange;
  }
  // default date range is 10D
  return tenDaysDateRange;
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

  const { datasetIndex: datasetIndexToShowAverageFor } = useDatasetIndexFromHotKeys();
  const chartOptions = useMemo(() => {
    if (datasetIndexToShowAverageFor == undefined) return defaultChartOptions;
    return chartOptionsWithAverageAnnotation(datasetIndexToShowAverageFor);
  }, [datasetIndexToShowAverageFor]);

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
        {DATE_RANGES_TO_SHOW.map((dateRange, index) => {
          const buttonStyles = { backgroundColor: "#1baff6", borderColor: "#1a99d6", margin: "0 2px", padding: "5px 10px 3px 10px" };
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
