import React, { useContext } from "react";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { ThemeContext } from "../../../context/theme";
import { IconButton } from "@chakra-ui/react";

function ThemeButton() {
  const themCtx = useContext(ThemeContext);
  return (
    <IconButton
      p={0}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      aria-label="toggle dark mode"
      bg="primary.60"
      rounded="full"
      size={"sm"}
      onClick={themCtx.toggleDarkMode}
      icon={
        themCtx.darkMode ? (
          <MdLightMode
            size={18}
            color={themCtx.darkMode ? "#000000" : "#FFFFFF"}
          />
        ) : (
          <MdDarkMode
            size={18}
            color={themCtx.darkMode ? "#000000" : "#FFFFFF"}
          />
        )
      }
    />
  );
}

export default ThemeButton;
