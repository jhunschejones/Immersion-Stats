import { HashRouter, Routes, Route, Link } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import HomePage from "./components/HomePage";
import ActivityTotals from "./components/ActivityTotals";

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
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
