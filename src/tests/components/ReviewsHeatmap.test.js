import { colorScaleClassFromValue } from "../../components/ReviewsHeatmap";

describe("colorScaleClassFromValue", () => {
  it("returns 'color-empty' when there is no value", () => {
    expect(colorScaleClassFromValue(undefined, 1, 2)).toEqual("color-empty");
  });

  it("returns 'color-empty' when there is no highestValue", () => {
    expect(colorScaleClassFromValue(1, 1, undefined)).toEqual("color-empty");
  });

  it("returns 'color-empty' when there is no lowestValue", () => {
    expect(colorScaleClassFromValue(1, undefined, 2)).toEqual("color-empty");
  });

  it("returns 'color-empty' when value is 0", () => {
    expect(colorScaleClassFromValue(0, 0, 2)).toEqual("color-empty");
  });

  it("returns 'color-scale-0' when expected", () => {
    expect(colorScaleClassFromValue(1, 1, 10)).toEqual("color-scale-0");
  });

  it("returns 'color-scale-1' when expected", () => {
    expect(colorScaleClassFromValue(3, 1, 10)).toEqual("color-scale-1");
  });

  it("returns 'color-scale-2' when expected", () => {
    expect(colorScaleClassFromValue(5, 1, 10)).toEqual("color-scale-2");
  });

  it("returns 'color-scale-3' when expected", () => {
    expect(colorScaleClassFromValue(7, 1, 10)).toEqual("color-scale-3");
  });

  it("returns 'color-scale-4' when expected", () => {
    expect(colorScaleClassFromValue(9, 1, 10)).toEqual("color-scale-4");
  });
});
