import React from "react";
import {BrowserRouter} from "react-router-dom";
import {render, screen} from "@testing-library/react";
import HomePage from "../../components/HomePage"

it("renders the welcome header", async () => {
  render(<HomePage />, {wrapper: BrowserRouter});
  await screen.findByText(/Welcome!/i);
});
