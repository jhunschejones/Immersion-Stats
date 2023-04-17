import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import fs from "fs";
import { ImmersionContext } from "../../providers/ImmersionProvider";
import { AnkiContext } from "../../providers/AnkiProvider";
import { JpdbContext } from "../../providers/JpdbProvider";
import { BunproContenxt } from "../../providers/BunproProvider";
import StudyTrendsPage, { standardizedCsvToDataset, datasetToPaddedArray, getDatesBetween } from "../../components/StudyTrendsPage";

// https://github.com/reactchartjs/react-chartjs-2/issues/155
// https://github.com/reactchartjs/react-chartjs-2/blob/master/test/setup.js
// https://www.npmjs.com/package/canvas
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

describe("StudyTrendsPage", () => {
  it("renders the study trends chart", async () => {
    const immersionData = fs.readFileSync("src/tests/fixtures/TimeSheet.csv", {encoding: "utf-8"});
    const ankiData = fs.readFileSync("src/tests/fixtures/Anki.csv", {encoding: "utf-8"});
    const jpdbData = fs.readFileSync("src/tests/fixtures/Jpdb.csv", {encoding: "utf-8"});
    const bunproData = fs.readFileSync("src/tests/fixtures/Bunpro.csv", {encoding: "utf-8"});

    render(
      <ImmersionContext.Provider value={{immersionData, immersionIsLoading: false}}>
        <AnkiContext.Provider value={{ankiData, ankiIsLoading: false}}>
          <JpdbContext.Provider value={{jpdbData, jpdbIsLoading: false}}>
            <BunproContenxt.Provider value={{bunproData, bunproIsLoading: false}}>
              <BrowserRouter>
                <StudyTrendsPage/>
              </BrowserRouter>
            </BunproContenxt.Provider>
          </JpdbContext.Provider>
        </AnkiContext.Provider>
      </ImmersionContext.Provider>
    );
    await screen.findByText(/Study Trends/i); // page header
    await screen.findAllByRole("img"); // chart canvas element
  });
});

describe("standardizedCsvToDataset", () => {
  it("returns the expected object for csv with duplicate date entries", () => {
    const expectedResult = {
      "2022-11-18": {
        "date": new Date("2022-11-18"),
        "minutesStudied": 20,
      },
      "2022-11-20": {
        "date": new Date("2022-11-20"),
        "minutesStudied": 60.32,
      },
      "2022-11-21": {
        "date": new Date("2022-11-21"),
        "minutesStudied": 64.88,
      },
      // 2 dates have been combined down into 1 entry here
      "2022-11-22": {
        "date": new Date("2022-11-22"),
        "minutesStudied": 78,
      },
      "2022-11-23": {
        "date": new Date("2022-11-23"),
        "minutesStudied": 68,
      },
    };
    const result = standardizedCsvToDataset(fs.readFileSync("src/tests/fixtures/DuplicateDates.csv", {encoding: "utf-8"}));
    expect(result).toEqual(expectedResult);
  });
});

describe("datasetToPaddedArray", () => {
  it("correctly pads missing days in dataset", () => {
    const dateRange = getDatesBetween(new Date("2022-11-18"), new Date("2022-11-23"));
    const dataSet = standardizedCsvToDataset(fs.readFileSync("src/tests/fixtures/DuplicateDates.csv", {encoding: "utf-8"}));
    const expectedResult = [
      {
        "date": new Date("2022-11-18"),
        "minutesStudied": 20,
      },
      // Missing date was replaced with a 0 here
      {
        "date": new Date("2022-11-19"),
        "minutesStudied": 0,
      },
      {
        "date": new Date("2022-11-20"),
        "minutesStudied": 60.32,
      },
      {
        "date": new Date("2022-11-21"),
        "minutesStudied": 64.88,
      },
      {
        "date": new Date("2022-11-22"),
        "minutesStudied": 78,
      },
      {
        "date": new Date("2022-11-23"),
        "minutesStudied": 68,
      },
    ]
    const result = datasetToPaddedArray(dataSet, dateRange);
    expect(result).toEqual(expectedResult);
  });
});
