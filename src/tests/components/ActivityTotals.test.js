import React from "react";
import {BrowserRouter} from "react-router-dom";
import {render, screen} from "@testing-library/react";
import ActivityTotals from "../../components/ActivityTotals"
import fs from "fs";

describe("ActivityTotals", () => {
  beforeEach(() => {
    const data = fs.readFileSync("src/tests/fixtures/TimeSheet.csv", { encoding: "utf-8"});
    global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
      text: () => Promise.resolve(data)
    }));
  });

  it("should render expected totals data", async () => {
    render(<ActivityTotals/>, {wrapper: BrowserRouter});
    await screen.findByText(/Podcasts, passive/i);
    await screen.findByText(/Satori Reader/i);
  });
});
