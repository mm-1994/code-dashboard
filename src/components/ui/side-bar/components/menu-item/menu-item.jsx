import React, { useContext } from "react";
import {
  Flex,
  Text,
  Icon,
  Link,
  Menu,
  MenuButton,
  Fade,
} from "@chakra-ui/react";
import { ThemeContext } from "../../../../../context/theme";
import { NavLink } from "react-router-dom";

export default function MenuItem({
  icon,
  title,
  active,
  navSize,
  path,
  displayText,
}) {
  const theme = useContext(ThemeContext);
  return (
    <Flex
      flexDir="column"
      w="100%"
      transition={"width 1s, height 1s"}
      display={"flex"}
      alignItems={navSize === "small" ? "center" : "flex-start"}
      justifyContent={"center"}
    >
      <Menu placement="right">
        <Link
          transition={"all 1s"}
          as={NavLink}
          backgroundColor={
            navSize === "small"
              ? active && "action.100"
              : active && "action.100"
          }
          p={3}
          display={"flex"}
          alignContent={"center"}
          justifyContent={"center"}
          borderRadius={8}
          _hover={{
            textDecor: "none",
            backgroundColor: active ? "action.100" : "primary.100",
          }}
          w={navSize === "large" && "100%"}
          to={path}
          boxShadow={
            active
              ? theme.darkMode
                ? "0px 2.5px 8px 1px rgba(0,0,0,0.9)"
                : "0px 2.5px 8px 1px rgba(0,0,0,0.2)"
              : "none"
          }
        >
          <MenuButton
            alignItems={navSize === "small" ? "center" : "flex-start"}
            h={"100%"}
            w="100%"
            transition={"all 1s"}
          >
            <Flex>
              <Icon
                as={icon}
                fontSize="22"
                color={
                  navSize === "small"
                    ? active
                      ? "primary.100"
                      : "primary.60"
                    : active
                    ? "primary.100"
                    : "primary.60"
                }
              />
              <Fade in={displayText} delay={0.1}>
                <Text
                  w={"100%"}
                  fontSize="sm"
                  color={
                    navSize === "small"
                      ? active
                        ? "action.100"
                        : "primary.60"
                      : active
                      ? "primary.100"
                      : "primary.60"
                  }
                  fontWeight={active ? "semibold" : "normal"}
                  ml={5}
                  display={displayText && navSize === "large" ? "flex" : "none"}
                  transition={"all 1s"}
                >
                  {title}
                </Text>
              </Fade>
            </Flex>
          </MenuButton>
        </Link>
      </Menu>
    </Flex>
  );
}
