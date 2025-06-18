import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { GenresProvider } from "./context/GenresContext";
import { CountryProvider } from "./context/CountryContext";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <CountryProvider>
      <LanguageProvider>
        <GenresProvider>
          <BrowserRouter basename="/FlixsHub">
  <App />
</BrowserRouter>
        </GenresProvider>
      </LanguageProvider>
    </CountryProvider>
  </React.StrictMode>
);
