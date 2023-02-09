import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import HeatmapsPage from "../../components/ReviewsPage";

it("renders the expected header", async () => {
  render(<HeatmapsPage />, {wrapper: BrowserRouter});
  await screen.findByText(/My Reviews/i);
});

it("renders the expected buttons", async () => {
  render(<HeatmapsPage />, {wrapper: BrowserRouter});
  await screen.findByText(/Anki reviews/i);
  await screen.findByText(/jpdb.io reviews/i);
});
