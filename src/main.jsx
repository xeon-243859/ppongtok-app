import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ 라우터 import
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ App을 BrowserRouter로 감싸서 라우팅 작동 */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
console.log("Vercel redeploy trigger");