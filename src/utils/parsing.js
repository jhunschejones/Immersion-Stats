import Papa from "papaparse";

/**
 * parses a csv file and passes the results to a callback function
 * @param {file} file - the csv file to parse
 * @param {function} callback - the callback to pass the parsed data to
 * @param {boolean} log - whether to console log out the results of the file parsing
 */
export const parseCsvFile = (file, callback, log = false) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: "greedy",
    complete: (results) => {
      callback(results.data);
      if (log) {
        console.log(results);
      }
    }
  });
};
