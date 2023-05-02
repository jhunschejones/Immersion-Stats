import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import JpdbReviews from "../../components/JpdbReviews";
import fs from "fs";
import JpdbProvider from "../../providers/JpdbProvider";

describe("JpdbReviews", () => {
  beforeEach(() => {
    const data = fs.readFileSync("src/tests/fixtures/Jpdb.csv", {encoding: "utf-8"});
    window.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
      text: () => Promise.resolve(data)
    }));
  });

  it("should render expected totals data", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <JpdbProvider>
          <BrowserRouter>
            <JpdbReviews/>
          </BrowserRouter>
        </JpdbProvider>
      </QueryClientProvider>
    );
    await screen.findByText(/jpdb.io Reviews/i);
    await screen.findByText(/2\/4\/2023, 75 minutes/i); // one of the expected heatmap cells
    await screen.findByText(/80hrs 58mins/i); // total study time shown in time label
  });

  it("shows time label for a specific day when clicked", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();
    const {container} = render(
      <QueryClientProvider client={queryClient}>
        <JpdbProvider>
          <BrowserRouter>
            <JpdbReviews/>
          </BrowserRouter>
        </JpdbProvider>
      </QueryClientProvider>
    );

    // default state shows total study time and days studied
    await screen.findByText(/80hrs 58mins/i); // total study time shown in time label
    await screen.findByText(/89 days/i); // total study days shown in day label

    // click on a day to see the date and time studied for that day
    await user.click(container.getElementsByClassName("color-scale-3")[0]);
    await screen.findByText(/2\/28\/2023/i, {selector: "[data-testid='day-label']"}); // day label with one days date
    await screen.findByText(/170 minutes/i, {selector: "[data-testid='time-label']"}); // time label with one days time

    // click on the body
    await user.click(container.getElementsByClassName("ReviewsHeatmap")[0]);
    await screen.findByText(/80hrs 58mins/i); // total study time shown in time label
    await screen.findByText(/89 days/i); // total study days shown in day label
  });
});
