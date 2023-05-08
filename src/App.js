import { useState, useEffect, lazy, Suspense } from "react";
import { HashRouter, Routes, Route, NavLink, Link, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { HiHome, HiChartPie, HiClipboardList, HiCalendar, HiFire, HiMenu, HiX, HiPresentationChartLine } from "react-icons/hi";

// the code for the home page is always loaded
import HomePage from "./components/HomePage";
// the code for other pages is split and only downloaded when the page is requested by the user
const ActivityTotals = lazy(() => import("./components/ActivityTotals"));
const WeeklyProgress = lazy(() => import("./components/WeeklyProgress"));
const ReviewsPage = lazy(() => import("./components/ReviewsPage"));
const AnkiTotals = lazy(() => import("./components/AnkiReviews"));
const JpdbReviews = lazy(() => import("./components/JpdbReviews"));
const TotalImmersion = lazy(() => import("./components/TotalImmersion"));
const AboutPage = lazy(() => import("./components/AboutPage"));
const StudyTrendsPage = lazy(() => import("./components/StudyTrendsPage"));

import JpdbProvider from "./providers/JpdbProvider";
import BunproProvider from "./providers/BunproProvider";
import AnkiProvider from "./providers/AnkiProvider";
import ImmersionProvider from "./providers/ImmersionProvider";
import AggregatedImmersionProvider from "./providers/AggregatedImmersionProvider";
import BunproReviews from "./components/BunproReviews";

const queryClient = new QueryClient();

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
              <AggregatedImmersionProvider>
                <AnkiProvider>
                  <JpdbProvider>
                    <BunproProvider>
                      <Suspense fallback={<p style={{textAlign: "center"}}>Loading...</p>}>
                        <Routes>
                          <Route path="/" element={<HomePage/>}/>
                          <Route path="/activities" element={<ActivityTotals/>}/>
                          <Route path="/weekly" element={<WeeklyProgress/>}/>
                          <Route path="/reviews" element={<ReviewsPage/>}/>
                          <Route path="/anki" element={<AnkiTotals/>}/>
                          <Route path="/jpdb" element={<JpdbReviews/>}/>
                          <Route path="/bunpro" element={<BunproReviews/>}/>
                          <Route path="/total" element={<TotalImmersion/>}/>
                          <Route path="/about" element={<AboutPage/>}/>
                          <Route path="/trends" element={<StudyTrendsPage/>}/>
                        </Routes>
                      </Suspense>
                    </BunproProvider>
                  </JpdbProvider>
                </AnkiProvider>
              </AggregatedImmersionProvider>
            </ImmersionProvider>
          </main>
        </div>
      </HashRouter>
    </QueryClientProvider>
  );
}
