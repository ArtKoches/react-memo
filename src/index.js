import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import { ModeProvider } from "./contexts/mode/mode";
import { LeadersProvider } from "./contexts/leaders/leaders";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LeadersProvider>
      <ModeProvider>
        <RouterProvider router={router}></RouterProvider>
      </ModeProvider>
    </LeadersProvider>
  </React.StrictMode>,
);
