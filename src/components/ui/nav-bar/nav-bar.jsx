import { HamburgerIcon, Icon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Spacer,
  Avatar,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  VStack,
  StackDivider,
  Fade
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import Logo from "../side-bar/components/logo/logo";
import lightLogo from "../../../assets/images/logo/logo-light.png";
import DarkLogo from "../../../assets/images/logo/logo-dark.png";
import { ThemeContext } from "../../../context/theme";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { getUserInfo, signOut } from "../../../api/user";
import useScreenSize from "../../../hooks/screen-size";
import SearchMenu from "../search-menu/search-menu";
import { SCREEN_SIZE } from "../../../types/screen";
import { sideBarData } from "../../../data/side-bar";
import BoschImg from "../../../assets/images/logo/bosch.svg";

function NavBar() {
  const theme = useContext(ThemeContext);
  const location = useLocation().pathname;
  const navData = location.split("/").splice(1);
  const size = useScreenSize();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
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
  const navigate = useNavigate();
  return (
    <Fade in={true} transition={{ enter: {duration: 0.8 }}} style={{zIndex: 1}}  >

    <Flex
      mb={5}
      p={1}
      pl={5}
      pr={5}
      bg={"primary.80"}
      width="100%"
      alignItems="center"
      gap="2"
      boxShadow={
        theme.darkMode
          ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
          : "5px 4px 15px 1px rgba(0,0,0,0.2)"
      }
    >
      {size !== SCREEN_SIZE.LG && (
        <IconButton
          ms={1}
          bg={"transparent"}
          size={"lg"}
          icon={<HamburgerIcon color={"text.primary"} />}
          ref={btnRef}
          onClick={onOpen}
        />
      )}
      <Box>
        <Text
          as={Flex}
          pl={1}
          fontSize={useScreenSize().size >= SCREEN_SIZE.MD ? "3xl" : "2xl"}
          color={"text.primary"}
          fontWeight={"Bold"}
        >
          {navData[0].length === 0
            ? "Dashboard"
            : navData[navData.length - 1][0].toUpperCase() +
              navData[navData.length - 1]
                .replaceAll("%20", " ")
                .replaceAll("-", " ")
                .slice(1, navData[navData.length - 1].length)}
        </Text>
      </Box>
      <Spacer />
      {size === SCREEN_SIZE.LG ? (
        <SearchMenu showUser />
      ) : (
        <Flex bg={"primary.80"} borderRadius={"20px"}>
          <SearchMenu />
          <Drawer
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            finalFocusRef={btnRef}
          >
            <DrawerOverlay />
            <DrawerContent
              bg={"primary.80"}
              sx={{ position: "fixed !important" }}
              height={'100%'}
            >
              <DrawerCloseButton bg={"transparent"} color={"text.primary"} />
              <DrawerHeader>
                <Flex gap={2}>
                  <Logo w={100} logo={theme.darkMode ? lightLogo : DarkLogo} />
                  <Logo
                    w={100}
                    logo={theme.darkMode ? darkImage : lightImage}
                  />
                </Flex>
              </DrawerHeader>
              <DrawerBody width={"100%"}>
                <VStack
                  divider={<StackDivider borderColor="text.primary" />}
                  spacing={4}
                  align="stretch"
                >
                  {sideBarData.data.map((dev) => {
                    return (
                      <Box
                        key={dev.id}
                        _hover={{ bg: "primary.80", opacity: 0.5 }}
                        p={2}
                        display={"flex"}
                        as={NavLink}
                        gap={3}
                        alignItems={"center"}
                        textAlign="left"
                        bg={"transparent"}
                        color={"text.primary"}
                        w="100%"
                        cursor={"pointer"}
                        to={dev.path}
                      >
                        <Icon as={dev.icon} />
                        {dev.name}
                      </Box>
                    );
                  })}
                  <Accordion
                    borderWidth={0}
                    borderStyle={"hidden"}
                    color={"text.primary"}
                    allowMultiple
                  >
                    <AccordionItem borderWidth={0} cursor={"pointer"}>
                      <AccordionButton
                        pl={0}
                        justifyContent={"space-between"}
                        gap={2}
                        as={Flex}
                        textAlign="left"
                      >
                        <Text>
                          <Avatar
                            mr={2}
                            size={"sm"}
                            name={
                              getUserInfo && getUserInfo().user_name
                                ? getUserInfo().user_name
                                : ""
                            }
                          />
                          {getUserInfo && getUserInfo().user_name
                            ? getUserInfo().user_name
                            : ""}
                        </Text>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <Box
                          _hover={{ bg: "primary.80", opacity: 0.5 }}
                          p={2}
                          as={Flex}
                          gap={3}
                          alignItems={"center"}
                          textAlign="left"
                          onClick={() => navigate("/profile")}
                          bg={"transparent"}
                          color={"text.primary"}
                          w="100%"
                          cursor={"pointer"}
                        >
                          <MdAccountCircle />
                          Profile
                        </Box>

                        <Box
                          _hover={{ bg: "primary.80", opacity: 0.5 }}
                          p={2}
                          as={Flex}
                          gap={3}
                          alignItems={"center"}
                          textAlign="left"
                          onClick={signOut}
                          bg={"transparent"}
                          color={"text.primary"}
                          w="100%"
                          cursor={"pointer"}
                        >
                          <FaSignOutAlt />
                          Sign Out
                        </Box>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Flex>
      )}
    </Flex>
    </Fade>
  );
}
export default NavBar;
