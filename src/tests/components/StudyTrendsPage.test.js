import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import fs from "fs";
import { ImmersionContext } from "../../providers/ImmersionProvider";
import { AnkiContext } from "../../providers/AnkiProvider";
import { JpdbContext } from "../../providers/JpdbProvider";
import { BunproContenxt } from "../../providers/BunproProvider";
import StudyTrendsPage from "../../components/StudyTrendsPage";

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
