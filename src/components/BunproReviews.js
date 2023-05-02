import ReviewsHeatmap from "./ReviewsHeatmap";
import { useContext } from "react";
import { BunproContenxt } from "../providers/BunproProvider";

export default function BunproReviews() {
  const {bunproData, bunproIsLoading} = useContext(BunproContenxt);

  return(
    <ReviewsHeatmap
      csvData={bunproData}
      csvDataIsLoading={bunproIsLoading}
      chartTitle="Bunpro Reviews"
    />
  );
}
