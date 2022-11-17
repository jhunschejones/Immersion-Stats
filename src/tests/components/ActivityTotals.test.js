import React from "react";
import {BrowserRouter} from "react-router-dom";
import {render, screen} from "@testing-library/react";
import ActivityTotals from "../../components/ActivityTotals"
import fs from "fs";

let originalFetch;

beforeEach(() => {
  originalFetch = global.fetch;
  fs.readFile("src/tests/fixtures/Totals.csv", "utf8", (_error, data) => {
    global.fetch = jest.fn(() => Promise.resolve({
      text: () => Promise.resolve({data})
    }));
  });
});

afterEach(() => {
  global.fetch = originalFetch;
});

it("should render expected totals data", async () => {
  render(<ActivityTotals/>, {wrapper: BrowserRouter});
  await screen.findByText(/Podcasts, passive/i);
  await screen.findByText(/Satori Reader/i);
});
