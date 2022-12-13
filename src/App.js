import { useState } from "react";
import { HashRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import { HiHome, HiChartPie, HiClipboardList, HiCalendar, HiFire, HiMenu } from "react-icons/hi";
import HomePage from "./components/HomePage";
import ActivityTotals from "./components/ActivityTotals";
import WeeklyProgress from "./components/WeeklyProgress";
import AnkiTotals from "./components/AnkiReviews";
import TotalImmersion from "./components/TotalImmersion";

export default function App () {
  const [dropDownIsOpen, setDropdownOpen] = useState(false);

  const navLinks = () => {
    return (
      <>
        <NavLink
          className="nav-item"
          data-testid="home-nav-link"
          to="/"
        >
          <HiHome/>
          <span className="full-text">Home</span>
        </NavLink>
        <NavLink
          className="nav-item"
          data-testid="anki-reviews-nav-link"
          to="/anki"
        >
          <HiCalendar/>
          <span className="full-text">Anki Reviews</span>
        </NavLink>
        <NavLink
          className="nav-item"
          data-testid="activities-nav-link"
          to="/activities"
        >
          <HiClipboardList/>
          <span className="full-text">Activities</span>
        </NavLink>
        <NavLink
          className="nav-item"
          data-testid="weekly-progress-nav-link"
          to="/weekly"
        >
          <HiChartPie/>
          <span className="full-text">Weekly Progress</span>
        </NavLink>
        <NavLink
          className="nav-item"
          data-testid="total-immersion-nav-link"
          to="/total"
        >
          <HiFire/>
          <span className="full-text">Total Immersion</span>
        </NavLink>
      </>
    );
  };

  return (
    <HashRouter>
      <div className="App" onClick={(e) => {
        if (!e.target.closest("button")?.classList?.contains("hamburger")) {
          setDropdownOpen(false);
        }
      }}>
        <header>
          <nav>
            <Link to="/" className="nav-item site-title" data-testid="site-title-nav-link">
              Immersion Stats
            </Link>

            <div className="full-nav">
              <span className="nav-item spacer"></span>
              {navLinks()}
            </div>

            <div className={`dropdown-nav ${dropDownIsOpen && "active"}`}>
              <button className="hamburger" onClick={() => setDropdownOpen(o => !o)}>
                <HiMenu/>
              </button>
              <div className="dropdown-content">
                {navLinks()}
              </div>
            </div>
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
