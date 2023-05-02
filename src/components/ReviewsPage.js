import AnkiReviews from "../components/AnkiReviews";
import JpdbReviews from "../components/JpdbReviews";
import BunproReviews from "../components/BunproReviews";

export default function ReviewsPage () {
  return(
    <div className="ReviewsPage">
      <AnkiReviews/>
      <br/>
      <JpdbReviews/>
      <br/>
      <BunproReviews/>
    </div>
  );
}
