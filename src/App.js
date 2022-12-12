import { HashRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import { HiHome, HiChartPie, HiClipboardList, HiCalendar, HiFire } from "react-icons/hi";
import HomePage from "./components/HomePage";
import ActivityTotals from "./components/ActivityTotals";
import WeeklyProgress from "./components/WeeklyProgress";
import AnkiTotals from "./components/AnkiReviews";
import TotalImmersion from "./components/TotalImmersion";

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
              className="nav-item home-nav-link"
              data-testid="home-nav-link"
              to="/"
            >
              <HiHome/>
            </NavLink>
            <NavLink
              className="nav-item"
              data-testid="anki-reviews-nav-link"
              to="/anki"
            >
              <HiCalendar/>
            </NavLink>
            <NavLink
              className="nav-item"
              data-testid="activities-nav-link"
              to="/activities"
            >
              <HiClipboardList/>
            </NavLink>
            <NavLink
              className="nav-item"
              data-testid="weekly-progress-nav-link"
              to="/weekly"
            >
              <HiChartPie/>
            </NavLink>
            <NavLink
              className="nav-item"
              data-testid="total-immersion-nav-link"
              to="/total"
            >
              <HiFire/>
            </NavLink>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/activities" element={<ActivityTotals/>}/>
            <Route path="/weekly" element={<WeeklyProgress/>}/>
            <Route path="/anki" element={<AnkiTotals/>}/>
            <Route path="/total" element={<TotalImmersion/>}/>
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
