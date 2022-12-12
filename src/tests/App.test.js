import React from "react";
import {render, screen} from "@testing-library/react";
import App from "../App";

it("renders the App component and nav", async () => {
  render(<App/>);
  await screen.findByTestId(/site-title-nav-link/i);
  await screen.findByTestId(/home-nav-link/i);
  await screen.findByTestId(/activities-nav-link/i);
  await screen.findByTestId(/weekly-progress-nav-link/i);
  await screen.findByTestId(/anki-reviews-nav-link/i);
  await screen.findByTestId(/total-immersion-nav-link/i);
});
