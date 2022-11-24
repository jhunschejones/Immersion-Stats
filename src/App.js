import { HashRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import { HiHome, HiChartPie, HiClipboardList, HiCollection } from "react-icons/hi";
import HomePage from "./components/HomePage";
import ActivityTotals from "./components/ActivityTotals";
import WeeklyProgress from "./components/WeeklyProgress";
import AnkiTotals from "./components/AnkiStudyTime";

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
            <span className="nav-item spacer"></span>
            <NavLink
              className="nav-item"
              data-testid="home-nav-link"
              to="/"
            >
              <HiHome/>
            </NavLink>
            <NavLink
              className="nav-item"
              data-testid="anki-study-time-nav-link"
              to="/anki-study-time"
            >
              <HiCollection/>
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
            <Route path="/anki-study-time" element={<AnkiTotals/>}/>
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
