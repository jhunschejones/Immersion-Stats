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
          <HiFire />
        </Link>
        <Link to="/weekly" className="button" data-testid="weekly-button">
          <HiChartPie/>
        </Link>
        <Link to="/activities" className="button" data-testid="activities-button">
          <HiClipboardList/>
        </Link>
        <Link to="/reviews" className="button" data-testid="reviews-button">
          <HiCalendar/>
        </Link>
      </div>
    </div>
  );
}
