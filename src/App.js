import { HashRouter, Routes, Route, Link } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import HomePage from "./components/HomePage";
import ActivityTotals from "./components/ActivityTotals";
import WeeklyProgress from "./components/WeeklyProgress";

export default function App () {
  return (
    <HashRouter>
      <div className="App">
        <header>
          <nav>
            <Link to="/" className="nav-item site-title">Immersion Stats</Link>
            <Link to="/" className="nav-item"><HiHome /></Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/activity-totals" element={<ActivityTotals/>}/>
            <Route path="/weekly-progress" element={<WeeklyProgress/>}/>
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
