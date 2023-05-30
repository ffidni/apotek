import React from "react";
import { ContextProvider } from "../components/Context";
import Sidebar from "../components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles/globals.css";
import "../styles/sidebar.scss";

function MyApp({ Component, pageProps }) {
  return (
    <ContextProvider>
      <Sidebar>
        <ToastContainer />
        <Component {...pageProps} />;
      </Sidebar>
    </ContextProvider>
  );
}

export default MyApp;
