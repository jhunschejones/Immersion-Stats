import React from "react";
import {BrowserRouter} from "react-router-dom";
import {render, screen} from "@testing-library/react";
import TotalImmersion from "../../components/TotalImmersion";
import fs from "fs";

describe("TotalImmersion", () => {
  beforeEach(() => {
    const data = fs.readFileSync("src/tests/fixtures/Totals.csv", {encoding: "utf-8"});
    window.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
      text: () => Promise.resolve(data)
    }));
  });

  it("should render expected totals data", async () => {
    render(<TotalImmersion/>, {wrapper: BrowserRouter});
    await screen.findByText(/Total Immersion/i);

    await screen.findByText(/Active Immersion/i);
    await screen.findByText(/140:57/i);

    await screen.findByText(/Passive Immersion/i);
    await screen.findByText(/258:13/i);

    await screen.findByText(/All Immersion/i);
    await screen.findByText(/399:10/i);
  });
});
