import { Link } from "react-router-dom";
import { HiChartPie, HiClipboardList, HiCalendar, HiFire } from "react-icons/hi";

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
        Let's take a look at some of my Japanese language study statistics!
      </div>
      <div className="activity-buttons">
        <Link to="/total" className="button" data-testid="totals-button">
          <HiFire style={{color: "#ff9600"}} />
          <span className="button-text">Total Immersion</span>
        </Link>
        <Link to="/weekly" className="button" data-testid="weekly-button">
          <HiChartPie style={{color: "#2a67b1"}} />
          <span className="button-text">Weekly Progress</span>
        </Link>
        <Link to="/activities" className="button" data-testid="activities-button">
          <HiClipboardList style={{color: "#ce82ff"}} />
          <span className="button-text">Activities</span>
        </Link>
        <Link to="/reviews" className="button" data-testid="reviews-button">
          <HiCalendar style={{color: "#5dcc06"}} />
          <span className="button-text">Reviews</span>
        </Link>
      </div>
    </div>
  );
}
