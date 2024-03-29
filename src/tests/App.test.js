import React from "react";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

window.scrollTo = jest.fn();

describe("App", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it("renders the App component and nav", async () => {
    render(<App/>);
    await screen.findByTestId(/site-title-nav-link/i);

    // there is one of each of these in the main nav and one in the dropdown menu
    const homeNavLinks = await screen.findAllByTestId(/home-nav-link/i);
    expect(homeNavLinks.length).toEqual(2);
    const activitiesNavLinks = await screen.findAllByTestId(/activities-nav-link/i);
    expect(activitiesNavLinks.length).toEqual(2);
    const weeklyProgressNavLinks = await screen.findAllByTestId(/weekly-progress-nav-link/i);
    expect(weeklyProgressNavLinks.length).toEqual(2);
    const reviewsNavLinks = await screen.findAllByTestId(/reviews-nav-link/i);
    expect(reviewsNavLinks.length).toEqual(2);
    const totalImmersionNavLinks = await screen.findAllByTestId(/total-immersion-nav-link/i);
    expect(totalImmersionNavLinks.length).toEqual(2);
    const trendsNavLinks = await screen.findAllByTestId(/trends-nav-link/i);
    expect(trendsNavLinks.length).toEqual(2);
  });

  it("opens the dropdown on click", async () => {
    const user = userEvent.setup();
    render(<App/>);
    await user.click(screen.getByTestId("hamburger-button"));
    await screen.getByText("Total Immersion", {selector: ".dropdown-nav.active .full-text"});
  });

  it("closes the dropdown on click away", async () => {
    const user = userEvent.setup();
    render(<App/>);

    // open the dropdown nav by clicking the hamburger button
    await user.click(screen.getByTestId("hamburger-button"));
    await screen.getByText("Total Immersion", {selector: ".dropdown-nav.active .full-text"});

    // close the dropdown nav by clicking away
    await user.click(screen.getByTestId("site-title-nav-link"));
    await screen.getByText("Total Immersion", {selector: ".dropdown-nav .full-text"});
  });

  it("closes the dropdown on close button", async () => {
    const user = userEvent.setup();
    render(<App/>);

    // open the dropdown nav by clicking the hamburger button
    await user.click(screen.getByTestId("hamburger-button"));
    await screen.getByText("Total Immersion", {selector: ".dropdown-nav.active .full-text"});

    // close the dropdown nav by clicking on the hamburger button again
    await user.click(screen.getByTestId("hamburger-button"));
    await screen.getByText("Total Immersion", {selector: ".dropdown-nav .full-text"});
  });
});
