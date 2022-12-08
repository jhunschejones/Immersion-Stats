import { minutesToHoursAndMinutesString, minutesToHoursAndMinutes } from "../../utils/time";

describe("minutesToHoursAndMinutesString", () => {
  it("returns the expected time string with less than one hour", () => {
    expect(minutesToHoursAndMinutesString(50)).toEqual("0:50");
  });

  it("returns the expected time string with single digit minutes", () => {
    expect(minutesToHoursAndMinutesString(61)).toEqual("1:01");
  });
});

describe("minutesToHoursAndMinutes", () => {
  it("returns the expected time string with less than one hour", () => {
    expect(minutesToHoursAndMinutes(50)).toEqual({hours: 0, minutes: 50});
  });

  it("returns the expected time string with single digit minutes", () => {
    expect(minutesToHoursAndMinutes(61)).toEqual({hours: 1, minutes: 1});
  });
});
