/* eslint-disable no-unused-expressions */
import React from "react";
import {
  Box,
  Text,
  Image,
  Spinner,
  Center
} from "@chakra-ui/react";
import "./card.css";
import { useMediaQuery } from "@chakra-ui/react";

function StatCard(props) {
  const {
    icon,
    title,
    subTitle,
    bgColor,
    textColor,
    handleClick,
    width,
    clicked,
    handleClickScroll,
    imageH,
    themeCtx,
    loading
  } = props;
  const [isNoneMobile] = useMediaQuery("(min-width: 600px)");
  return (
    <Box
    p={1}
    pl={isNoneMobile ? 7 : 0}
    display={"flex"}
      bg={clicked ? "action.100" : bgColor}
      color={textColor}
      borderRadius={"10px"}
      overflow={"hidden"}
      minH={isNoneMobile ? '60px' : '90px'}
      cursor={"pointer"}
      w={width}
      boxShadow={
        themeCtx.darkMode
          ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
          : "5px 4px 15px 1px rgba(0,0,0,0.2)"
      }
      onClick={() => {
        handleClick ? handleClick(title) : null;
        handleClickScroll ? handleClickScroll() : null;
      }}
      _hover={handleClick ? { bg: "action.100" } : {}}
    >
      <Box display={"flex"}flexDir={isNoneMobile ? 'row' : 'column'} alignItems={'center'} w={"100%"} justifyContent={isNoneMobile ? loading? 'center' : 'flex-start' : 'center'}>
        {!loading? (
          <>
            <Box pr={isNoneMobile ? 7 : 0}>
              <Image
                position={"relative"}
                src={icon}
                h={imageH}
              ></Image>
            </Box>
            <Box p={1} flexDirection={"row"} display={"flex"} alignItems={"center"} >
              <Box flexDirection={"row"} display={"flex"} justifyContent={"space-evenly"} >
                <Text  fontSize={isNoneMobile ? "lg" : "md"} fontWeight={"bold"}>
                  {subTitle}
                </Text>
                <Text fontSize={"lg"} textIndent={8}>{title}</Text>

              </Box>
            </Box>
          </>):
          (                        
          <Center w={"100%"}>
            <Spinner
              thickness="6px"
              speed="0.85s"
              emptyColor="text.primary"
              color="primary.60"
              size="xl"
            />
        </Center>)}
      
      </Box>
    </Box>
  );
}

export default StatCard;
