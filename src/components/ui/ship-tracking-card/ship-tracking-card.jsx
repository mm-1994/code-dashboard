import React, { useContext } from "react";
import { Box, Heading, Image, Tag, TagLabel, Icon } from "@chakra-ui/react";
import { CheckIcon, TimeIcon } from "@chakra-ui/icons";
import crane from "../../../assets/images/general/crane.png";
import anchor from "../../../assets/images/general/anchor.png";
import craneLight from "../../../assets/images/general/craneLight.png";
import anchorLight from "../../../assets/images/general/anchorLight.png";
import vessle from "../../../assets/images/general/vessle.png";
import { ThemeContext } from "../../../context/theme";
import moment from "moment-timezone";
import { RiShipLine } from "react-icons/ri";
import { useMediaQuery } from "@chakra-ui/react";
import "./ship-tracking-card.css";

function ShipTrackingCard({ left, right, event, index, length, events }) {
  const { darkMode } = useContext(ThemeContext);
  const [isNonMobile] = useMediaQuery("(min-width: 1200px)");
  return (
    <Box>
      {left && (
        <Box w={"100%"} h={200} display={"flex"} flexDir={"row"}>
          <Box
            w={isNonMobile ? "34%" : "100%"}
            display={"flex"}
            flexDir={"row"}
          >
            <Box
              w={"100%"}
              display={"flex"}
              flexDir={"column"}
              alignItems={isNonMobile ? "flex-end" : "flex-start"}
            >
              <Box
                backgroundColor={"primary.100"}
                boxShadow={
                  darkMode
                    ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                    : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                }
                paddingRight={"3%"}
                paddingLeft={"3%"}
                borderRadius={isNonMobile ? 35 : 50}
                h={isNonMobile ? "50%" : "45%"}
                width={"100%"}
                border={5}
                borderStyle={"solid"}
                borderColor={"action.100"}
                display={"flex"}
                flexDir={"row"}
                alignItems={"flex-start"}
              >
                <Box
                  w={"70%"}
                  height={"100%"}
                  display={"flex"}
                  alignItems={"center"}
                >
                  <Heading
                    color={"text.primary"}
                    fontSize={"xl"}
                    display={"flex"}
                    textAlign={isNonMobile ? "left" : "center"}
                  >
                    {event.vesselName}
                  </Heading>
                </Box>
                <Box
                  w={"30%"}
                  height={"100%"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Image alt="logo" h={"60%"} src={vessle} />
                </Box>
              </Box>
              <Box w={"80%"} height={"100%"} display={"flex"} flexDir={"row"}>
                <Box
                  backgroundColor={"transparent"}
                  w={isNonMobile ? "73.5%" : "0%"}
                  h={"57%"}
                />
                <Box
                  w={"20%"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Box
                    w={"15%"}
                    h={"100%"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    paddingLeft={isNonMobile ? "0%" : "7%"}
                  >
                    <Box
                      w={"100%"}
                      h={"100%"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      borderLeft={index === length - 1 ? 0 : 10}
                      borderRight={index === length - 1 ? 0 : 0}
                      borderStyle={"dotted"}
                      borderColor={"black"}
                    />
                  </Box>
                </Box>
              </Box>
              event
            </Box>
          </Box>
        </Box>
      )}
      {right && (
        <Box
          w={"100%"}
          display={"flex"}
          justifyContent={"flex-end"}
          flexDir={"row"}
        >
          <Box
            display={
              isNonMobile
                ? index == length - 1
                  ? "none"
                  : events[index + 1].vesselPosition
                  ? "none"
                  : "flex"
                : "none"
            }
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Icon
              as={RiShipLine}
              fontSize="md"
              color={darkMode ? "#C4C4C4" : "#5A5A5A"}
              marginTop={10}
            />
            <Heading
              color={darkMode ? "#C4C4C4" : "#5A5A5A"}
              fontSize={"small"}
              marginTop={1}
            >
              {"On " + event.vesselName}
            </Heading>
          </Box>
          <Box
            w={isNonMobile ? "75.5%" : "100%"}
            display={"flex"}
            flexDir={"row"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Box
              w={"100%"}
              display={"flex"}
              flexDir={"column"}
              alignItems={"flex-start"}
            >
              <Box
                backgroundColor={
                  event.completed && Object.keys(event.events).length > 0
                    ? "action.100"
                    : "table.cell"
                }
                w={
                  isNonMobile
                    ? Object.keys(event.events).length > 2
                      ? Object.keys(event.events).length * 237
                      : 640
                    : "100%"
                }
                borderTopLeftRadius={5}
                borderTopRightRadius={5}
                borderBottomLeftRadius={5}
                minHeight={isNonMobile ? "80px" : "40px"}
                border={2}
                borderStyle={"solid"}
                borderColor={"black"}
                display={"flex"}
                alignItems={"space-evenly"}
                flexDir={"row"}
              >
                <Box
                  w={isNonMobile ? 140 : "17%"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  borderRight={isNonMobile ? 2.5 : 2}
                  borderStyle={"solid"}
                  borderColor={"transparent"}
                >
                  <Image
                    h={
                      index === 0 || index == length - 1
                        ? isNonMobile
                          ? 70
                          : 55
                        : isNonMobile
                        ? 50
                        : 35
                    }
                    src={
                      index === 0 || index == length - 1
                        ? darkMode
                          ? crane
                          : craneLight
                        : darkMode
                        ? anchor
                        : anchorLight
                    }
                  />
                </Box>
                <Box
                  display={"flex"}
                  flexDir={"row"}
                  w={
                    isNonMobile
                      ? Object.keys(event.events).length > 2
                        ? Object.keys(event.events).length * 237 - 140
                        : 500
                      : "83%"
                  }
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  paddingRight={isNonMobile ? "2%" : "2%"}
                  paddingTop={isNonMobile ? "2%" : "2%"}
                  paddingBottom={isNonMobile ? "2%" : "2%"}
                >
                  <Heading color={"white"} fontSize={"xl"}>
                    {index === 0
                      ? "Port of Load: " +
                        event.port_name +
                        ", " +
                        event.country_name
                      : index === length - 1
                      ? "Port of Discharge: " +
                        event.port_name +
                        ", " +
                        event.country_name
                      : "Via: " + event.port_name + ", " + event.country_name}
                  </Heading>
                  {event.completed && Object.keys(event.events).length > 0 ? (
                    <CheckIcon w={6} h={6} color="white" />
                  ) : (
                    <TimeIcon w={6} h={6} color="black" />
                  )}
                </Box>
              </Box>
              <Box
                display={"flex"}
                w={isNonMobile ? "auto" : "100%"}
                flexDir={"row"}
              >
                <Box
                  w={isNonMobile ? 140 : " 20.5%"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Box
                    w={isNonMobile ? "8%" : "10%"}
                    h={"100%"}
                    maxW={"15px"}
                    minW={"12px"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Box
                      w={"100%"}
                      h={"100%"}
                      backgroundColor={
                        index === length - 1
                          ? "transparent"
                          : event.completed &&
                            Object.keys(event.events).length > 0
                          ? "action.100"
                          : "transparent"
                      }
                      alignItems={"center"}
                      justifyContent={"center"}
                      borderLeft={
                        index === length - 1
                          ? 0
                          : event.completed &&
                            Object.keys(event.events).length > 0
                          ? 2
                          : 10
                      }
                      borderRight={
                        index === length - 1
                          ? 0
                          : event.completed &&
                            Object.keys(event.events).length > 0
                          ? 2
                          : 0
                      }
                      borderStyle={
                        event.completed && Object.keys(event.events).length > 0
                          ? "solid"
                          : "dotted"
                      }
                      borderColor={"black"}
                    />
                  </Box>
                </Box>
                <Box
                  display={"flex"}
                  width={isNonMobile ? "auto" : "100%"}
                  flexDir={"column"}
                >
                  <Box
                    backgroundColor={"primary.100"}
                    boxShadow={
                      darkMode
                        ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                        : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                    }
                    p={2}
                    marginBottom={
                      isNonMobile
                        ? "20%"
                        : index < length - 1 && events[index + 1].vesselPosition
                        ? "20%"
                        : "10%"
                    }
                    w={
                      isNonMobile
                        ? Object.keys(event.events).length > 2
                          ? Object.keys(event.events).length * 237 - 140
                          : 500
                        : "100%"
                    }
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={isNonMobile ? "flex-start" : "center"}
                    minHeight={"100px"}
                    flexDir={isNonMobile ? "row" : "column"}
                    borderLeft={2}
                    borderRight={2}
                    borderBottom={2}
                    borderStyle={"solid"}
                    borderColor={"black"}
                    borderBottomRightRadius={5}
                    borderBottomLeftRadius={5}
                  >
                    {Object.keys(event.events).length === 0 ? (
                      <Heading color={"text.primary"} fontSize={"sm"}>
                        Insufficient/conflicting carrier data
                      </Heading>
                    ) : (
                      <>
                        {Object.keys(event.events).map((keyName, i) => (
                          <Box
                            display={"flex"}
                            flexDir={isNonMobile ? "row" : "column"}
                            alignItems={"center"}
                            justifyContent={"center"}
                          >
                            <Box display={"flex"} flexDir={"column"}>
                              <Tag
                                size="lg"
                                bgColor={"primary.80"}
                                borderRadius="full"
                                boxShadow={
                                  darkMode
                                    ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                                    : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                                }
                              >
                                {keyName.split("_")[1] === "actual" ? (
                                  <CheckIcon
                                    w={6}
                                    h={6}
                                    marginRight={4}
                                    color="action.100"
                                  />
                                ) : (
                                  <TimeIcon
                                    w={6}
                                    h={6}
                                    marginRight={4}
                                    color={darkMode ? "white" : "black"}
                                  />
                                )}
                                <TagLabel>
                                  <Heading
                                    color={"text.primary"}
                                    fontSize={"sm"}
                                  >
                                    {keyName.split("_")[0]}
                                  </Heading>
                                </TagLabel>
                              </Tag>
                              <Box
                                display={
                                  isNonMobile
                                    ? "flex"
                                    : i === Object.keys(event.events).length - 1
                                    ? "flex"
                                    : "none"
                                }
                                flexDir={"column"}
                              >
                                <Heading
                                  color={"text.primary"}
                                  fontSize={12}
                                  marginLeft={2}
                                  marginTop={2}
                                >
                                  {event.events[keyName]
                                    ? moment(event.events[keyName])
                                        .parseZone()
                                        .format("DD/MM/YYYY, HH:mm:ss")
                                    : "-"}
                                </Heading>
                                <Heading
                                  color={darkMode ? "#C4C4C4" : "#5A5A5A"}
                                  fontSize={12}
                                  marginTop={2}
                                  marginLeft={2}
                                >
                                  {keyName.split("_")[1] === "actual"
                                    ? "Actual"
                                    : "Predictive"}
                                </Heading>
                              </Box>
                            </Box>

                            <Box
                              display={
                                i === Object.keys(event.events).length - 1
                                  ? "none"
                                  : "flex"
                              }
                              height={20}
                              alignItems={isNonMobile ? "center" : "normal"}
                              justifyContent={isNonMobile ? "center" : "normal"}
                              paddingBottom={"22%"}
                            >
                              <Box
                                h={isNonMobile ? 2 : 20}
                                display={"flex"}
                                flexDir={"row"}
                              >
                                <Box
                                  w={isNonMobile ? 20 : 45}
                                  h={isNonMobile ? 2 : 20}
                                  backgroundColor={
                                    keyName.split("_")[1] === "actual"
                                      ? "action.100"
                                      : "transparent"
                                  }
                                  alignItems={"center"}
                                  justifyContent={"center"}
                                  marginLeft={isNonMobile ? "0" : "50%"}
                                  borderTop={
                                    keyName.split("_")[1] === "actual"
                                      ? isNonMobile
                                        ? 2
                                        : 0
                                      : isNonMobile
                                      ? 10
                                      : 0
                                  }
                                  borderBottom={
                                    keyName.split("_")[1] === "actual"
                                      ? isNonMobile
                                        ? 2
                                        : 0
                                      : isNonMobile
                                      ? 0
                                      : 0
                                  }
                                  borderLeft={
                                    keyName.split("_")[1] === "actual"
                                      ? isNonMobile
                                        ? 0
                                        : 2
                                      : isNonMobile
                                      ? 0
                                      : 10
                                  }
                                  borderRight={
                                    keyName.split("_")[1] === "actual"
                                      ? isNonMobile
                                        ? 0
                                        : 2
                                      : isNonMobile
                                      ? 0
                                      : 0
                                  }
                                  borderStyle={
                                    keyName.split("_")[1] === "actual"
                                      ? "solid"
                                      : "dotted"
                                  }
                                  borderColor={"black"}
                                />
                                <Box
                                  display={isNonMobile ? "none" : "flex"}
                                  flexDir={"column"}
                                >
                                  <Heading
                                    color={"text.primary"}
                                    fontSize={12}
                                    marginTop={2}
                                    marginLeft={2}
                                  >
                                    {event.events[keyName]
                                      ? moment(event.events[keyName])
                                          .parseZone()
                                          .format("DD/MM/YYYY, HH:mm:ss")
                                      : "-"}
                                  </Heading>
                                  <Heading
                                    color={"#C0C0C0"}
                                    fontSize={12}
                                    marginTop={2}
                                    marginLeft={2}
                                  >
                                    {keyName.split("_")[1] === "actual"
                                      ? "Actual"
                                      : "Predictive"}
                                  </Heading>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </>
                    )}
                  </Box>
                  <Box
                    display={
                      !isNonMobile
                        ? index == length - 1
                          ? "none"
                          : events[index + 1].vesselPosition
                          ? "none"
                          : "flex"
                        : "none"
                    }
                    flexDir={"column"}
                    alignItems={"flex-start"}
                    justifyContent={"flex-start"}
                    marginBottom={"15%"}
                  >
                    <Icon
                      as={RiShipLine}
                      fontSize="md"
                      color={darkMode ? "#C4C4C4" : "#5A5A5A"}
                      marginTop={10}
                    />
                    <Heading
                      color={darkMode ? "#C4C4C4" : "#5A5A5A"}
                      fontSize={"small"}
                      marginTop={1}
                    >
                      {"On " + event.vesselName}
                    </Heading>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default ShipTrackingCard;
