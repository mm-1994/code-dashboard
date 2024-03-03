import React, { useContext, useEffect, useState } from "react";
import { Flex, Box, Fade } from "@chakra-ui/react";
import { ThemeContext } from "../../../context/theme";
import MenuItem from "./components/menu-item/menu-item";
import { useLocation } from "react-router";
import { sideBarData } from "../../../data/side-bar";
import Logo from "./components/logo/logo";
import LightLogo from "../../../assets/images/logo/logo-light.png";
import DarkLogo from "../../../assets/images/logo/logo-dark.png";
import LightLogoSm from "../../../assets/images/logo/logo-sm-light.png";
import DarkLogoSm from "../../../assets/images/logo/logo-sm-dark.png";
import BoschImg from "../../../assets/images/logo/bosch.svg";
import { getUserInfo } from "../../../api/user";
import { useMediaQuery } from "@chakra-ui/react";

export default function SideBar() {
  const [navSize, changeNavSize] = useState("small");
  const [displayText, setDisplayText] = useState(false);
  const [isNonMobile] = useMediaQuery("(min-width: 720px)");
  const location = useLocation();
  const { darkMode } = useContext(ThemeContext);
  const handleHoverSideBar = (size) => {
    changeNavSize(size);
    if (size === "large") {
      setTimeout(() => {
        setDisplayText(true);
      }, 550);
    } else {
      setTimeout(() => {
        setDisplayText(false);
      }, 550);
      setDisplayText(false);
    }
  };
  const [lightImage, setLightImage] = useState("");
  const [darkImage, setDarkImage] = useState("");

  useEffect(() => {
    if (getUserInfo()) {
      if (getUserInfo().customer === "customer1") {
        setLightImage(BoschImg);
        setDarkImage(BoschImg);
      }
      if (getUserInfo().customer === "bosch") {
        setLightImage(BoschImg);
        setDarkImage(BoschImg);
      }
    }
  }, []);

  return (
    <>
      {isNonMobile && (
        <Box position={"fixed"} h="100%" zIndex={2}>
          <Fade
            in={true}
            style={{ height: "100%" }}
            transition={{ enter: { duration: 0.8 } }}
          >
            <Box
              transition={"width 1s, height 1s"}
              bg={"primary.80"}
              h="100%"
              borderStartStyle={"solid"}
              borderRightWidth={2.5}
              borderColor={"primary.100"}
              paddingBottom={4}
              overflow={navSize === "small" ? "none" : "auto"}
              w={navSize === "small" ? "60px" : "245px"}
              onMouseEnter={() => handleHoverSideBar("large")}
              onMouseLeave={() => handleHoverSideBar("small")}
              boxShadow={
                darkMode
                  ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                  : "5px 4px 15px 1px rgba(0,0,0,0.2)"
              }
            >
              <Flex
                p="5%"
                flexDir="column"
                w="100%"
                transition={"width 1s, height 1s"}
                alignItems={"center"}
                as="nav"
                gap={3}
              >
                {navSize === "small" ? (
                  <Logo
                    mt={-4}
                    h={"15%"}
                    _hover={{ background: "none" }}
                    logo={darkMode ? LightLogoSm : DarkLogoSm}
                    transition={"all 2s ease"}
                  />
                ) : (
                  <>
                    <Logo
                      w={"80%"}
                      h={"15%"}
                      mt={-4}
                      _hover={{ background: "none" }}
                      logo={darkMode ? LightLogo : DarkLogo}
                      transition={"all 2s ease"}
                    />
                    <Logo
                      w={"80%"}
                      h={"15%"}
                      mt={-4}
                      _hover={{ background: "none" }}
                      logo={darkMode ? darkImage : lightImage}
                      transition={"all 2s ease"}
                    />
                  </>
                )}

                {sideBarData.data.map((ele) => {
                  return (
                    <MenuItem
                      key={ele.id}
                      navSize={navSize}
                      icon={ele.icon}
                      title={ele.name}
                      path={ele.path}
                      active={
                        location.pathname === "/"
                          ? location.pathname === ele.path
                          : ele.path !== "/" &&
                            location.pathname.includes(ele.path)
                      }
                      choices={ele.choices}
                      displayText={
                        location.pathname === ele.path
                          ? displayText
                          : displayText
                      }
                    />
                  );
                })}
              </Flex>
            </Box>
          </Fade>
        </Box>
      )}
    </>
  );
}
