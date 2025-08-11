import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landingpage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Features from "./pages/Features";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Composer from "./pages/Composer";
import Logs from "./pages/Logs";
import Templates from "./pages/Templates";
import Automations from "./pages/Automations";
import Analytics from "./pages/Analytics";
import Security from "./pages/Security";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import "./index.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/features" element={<Features />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/composer" element={<Composer />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/automations" element={<Automations />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/security" element={<Security />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
