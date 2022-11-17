import React from "react";
import {BrowserRouter} from "react-router-dom";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

it("renders expected weekly progress data", async () => {
  const thisWeeksProgress = ["1:24", "0:00", "12:38"];
  render(<WeeklyProgress/>, {wrapper: BrowserRouter});

  await screen.findByText(/Passive Listening/i);
  await screen.findByText(/Active Reading/i);

  const progress = await (await screen.findAllByTestId("progress-text")).map(e => e?.textContent);
  expect(progress).toEqual(thisWeeksProgress);
});

it("allows user to see last weeks progress", async () => {
  const lastWeekProgress = ["2:29", "0:00", "19:28"];
  const user = userEvent.setup()
  render(<WeeklyProgress/>, {wrapper: BrowserRouter});

  await screen.findByText(/Passive Listening/i);

  await user.click(screen.getByRole("button", {name: /Last week/i}))
  const progress = await (await screen.findAllByTestId("progress-text")).map(e => e?.textContent);
  expect(progress).toEqual(lastWeekProgress);
});

it("allows user to see two weeks progress", async () => {
  const twoWeekProgress = ["1:59", "0:45", "21:01"];
  const user = userEvent.setup()
  render(<WeeklyProgress/>, {wrapper: BrowserRouter});

  await screen.findByText(/Passive Listening/i);

  await user.click(screen.getByRole("button", {name: /Two weeks/i}))
  const progress = await (await screen.findAllByTestId("progress-text")).map(e => e?.textContent);
  expect(progress).toEqual(twoWeekProgress);
});
