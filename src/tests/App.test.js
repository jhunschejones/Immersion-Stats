import React from "react";
import {render, screen} from "@testing-library/react";
import App from "../App";

it("renders the App component and nav", async () => {
  render(<App/>);
  await screen.findByTestId(/site-title-nav-link/i);
  await screen.findByTestId(/home-nav-link/i);
  await screen.findByTestId(/activity-totals-nav-link/i);
  await screen.findByTestId(/weekly-progress-nav-link/i);
  await screen.findByTestId(/anki-study-time-nav-link/i);
});
