import React, { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {ChakraProvider, extendTheme } from "@chakra-ui/react";
import AdminLayout from "../admin/admin";
import { ThemeContext } from "../../context/theme";
import "./main.css";
import { DevicesProvider } from "../../context/devices";
import { UsersProvider } from "../../context/users";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NologinRoutes } from "../../data/routes-data";

function MainLayout() {
  const themeContext = useContext(ThemeContext);
  const theme = extendTheme(themeContext.theme);
  const location = useLocation().pathname;

  return (
    <div className={themeContext.darkMode ? "dark" : "light"}>
            
      <ChakraProvider theme={theme}>
        <DevicesProvider>
          {/* <Ticketingrovider> */}
          <UsersProvider>
            {Object.values(NologinRoutes).find((route) =>
              location.includes(route)
            ) ? (
              <>
                <Outlet />{" "}
              </>
            ) : (
              <AdminLayout />
            )}
            {/* <ColorPalatte /> */}

          </UsersProvider>
          {/* </Ticketingrovider> */}
        </DevicesProvider>
      </ChakraProvider>
    </div>
  );
}

export default MainLayout;
