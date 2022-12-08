import React from "react";
import {BrowserRouter} from "react-router-dom";
import {render, screen} from "@testing-library/react";
import AnkiStudyTime from "../../components/AnkiStudyTime";
import fs from "fs";

describe("AnkiStudyTime", () => {
  beforeEach(() => {
    const data = fs.readFileSync("src/tests/fixtures/Anki.csv", {encoding: "utf-8"});
    window.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
      text: () => Promise.resolve(data)
    }));
  });

  it("should render expected totals data", async () => {
    render(<AnkiStudyTime/>, {wrapper: BrowserRouter});
    await screen.findByText(/Anki Study Time/i);
    await screen.findByText(/11\/20\/2022, 60 minutes/i); // one of the expected heatmap cells
    await screen.findByText(/636hrs 10mins/i); // total anki time
  });
});
