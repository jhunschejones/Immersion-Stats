import React from "react";
import {BrowserRouter} from "react-router-dom";
import userEvent from "@testing-library/user-event";
import {render, screen} from "@testing-library/react";
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
    render(<AnkiReviews/>, {wrapper: BrowserRouter});
    await screen.findByText(/Anki Reviews/i);
    await screen.findByText(/11\/20\/2022, 60 minutes/i); // one of the expected heatmap cells
    await screen.findByText(/636hrs 10mins/i); // total anki time shown in time label
  });

  it("shows time label for a specific day when clicked", async () => {
    const user = userEvent.setup();
    const {container} = render(<AnkiReviews/>, {wrapper: BrowserRouter});
    await screen.findByText(/636hrs 10mins/i); // total anki time shown in time label

    await user.click(container.getElementsByClassName("color-scale-2")[0]);
    await screen.findByText(/09\/10\/2020, 45 minutes/i, {selector: ".time-label"}); // time label with one days time

    // click on the body
    await user.click(container.getElementsByClassName("AnkiTotals")[0]);
    await screen.findByText(/636hrs 10mins/i); // total anki time shown in time label
  });
});
