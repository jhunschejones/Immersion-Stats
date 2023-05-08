/**
 * Build an array of all dates between two dates
 *
 * @param {Date} startDate - the start of the date range
 * @param {Date} endDate - the end of the date range
 * @returns {array<Date>}
 */
export const getDatesBetween = (startDate, endDate) => {
  const currentDate = new Date(startDate.getTime());
  const dates = [];
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

export const tenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 10));
export const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));
export const threeMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 3));
export const oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1));

export const tenDaysDateRange = getDatesBetween(tenDaysAgo, new Date());
export const oneMonthDateRange = getDatesBetween(oneMonthAgo, new Date());
export const threeMonthsDateRange = getDatesBetween(threeMonthsAgo, new Date());
export const oneYearDateRange = getDatesBetween(oneYearAgo, new Date());
