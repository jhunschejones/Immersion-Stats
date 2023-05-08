import { getDatesBetween } from "../../utils/date";

const today = new Date();
const oneDayAgo = new Date(new Date().setDate(today.getDate() - 1));
const twoDaysAgo = new Date(new Date().setDate(today.getDate() - 2));
const threeDaysAgo = new Date(new Date().setDate(today.getDate() - 3));

describe("getDatesBetween", () => {
  it("returns date objects for every day in the range", () => {
    expect(getDatesBetween(threeDaysAgo, today)).toEqual([threeDaysAgo, twoDaysAgo, oneDayAgo, today]);
  });
});
