import ReviewsHeatmap from "./ReviewsHeatmap";
import { fetchAnki } from "../utils/csv-fetching";

export default function AnkiReviews () {
  return(
    <ReviewsHeatmap
      dataFetchFunction={fetchAnki}
      dataFetchQueryKey="anki"
      chartTitle="Anki Reviews"
    />
  );
}
