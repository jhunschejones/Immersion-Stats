import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import AboutPage from "../../components/AboutPage";

it("renders the about page header", async () => {
  render(<AboutPage />, {wrapper: BrowserRouter});
  await screen.findByText(/About/i);
});
