import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ActivityTotals from "./components/ActivityTotals";

export default function App () {
  return (
    <Router>
      <div className="App">
        <header>
          <nav></nav>
        </header>

        <Routes>
          <Route path="/" element={<ActivityTotals/>}/>
        </Routes>
      </div>
    </Router>
  );
}
