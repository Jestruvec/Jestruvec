// App.tsx o App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "@/components/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Jestruvec" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
