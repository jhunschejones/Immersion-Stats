import { useState, useEffect } from "react";
import { HashRouter, Routes, Route, NavLink, Link, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { HiHome, HiChartPie, HiClipboardList, HiCalendar, HiFire, HiMenu, HiX, HiPresentationChartLine } from "react-icons/hi";

import HomePage from "./components/HomePage";
import ActivityTotals from "./components/ActivityTotals";
import WeeklyProgress from "./components/WeeklyProgress";
import ReviewsPage from "./components/ReviewsPage";
import AnkiTotals from "./components/AnkiReviews";
import JpdbReviews from "./components/JpdbReviews";
import TotalImmersion from "./components/TotalImmersion";
import AboutPage from "./components/AboutPage";
import StudyTrendsPage from "./components/StudyTrendsPage";

import { fetchAnki, fetchJpdb, fetchImmersion, fetchWeeklyProgress, fetchBunpro } from "./utils/csv-fetching";
import JpdbProvider from "./providers/JpdbProvider";
import BunproProvider from "./providers/BunproProvider";
import AnkiProvider from "./providers/AnkiProvider";
import ImmersionProvider from "./providers/ImmersionProvider";

const queryClient = new QueryClient();

queryClient.prefetchQuery("anki", fetchAnki);
queryClient.prefetchQuery("jpdb", fetchJpdb);
queryClient.prefetchQuery("immersion", fetchImmersion);
queryClient.prefetchQuery("weekly-progress", fetchWeeklyProgress);
queryClient.prefetchQuery("bunpro", fetchBunpro);

function NavLinks () {
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
        data-testid="reviews-nav-link"
        to="/reviews"
      >
        <HiCalendar/>
        <span className="full-text">Reviews</span>
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
        data-testid="trends-nav-link"
        to="/trends"
      >
        <HiPresentationChartLine/>
        <span className="full-text">Trends</span>
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
}

// From https://v5.reactrouter.com/web/guides/scroll-restoration
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App () {
  const [dropDownIsOpen, setDropdownOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <ScrollToTop />
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
                <NavLinks/>
              </div>

              <div className={`dropdown-nav ${dropDownIsOpen && "active"}`}>
                <button className="hamburger-button" data-testid="hamburger-button" onClick={() => setDropdownOpen(o => !o)}>
                  {dropDownIsOpen ? <HiX style={{color: "#b7b7b7"}}/> : <HiMenu/>}
                </button>
                <div className="dropdown-content">
                  <NavLinks/>
                </div>
              </div>
            </nav>
          </header>
          <main>
            <ImmersionProvider>
              <AnkiProvider>
                <JpdbProvider>
                  <BunproProvider>
                    <Routes>
                      <Route path="/" element={<HomePage/>}/>
                      <Route path="/activities" element={<ActivityTotals/>}/>
                      <Route path="/weekly" element={<WeeklyProgress/>}/>
                      <Route path="/reviews" element={<ReviewsPage/>}/>
                      <Route path="/anki" element={<AnkiTotals/>}/>
                      <Route path="/jpdb" element={<JpdbReviews/>}/>
                      <Route path="/total" element={<TotalImmersion/>}/>
                      <Route path="/about" element={<AboutPage/>}/>
                      <Route path="/trends" element={<StudyTrendsPage/>}/>
                    </Routes>
                  </BunproProvider>
                </JpdbProvider>
              </AnkiProvider>
            </ImmersionProvider>
          </main>
        </div>
      </HashRouter>
    </QueryClientProvider>
  );
}
