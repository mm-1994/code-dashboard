import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./context/theme";
import reportWebVitals from "./reportWebVitals";
import Routers from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider>
    <ToastContainer
      position="bottom-center"
      autoClose={3500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      pauseOnHover={false}
      theme="colored"
      limit={1}
    />
    <Routers />
  </ThemeProvider>
  // <div id="root">Currently not availbe</div>
);

reportWebVitals();
