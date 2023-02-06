export const fetchTotals = async () => {
  const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQpattUOpPKcUSS8bxlk3P-9OdmCHcNB32FINvEfnQg81WN6OsxK6AIho-gijZROruqizBjlukxKscX/pub?output=csv");
  return await response.text();
};

export const fetchWeeklyProgress = async () => {
  const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQpattUOpPKcUSS8bxlk3P-9OdmCHcNB32FINvEfnQg81WN6OsxK6AIho-gijZROruqizBjlukxKscX/pub?gid=1631773302&single=true&output=csv");
  return await response.text();
};

export const fetchAnki = async () => {
  const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRtfhZzd63RTmi_cQ4sTSpLCYbufMKNxdWBrf1fIjqomzeNFRdX1O6DBXUUNcfwNQuRaY-TTp_Fa5M3/pub?gid=0&single=true&output=csv");
  const csv = await response.text();
  return csv;
};

export const fetchJpdb = async () => {
  const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQdhJ2te76EStGko41NZ8GGge8Sv2C9tG6Qh2gspis6G7-e28NUHjDhG-xGbDMsApNxLCWFPwtGOgTi/pub?gid=0&single=true&output=csv");
  const csv = await response.text();
  return csv;
};
