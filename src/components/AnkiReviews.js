import ReviewsHeatmap from "./ReviewsHeatmap";
import { AnkiContext } from "../providers/AnkiProvider";
import { useContext } from "react";

export default function AnkiReviews() {
  const {ankiData, ankiIsLoading} = useContext(AnkiContext);
  return(
    <ReviewsHeatmap
      csvData={ankiData}
      csvDataIsLoading={ankiIsLoading}
      chartTitle="Anki Reviews"
    />
  );
}
