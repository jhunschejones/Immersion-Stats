export const minutesToHoursAndMinutes = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
};

export const minutesToHoursAndMinutesString = (totalMinutes) => {
  const [ hours, minutes ] = Object.values(minutesToHoursAndMinutes(totalMinutes));
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
};
