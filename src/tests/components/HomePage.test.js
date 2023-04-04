import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import HomePage from "../../components/HomePage";

it("renders the welcome header", async () => {
  render(<HomePage />, {wrapper: BrowserRouter});
  await screen.findByText(/Welcome!/i);
});

it("renders the expected buttons", async () => {
  render(<HomePage />, {wrapper: BrowserRouter});
  await screen.findByTestId("totals-button");
  await screen.findByTestId("trends-button");
  await screen.findByTestId("weekly-button");
  await screen.findByTestId("activities-button");
  await screen.findByTestId("reviews-button");
});
