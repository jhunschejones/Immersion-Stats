import ReviewsHeatmap from "./ReviewsHeatmap";
import { useContext } from "react";
import { JpdbContext } from "../providers/JpdbProvider";

export default function JpdbReviews() {
  const {jpdbData, jpdbIsLoading} = useContext(JpdbContext);
  return(
    <ReviewsHeatmap
      csvData={jpdbData}
      csvDataIsLoading={jpdbIsLoading}
      chartTitle="jpdb.io Reviews"
    />
  );
}
