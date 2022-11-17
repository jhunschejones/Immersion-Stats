import { getSearchParams } from "../../utils/urls"

describe("getSearchParams", () => {
  delete window.location;
  window.location = {
    href: "https://www.example.com",
  };

  it("returns empty search params when none are present", () => {
    global.window.location = new URL("https://www.example.com/#/weekly-progress");
    expect(getSearchParams()).toEqual(new URLSearchParams());
  });

  it("returns expected search params when one is present", () => {
    window.location = new URL(`https://www.example.com/#/weekly-progress?timeRange=${encodeURIComponent("Last+week")}`);
    const expectedParams = new URLSearchParams(`timeRange=${encodeURIComponent("Last+week")}`);
    const returnedParams = getSearchParams();
    expect(returnedParams).toEqual(expectedParams);
    expect(returnedParams.get("timeRange")).toEqual("Last+week");
  });

  it("returns expected search params when more than one is present", () => {
    window.location = new URL(`https://www.example.com/#/weekly-progress?extra=param&timeRange=${encodeURIComponent("Last+week")}`);
    const expectedParams = new URLSearchParams(`extra=param&timeRange=${encodeURIComponent("Last+week")}`);
    const returnedParams = getSearchParams();
    expect(returnedParams).toEqual(expectedParams);
    expect(returnedParams.get("timeRange")).toEqual("Last+week");
  });
})
