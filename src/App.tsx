import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* The Landing Page (Root URL) */}
        <Route path="/" element={<Home />} />

        {/* <Route path="/tree" element={<FamilyTree />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
