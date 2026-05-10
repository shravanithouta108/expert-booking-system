import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { SocketProvider } from "./context/SocketContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { borderRadius: "10px", fontFamily: "inherit" },
            success: { iconTheme: { primary: "#4f46e5", secondary: "#fff" } },
          }}
        />
      </SocketProvider>
    </BrowserRouter>
  </React.StrictMode>
);
