import { titleCase } from "../../utils/strings";

it("returns the expected casing for single word strings", () => {
  expect(titleCase("hello")).toEqual("Hello");
  expect(titleCase("HELLO")).toEqual("Hello");
  expect(titleCase("Hello")).toEqual("Hello");
  expect(titleCase("HeLLo")).toEqual("Hello");
});

it("returns the expected casing for multi word strings", () => {
  expect(titleCase("react test passes")).toEqual("React Test Passes");
  expect(titleCase("REACT TEST PASSES")).toEqual("React Test Passes");
  expect(titleCase("React Test Passes")).toEqual("React Test Passes");
  expect(titleCase("reAct tEST paSSes")).toEqual("React Test Passes");
});
