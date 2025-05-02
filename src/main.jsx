import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { MetaMaskProvider } from "./hooks/useMetaMask";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MetaMaskProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MetaMaskProvider>
  </React.StrictMode>
);
