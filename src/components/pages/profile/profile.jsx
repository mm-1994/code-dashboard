import React, { useEffect, useState, useContext } from "react";
import {
  Avatar,
  Box,
  Flex,
  Image,
  Heading,
  Button,
  HStack,
  Tag,
  TagLabel,
  Center,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import ProfileCoverImage from "../../../assets/images/general/Abstract_LinkedIn_Background.webp";
import { getMyUser } from "../../../api/user-management";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { sendVerificationEmail } from "../../../api/user-management";
import { showsuccess } from "../../../helpers/toast-emitter";
import "./profile.css";
import { ThemeContext } from "../../../context/theme";

function Profile() {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [isNonMobile] = useMediaQuery("(min-width: 600px)");
  const themeCtx = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    getMyUser().then((res) => {
      setUser(res.data);
      setLoading(false);
    });
  }, []);

  const verifyEmail = () => {
    sendVerificationEmail().then((res) => {
      showsuccess("Successfully sent verification email");
    });
  };

  const userDetails = (title, value) => {
    return (
      <Box display={"flex"} flexDir={"row"} alignItems={"flex-start"} mb={2}>
        <Heading mr={2} fontSize={"xs"} color={"text.primary"}>
          {title}
        </Heading>
        <Text color={"text.primary"} fontSize={"xs"} fontWeight={"bold"}>
          {value}
        </Text>
      </Box>
    );
  };

  const datailsRow = (title, value) => {
    return (
      <Box minWidth={"300px"} display={"flex"} flexDir={"row"}>
        <Heading mr={2} fontSize={"md"} mb={1} color={"text.primary"}>
          {title}
        </Heading>
        <HStack>
          <Tag
            borderRadius={"20px"}
            variant="solid"
            bg={"primary.60"}
            boxShadow={
              themeCtx.darkMode
                ? "5px 4px 15px 1px rgba(0,0,0,0.9)"
                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
            }
          >
            <TagLabel mt={title === "Password:" ? 1.5 : 0}>
              {" " + value}
            </TagLabel>
          </Tag>
        </HStack>
      </Box>
    );
  };

  const detailsColumn = (number, title) => {
    return (
      <Box
        width={"33%"}
        display={"flex"}
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        minWidth={"250px"}
      >
        <Heading fontSize={"2xl"} mb={2} color={"text.primary"}>
          {number}
        </Heading>
        <Heading fontSize={"xl"} mb={5} color={"text.primary"}>
          {title}
        </Heading>
      </Box>
    );
  };

  return (
    <>
      <Flex p={2} pt={0} w={"100%"} display={"flex"} flexDirection={"column"}>
        {loading ? (
          <Center w={"100%"} h={"80vh"}>
            <Spinner
              thickness="6px"
              speed="0.85s"
              emptyColor="text.primary"
              color="primary.60"
              size="xl"
            />
          </Center>
        ) : (
          <>
            <Image
              alt="logo"
              borderRadius={15}
              height={200}
              width={"100%"}
              src={ProfileCoverImage}
              boxShadow={
                themeCtx.darkMode
                  ? "5px 4px 15px 1px rgba(0,0,0,0.9)"
                  : "5px 4px 15px 1px rgba(0,0,0,0.2)"
              }
            />
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              marginTop={-20}
            >
              <Box backgroundColor={"primary.100"} borderRadius={"50%"} p={2}>
                <Avatar
                  size={"2xl"}
                  bg="primary.60"
                  name={user && user.user_name}
                />
              </Box>
            </Box>
            <Box
              width={"100%"}
              display={"flex"}
              flexDir={"column"}
              alignItems={"center"}
              justifyContent={"flex-start"}
            >
              <Heading fontSize={"2xl"} mb={4} color={"text.primary"}>
                {user && user.user_name}
              </Heading>
              {userDetails(
                "Device Group:",
                user
                  ? user.device_group
                    ? user.device_group.name
                    : "No Device Group"
                  : "No Device Group"
              )}
              {userDetails("Role:", user && user.super_role.name)}

              <Box
                display={"flex"}
                flexDir={"column"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Box
                  display={"flex"}
                  flexDir={isNonMobile ? "row" : "column"}
                  mt={8}
                  alignItems={"center"}
                  justifyContent={"flex-start"}
                >
                  {datailsRow(
                    "Email:",
                    user && user.email ? user.email : "No Email Added"
                  )}
                  <Box
                    width={"8%"}
                    minWidth={isNonMobile ? "120px" : "100px"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    {user && user.email_verified === 1 ? (
                      <CheckCircleIcon
                        borderRadius={"10"}
                        boxShadow={
                          themeCtx.darkMode
                            ? "5px 4px 15px 1px rgba(0,0,0,0.9)"
                            : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                        }
                        h={5}
                        w={5}
                        m={isNonMobile ? 0 : 2}
                        color="success.100"
                      />
                    ) : (
                      <Button
                        sx={{
                          backgroundColor: "transparent",
                          textDecoration: "underline",
                          color: "#1F51FF",
                        }}
                        fontSize={10}
                        _hover={{ color: "text.primary" }}
                        _active={{ backgroundColor: "transparent" }}
                        onClick={verifyEmail}
                      >
                        Verify
                      </Button>
                    )}
                  </Box>
                </Box>

                <Box
                  display={"flex"}
                  flexDir={isNonMobile ? "row" : "column"}
                  alignItems={"center"}
                  w={"fit-content"}
                  justifyContent={"flex-start"}
                >
                  {datailsRow("Password:", "****************")}
                  <Box
                    width={"8%"}
                    minWidth={isNonMobile ? "120px" : "100px"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Button
                      onClick={() => {
                        navigate("/user/change-password");
                      }}
                      sx={{
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                        color: "#1F51FF",
                      }}
                      fontSize={10}
                      _hover={{ color: "text.primary" }}
                      _active={{ backgroundColor: "transparent" }}
                    >
                      Change
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box
              width={"100%"}
              mt={12}
              display={"flex"}
              flexDir={isNonMobile ? "row" : "column"}
              alignItems={"center"}
              justifyContent={"space-evenly"}
            >
              {detailsColumn(user && user.devices.length, "Devices")}
              {detailsColumn(user && user.roles.length, "Roles")}
              {detailsColumn(
                user && user.scheduled_reports.length,
                "Scheduled Reports"
              )}
            </Box>
          </>
        )}
      </Flex>
    </>
  );
}

export default Profile;
