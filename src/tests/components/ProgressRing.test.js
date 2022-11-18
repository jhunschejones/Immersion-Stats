import React from "react";
import {render, screen} from "@testing-library/react";
import ProgressRing from "../../components/ProgressRing";

it("should render a progress ring with default text", async () => {
  render(
    <ProgressRing
      stroke={8}
      radius={85}
      progress={85}
      title={"Passive Listening"}
    />
  );
  await screen.findByTestId("progress-ring");
  await screen.findByText(/85%/i); // default progress text
});

it("should render a progress ring with provided text and title", async () => {
  render(
    <ProgressRing
      stroke={8}
      radius={85}
      progress={85}
      title={"Passive Listening"}
      progressText={"2:00"}
    />
  );
  await screen.findByTestId("progress-ring");
  await screen.findByText(/Passive Listening/i);
  await screen.findByText(/2:00/i);
});

it("should render a full progress ring when progress is more than 100%", async () => {
  render(
    <ProgressRing
      stroke={8}
      radius={85}
      progress={120}
      title={"Passive Listening"}
    />
  );
  await screen.findByText(/120%/i); // default progress text
  const ring = await screen.findByTestId("progress-ring");
  const ringSvg = ring.childNodes[0].childNodes[0];
  expect(ringSvg.getAttribute("data-full")).toEqual("true");
});

it("should render a partial progress ring when progress is less than 100%", async () => {
  render(
    <ProgressRing
      stroke={8}
      radius={85}
      progress={85}
      title={"Passive Listening"}
    />
  );
  await screen.findByText(/85%/i); // default progress text
  const ring = await screen.findByTestId("progress-ring");
  const ringSvg = ring.childNodes[0].childNodes[0];
  expect(ringSvg.getAttribute("data-full")).toEqual("false");
});
