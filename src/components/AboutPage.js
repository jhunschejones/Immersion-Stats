import { Link } from "react-router-dom";

export default function AboutPage () {
  return(
    <div className="AboutPage" style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
      <h1 style={{
        margin: "4px 0 12px 0",
        padding: "0",
        fontSize: "28px",
        fontWeight: "600",
      }}>
        About
      </h1>
      <p style={{maxWidth: 720}}>
        I started learning Japanese in the fall of 2020. Through self-study and with the help of some great iTalki tutors, I've been slowly and steadily making progress. Along the way I measured as many of my daily study activities as I could, in order to better visualize my progress. <Link to="/" style={{color: "#1cb0f6", textDecoration: "none"}}>Take a look</Link> around the site to see some stats that I like to reference for inspiration!
      </p>
    </div>
  );
}
