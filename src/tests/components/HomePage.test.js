import React from "react";
import {BrowserRouter} from "react-router-dom";
import {render, screen} from "@testing-library/react";
import HomePage from "../../components/HomePage"

it("renders the welcome header", () => {
  render(<HomePage />, {wrapper: BrowserRouter});
  expect(screen.getByText(/Welcome!/i)).toBeInTheDocument();
});
