import { HashRouter, Routes, Route, Link } from "react-router-dom";
import { HiHome, HiChartPie, HiClipboardList } from "react-icons/hi";
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
            <span className="nav-item" style={{width: "12px", padding: 0, margin: 0, cursor: "default"}}></span>
            <Link to="/" className="nav-item"><HiHome/></Link>
            <Link to="/activity-totals" className="nav-item"><HiClipboardList/></Link>
            <Link to="/weekly-progress" className="nav-item"><HiChartPie/></Link>
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
