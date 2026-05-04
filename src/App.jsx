import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import InvoicePage from "./pages/InvoicePage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/invoice/:templateId" element={<InvoicePage />} />
    </Routes>
  );
}
