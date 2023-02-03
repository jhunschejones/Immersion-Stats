import Papa from "papaparse";

/**
 * parses a csv file and passes the results to a callback function
 * @param {file} file - the csv file to parse
 */
export const parseCsvFile = (file) => {
  return Papa.parse(file, {
    header: true,
    skipEmptyLines: "greedy"
  }).data;
};
