import { HashRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import { HiHome, HiChartPie, HiClipboardList } from "react-icons/hi";
import HomePage from "./components/HomePage";
import ActivityTotals from "./components/ActivityTotals";
import WeeklyProgress from "./components/WeeklyProgress";
import AnkiTotals from "./components/AnkiTotals";

export default function App () {
  return (
    <HashRouter>
      <div className="App">
        <header>
          <nav>
            <Link
              className="nav-item site-title"
              data-testid="site-title-nav-link"
              to="/"
            >
              Immersion Stats
            </Link>
            <span className="nav-item" style={{width: "12px", padding: 0, margin: 0, cursor: "default"}}></span>
            <NavLink
              className="nav-item"
              data-testid="home-nav-link"
              to="/"
            >
              <HiHome/>
            </NavLink>
            <NavLink
              className="nav-item"
              data-testid="activity-totals-nav-link"
              to="/activity-totals"
            >
              <HiClipboardList/>
            </NavLink>
            <NavLink
              className="nav-item"
              data-testid="weekly-progress-nav-link"
              to="/weekly-progress"
            >
              <HiChartPie/>
            </NavLink>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/activity-totals" element={<ActivityTotals/>}/>
            <Route path="/weekly-progress" element={<WeeklyProgress/>}/>
            <Route path="/anki-totals" element={<AnkiTotals/>}/>
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
