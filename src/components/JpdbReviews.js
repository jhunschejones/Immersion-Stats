import ReviewsHeatmap from "./ReviewsHeatmap";
import { fetchJpdb } from "../utils/csv-fetching";

export default function AnkiReviews () {
  return(
    <ReviewsHeatmap
      dataFetchFunction={fetchJpdb}
      dataFetchQueryKey="jpdb"
      chartTitle="jpdb.io Reviews"
    />
  );
}
