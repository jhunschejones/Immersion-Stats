import { Link } from "react-router-dom";
import { HiChartPie, HiClipboardList, HiCalendar, HiFire } from "react-icons/hi";

export default function HomePage () {
  return(
    <div className="HomePage">
      <h1 style={{
        margin: "4px 0 12px 0",
        padding: "0",
        fontSize: "28px",
        fontWeight: "600",
        textAlign: "center"
      }}>
        Welcome!
      </h1>
      <div style={{display: "flex", justifyContent: "center"}}>
        <p style={{textAlign: "center", maxWidth: 720}}>
          I started learning Japanese in the fall of 2020. Through self-study and with the help of some great iTalki tutors, I've been slowly and steadily making progress. Along the way I measured as many of my daily study activities as I could. Here are a few stats that I reference for inspiration!
        </p>
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
