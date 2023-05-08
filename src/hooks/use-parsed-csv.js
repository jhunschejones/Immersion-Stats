import { useMemo } from "react";
import { parseCsvFile } from "../utils/parsing";

const useParsedCsv = (isLoading, data) => {
  const parsedCsvData = useMemo(() => {
    if (isLoading) {
      return [];
    }
    return parseCsvFile(data);
  }, [isLoading, data]);

  return parsedCsvData;
};

export default useParsedCsv;
