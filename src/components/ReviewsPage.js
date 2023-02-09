import { Link } from "react-router-dom";

export default function ReviewsPage () {
  return(
    <div className="ReviewsPage">
      <h1 style={{
        margin: "4px 0 18px 0",
        padding: "0",
        fontSize: "28px",
        fontWeight: "600",
        textAlign: "center"
      }}>
        My Reviews
      </h1>
      <div style={{textAlign: "center", maxWidth: "500px"}}>
        My daily review routine is always changing, but here are two important review activities I do every day.
      </div>
      <div className="action-buttons">
        <Link to="/anki" className="button">
          Anki reviews
        </Link>
        <Link to="/jpdb" className="button" style={{marginLeft: "12px"}}>
          jpdb.io reviews
        </Link>
      </div>
    </div>
  );
}
