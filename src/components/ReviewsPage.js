import AnkiReviews from "../components/AnkiReviews";
import JpdbReviews from "../components/JpdbReviews";

export default function ReviewsPage () {
  return(
    <div className="ReviewsPage">
      <AnkiReviews/>
      <br/>
      <JpdbReviews/>
    </div>
  );
}
