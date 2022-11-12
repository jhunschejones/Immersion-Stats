import { Link } from "react-router-dom";

export default function HomePage () {
  return(
    <div className="HomePage">
      <br/>
      <div className="action-buttons">
        <Link to="/activity-totals" className="button">
          Activity totals
        </Link>
      </div>
    </div>
  )
}
