import Login from "./components/login";
import Abacus from "./components/abacus";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/abacus" element={<Abacus />} />
      </Routes>
    </Router>
  );
}
