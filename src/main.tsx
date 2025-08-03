import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { InterventionPreferencesProvider } from "@/hooks/useInterventionPreferences";
import { FocusHistoryProvider } from "@/hooks/useFocusHistory";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <InterventionPreferencesProvider>
      <FocusHistoryProvider>
        <App />
      </FocusHistoryProvider>
    </InterventionPreferencesProvider>
  </React.StrictMode>,
);
