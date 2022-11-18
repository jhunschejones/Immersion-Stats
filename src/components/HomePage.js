import { Link } from "react-router-dom";

export default function HomePage () {
  return(
    <div className="HomePage">
      <h1 style={{
        margin: "4px 0 18px 0",
        padding: "0",
        fontSize: "28px",
        fontWeight: "600",
        textAlign: "center"
      }}>
        Welcome!
      </h1>
      <div style={{textAlign: "center"}}>
        Let's take a quick look at some of my Japanese language study statistics
      </div>
      <div className="action-buttons">
        <Link to="/activity-totals" className="button">
          Activity totals
        </Link>
        <Link to="/weekly-progress" className="button" style={{marginLeft: "12px"}}>
          Weekly progress
        </Link>
      </div>
    </div>
  );
}
