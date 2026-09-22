import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./styles/global.css";
import "./styles/dashboard.css";
import "./styles/newTest.css";
import "./styles/measurements.css";
import "./styles/diagnosis.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);