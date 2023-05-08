import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

const useDatasetIndexFromHotKeys = () => {
  const [datasetIndex, setDatasetIndex] = useState(undefined);

  // press `1` to show the average for the dataset at index `0`, the `jpdb.io` dataset
  useHotkeys("1", () => setDatasetIndex(s => s == 0 ? undefined : 0), []);
  // press `1` to show the average for the dataset at index `1`, the `Bunpro` dataset
  useHotkeys("2", () => setDatasetIndex(s => s == 1 ? undefined : 1), []);
  // press `1` to show the average for the dataset at index `2`, the `Anki` dataset
  useHotkeys("3", () => setDatasetIndex(s => s == 2 ? undefined : 2), []);
  // press `1` to show the average for the dataset at index `3`, the `Immersion` dataset
  useHotkeys("4", () => setDatasetIndex(s => s == 3 ? undefined : 3), []);
  // press `5` to show the average for the dataset at index `4`, the `totals` dataset
  useHotkeys("5", () => setDatasetIndex(s => s == 4 ? undefined : 4), []);
  // press `backspace` to remove any average lines being shown
  useHotkeys("backspace", () => setDatasetIndex(undefined), []);

  return { datasetIndex };
};

export default useDatasetIndexFromHotKeys;
