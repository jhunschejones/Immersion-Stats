import React from "react";
import {BrowserRouter} from "react-router-dom";
import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import WeeklyProgress from "../../components/WeeklyProgress"
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

it("should render expected weekly progress data", async () => {
  render(<WeeklyProgress/>, {wrapper: BrowserRouter});
  await screen.findByText(/Passive Listening/i);
  await screen.findByText(/Active Reading/i);
});
