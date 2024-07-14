import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ModeProvider } from "./contexts/mode/mode";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ModeProvider>
      <RouterProvider router={router}></RouterProvider>
    </ModeProvider>
  </React.StrictMode>,
);
