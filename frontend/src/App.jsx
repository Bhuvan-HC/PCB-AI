import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import NewTest from "./pages/NewTest";
import Measurements from "./pages/Measurements";
import Diagnosis from "./pages/Diagnosis";
import History from "./pages/History";
import SystemStatus from "./pages/SystemStatus";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-test" element={<NewTest />} />
          <Route path="/measurements" element={<Measurements />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/history" element={<History />} />
          <Route path="/system-status" element={<SystemStatus />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;