import React from "react";
import {render, screen} from "@testing-library/react";
import App from "../App"

it("renders the App component and nav", async () => {
  render(<App/>);
  await screen.findByText(/Immersion Stats/i);
});
