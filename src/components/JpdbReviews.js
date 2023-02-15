import ReviewHeatmap from "./ReviewHeatmap";
import { fetchJpdb } from "../utils/csv-fetching";

export default function AnkiReviews () {
  return(
    <ReviewHeatmap
      dataFetchFunction={fetchJpdb}
      dataFetchQueryKey="jpdb"
      chartTitle="jpdb.io Reviews"
    />
  );
}
