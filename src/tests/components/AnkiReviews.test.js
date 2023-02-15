import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import AnkiReviews from "../../components/AnkiReviews";
import fs from "fs";

describe("AnkiReviews", () => {
  beforeEach(() => {
    const data = fs.readFileSync("src/tests/fixtures/Anki.csv", {encoding: "utf-8"});
    window.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
      text: () => Promise.resolve(data)
    }));
  });

  it("should render expected totals data", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AnkiReviews/>
        </BrowserRouter>
      </QueryClientProvider>
    );
    await screen.findByText(/Anki Reviews/i);
    await screen.findByText(/11\/20\/2022, 60 minutes/i); // one of the expected heatmap cells
    await screen.findByText(/636hrs 10mins/i); // total anki time shown in time label
  });

  it("shows time label for a specific day when clicked", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient();
    const {container} = render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AnkiReviews/>
        </BrowserRouter>
      </QueryClientProvider>
    );

    // default state shows total anki time and days studied
    await screen.findByText(/636hrs 10mins/i); // total anki time shown in time label
    await screen.findByText(/747 days/i); // total anki days shown in day label

    // click on a day to see the date and time studied for that day
    await user.click(container.getElementsByClassName("color-scale-2")[0]);
    await screen.findByText(/09\/10\/2020/i, {selector: "[data-testid='day-label']"}); // day label with one days date
    await screen.findByText(/45 minutes/i, {selector: "[data-testid='time-label']"}); // time label with one days time

    // click on the body
    await user.click(container.getElementsByClassName("ReviewsHeatmap")[0]);
    await screen.findByText(/636hrs 10mins/i); // total anki time shown in time label
    await screen.findByText(/747 days/i); // total anki days shown in day label
  });
});
