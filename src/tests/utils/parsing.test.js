import { parseCsvFile } from "../../utils/parsing";
import fs from "fs";

it("correctly parses the time sheet csv", () => {
  let expectedFirstEntry = {
    "Activity": "Satori Reader",
    "Date": "11/16/2022",
    "Time (mins)": "21",
    "Weeknum": "47",
    "Year": "2022"
  };
  const data = fs.readFileSync("src/tests/fixtures/TimeSheet.csv", { encoding: "utf-8"});
  expect(parseCsvFile(data)[0]).toEqual(expectedFirstEntry);
});

it("correctly parses the totals csv", () => {
  let expectedFirstEntry = {
    "Category": "Active Reading",
    "This Week (mins)": "84",
    "Weekly Goal Mins Remaining": "96",
    "Weekly Goals (mins)": "180",
    "This Week": "1:24",
    "Last Week (mins)": "149",
    "Last Week": "2:29",
    "Two Weeks (mins)": "119",
    "Two Weeks": "1:59",
    "All Time (mins)": "4235",
    "All Time": "70:35",
    "": ""
  };
  const data = fs.readFileSync("src/tests/fixtures/Totals.csv", { encoding: "utf-8"});
  expect(parseCsvFile(data)[0]).toEqual(expectedFirstEntry);
});
