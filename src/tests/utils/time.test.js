import { minutesToHoursAndMinutesString } from "../../utils/time";

it("returns the expected time string with less than one hour", () => {
  expect(minutesToHoursAndMinutesString(50)).toEqual("0:50");
});

it("returns the expected time string with single digit minutes", () => {
  expect(minutesToHoursAndMinutesString(61)).toEqual("1:01");
});
