import { useState } from "react";
import { HashRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { HiHome, HiChartPie, HiClipboardList, HiCalendar, HiFire, HiMenu, HiX } from "react-icons/hi";

import HomePage from "./components/HomePage";
import ActivityTotals from "./components/ActivityTotals";
import WeeklyProgress from "./components/WeeklyProgress";
import AnkiTotals from "./components/AnkiReviews";
import JpdbReviews from "./components/JpdbReviews";
import TotalImmersion from "./components/TotalImmersion";

import { fetchAnki, fetchTotals, fetchWeeklyProgress } from "./utils/csv-fetching";

const queryClient = new QueryClient();

queryClient.prefetchQuery("anki", fetchAnki);
queryClient.prefetchQuery("totals", fetchTotals);
queryClient.prefetchQuery("weekly-progress", fetchWeeklyProgress);

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
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <div className="App" onClick={(e) => {
          if (!e.target.closest("button")?.classList?.contains("hamburger-button")) {
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
                <button className="hamburger-button" data-testid="hamburger-button" onClick={() => setDropdownOpen(o => !o)}>
                  {dropDownIsOpen ? <HiX style={{color: "#b7b7b7"}}/> : <HiMenu/>}
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
              <Route path="/jpdb" element={<JpdbReviews/>}/>
              <Route path="/total" element={<TotalImmersion/>}/>
            </Routes>
          </main>
        </div>
      </HashRouter>
    </QueryClientProvider>
  );
}
