import Papa from "papaparse";

export const parseCsvFile = (file, setState, log = false) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: "greedy",
    complete: (results) => {
      setState(results.data);
      if (log) {
        console.log(results.data);
      }
    }
  });
};
