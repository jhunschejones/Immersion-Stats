import ReviewHeatmap from "./ReviewHeatmap";
import { fetchAnki } from "../utils/csv-fetching";

export default function AnkiReviews () {
  return(
    <ReviewHeatmap
      dataFetchFunction={fetchAnki}
      dataFetchQueryKey="anki"
      chartTitle="Anki Reviews"
    />
  );
}
