import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Circle,
  Fade,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Switch,
  Spinner,
  Text,
  Center
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createDeviceGroup } from "../../../../api/device-groups";
import { ThemeContext } from "../../../../context/theme";
import { UsersContext } from "../../../../context/users";
import { showsuccess } from "../../../../helpers/toast-emitter";
import FunctionalModal from "../../../ui/functional-modal/functional-modal";
import CyLockIcon from "../../../ui/icon/cylock-icon";
import CyTagIcon from "../../../ui/icon/cytag-icon";
import "./create-device-groups.css";

function CreateDeviceGroup() {
  const [loading, setLoading] = useState(true);
  const usersCtx = useContext(UsersContext);
  const [currentUserDevices, setCurrentUserDevices] = useState([]);
  const [devicesSelected, setDevicesSelected] = useState([]);
  const [filteredData, setFilteredData] = useState(undefined);
  const navigate = useNavigate();
  const themeCtx = useContext(ThemeContext);
  const [name, setName] = useState("");
  const [isNameError, setIsNameError] = useState(true);
  const [nameError, setNameError] = useState("");
  const [nameInputFocus, setNameInputFocus] = useState(false);

  useEffect(() => {
    usersCtx.getDevicesCall();
  }, []);

  useEffect(() => {
    if (name === "") {
      setIsNameError(true);
      setNameError("Name is required.");
    } else if (name.length <= 3) {
      setIsNameError(true);
      setNameError("Name must be at least 4 characters.");
    } else {
      setIsNameError(false);
    }
  }, [name]);

  useEffect(() => {
    if (name === "") {
      setIsNameError(true);
      setNameError("Name is required.");
    } else if (name.length <= 3) {
      setIsNameError(true);
      setNameError("Name must be at least 4 characters.");
    } else {
      setIsNameError(false);
    }
  }, [name]);

  useEffect(() => {
    if (usersCtx) {
      setCurrentUserDevices(usersCtx.devices);
      setFilteredData(usersCtx.devices);
    }
  }, [usersCtx]);

  useEffect(() => {
    if (filteredData && loading) {
      setLoading(false);
    }
  }, [filteredData]);

  const handleFocus = (e) => {
    if (!nameInputFocus) {
      setNameInputFocus(true);
    }
  };
  const handleSwitchClick = (e) => {
    if (e.target.checked) {
      devicesSelected.push(e.target.id);
      setDevicesSelected([...devicesSelected]);
    } else {
      const index = devicesSelected.indexOf(e.target.id);
      if (index !== -1) {
        devicesSelected.splice(index, 1);
        setDevicesSelected([...devicesSelected]);
      }
    }
  };

  const handleCreateDeviceGroup = () => {
    createDeviceGroup(name, devicesSelected).then((res) => {
      showsuccess("Successfully created device group");
      navigate("/view-device-groups");
    });
  };

  const handleSearch = (e) => {
    if (e.target.value != "") {
      const filter = currentUserDevices.filter((device) => {
        if (
          device.id.toLowerCase().includes(e.target.value.toLowerCase()) ||
          device.name.toLowerCase().includes(e.target.value.toLowerCase())
        ) {
          return true;
        } else {
          return false;
        }
      });

      setFilteredData(filter);
    } else {
      setFilteredData(currentUserDevices);
    }
  };

  return (
    <Flex
    px={2}
    pb={2}
    flexWrap={"wrap"}
    w={"100%"}
    justifyContent={"center"}
    alignItems={"center"}
    flexDir={"column"}
    gap={2}
    >
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
          <Box
            width={"100%"}
            alignItems={"center"}
            justifyContent={"flex-end"}
            mb={4}
            display={"flex"}
          >
            <InputGroup justifyItems={"baseline"}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="action.100" />
              </InputLeftElement>
              <Input
                placeholder="search"
                htmlSize={10}
                bgColor={"primary.80"}
                borderRadius={"20px"}
                variant={"outline"}
                onChange={handleSearch}
                me={2}
                width={250}
                boxShadow={
                  themeCtx.darkMode
                    ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                    : "3px 2px 7px 1px rgba(0,0,0,0.2)"
                }
                color={"text.primary"}
           
              />
            </InputGroup>
          </Box>
          <Box
            width={"100%"}
            display={"flex"}
            flexWrap={"wrap"}
            alignItems={"center"}
            justifyContent={"space-evenly"}
            flexDir={"row"}
            mb={5}
          >
            {filteredData &&
              filteredData.map((device, index) => (
                <Box width={"30%"} minWidth={"350px"} >
                  <Fade in delay={(index + 1) / 10}>
                    <Box
                    width={"30%"}
                    minWidth={"350px"}
                    height={"75"}
                    borderRadius={"10px"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    marginBottom={2}
                    p={4}
                    flexDir={"row"}
                    bgColor={"primary.80"}
                    boxShadow={
                      themeCtx.darkMode
                        ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                        : "3px 2px 7px 1px rgba(0,0,0,0.2)"
                    }
                    color={
                      themeCtx.theme.colors &&
                      themeCtx.theme.colors.text.primary
                    }
                    >
                      <Box
                        display={"felx"}
                        alignItems={"center"}
                        justifyContent={"flex-start"}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                          }}
                        >
                          {device.device_type === "cytag" ? (
                            <Box>
                              <Circle
                                size="40px"
                                borderRadius={"40%"}
                                position={"relative"}
                                top={"25%"}
                                bg={"primary.60"}
                              >
                                <CyTagIcon
                                  boxSize={"40px"}
                                  display={"block"}
                                  margin={"auto"}
                                  p={"15%"}
                                  color={
                                    themeCtx.theme.colors &&
                                    themeCtx.theme.colors.text.primary
                                  }
                                />
                              </Circle>
                            </Box>
                          ) : (
                            <Box>
                              <Circle
                                size="40px"
                                borderRadius={"40%"}
                                position={"relative"}
                                top={"25%"}
                                bg={"primary.60"}
                              >
                                <CyLockIcon
                                  boxSize={"40px"}
                                  display={"block"}
                                  margin={"auto"}
                                  p={"15%"}
                                  color={
                                    themeCtx.theme.colors &&
                                    themeCtx.theme.colors.text.primary
                                  }
                                />
                              </Circle>
                            </Box>
                          )}
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                marginBottom: "3%",
                              }}
                            >
                              <Heading
                                display={"flex"}
                                justifyContent={"flex-start"}
                                textIndent={10}
                                alignItems={"center"}
                                color={"text.primary"}
                                fontSize={"sm"}
                              >
                                Name:
                              </Heading>
                              <Heading
                                display={"flex"}
                                justifyContent={"flex-start"}
                                textIndent={5}
                                alignItems={"center"}
                                color={"text.primary"}
                                fontSize={"sm"}
                              >
                                {device.name}
                              </Heading>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "row" }}>
                              <Heading
                                display={"flex"}
                                justifyContent={"flex-start"}
                                textIndent={10}
                                alignItems={"center"}
                                color={"text.primary"}
                                fontSize={"sm"}
                              >
                                IMEI:
                              </Heading>
                              <Heading
                                display={"flex"}
                                justifyContent={"flex-start"}
                                textIndent={5}
                                alignItems={"center"}
                                color={"text.primary"}
                                fontSize={"sm"}
                              >
                                {device.id}
                              </Heading>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                      <Box>
                        <Switch
                          sx={{
                            "span.chakra-switch__track:not([data-checked])": {
                              backgroundColor: "primary.100",
                            },
                            "span.chakra-switch__thumb": {
                              backgroundColor: "primary.80",
                            },
                            'span.chakra-switch__track[data-checked]': { backgroundColor: 'action.100' }
                          }}
                          size="lg"
                          isChecked={devicesSelected.includes(device.id)}
                          onChange={handleSwitchClick}
                          id={device.id}
                        />
                      </Box>
                    </Box>
                  </Fade>
                </Box>
              ))}
            {Array(3 - (filteredData.length % 3))
              .fill(true)
              .map(() => {
                return <Box width={"30%"} minWidth={"350px"}></Box>;
              })}
          </Box>
          <FunctionalModal
            modalTitle={"Create New Device Group"}
            btnTitle={"Create New Device Group"}
            btnColor={"primary.60"}
            isDisabled={devicesSelected.length === 0}
            btnSize={"lg"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            modalMinH={"300px"}
            modalMinW={"100px"}
            btnAction={
              <Button
                onClick={handleCreateDeviceGroup}
                bg={'primary.80'}
                isDisabled={isNameError}
                color={'text.primary'}
                boxShadow={
                  themeCtx.darkMode
                    ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                    : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                }
                p={5}
                mr={2}
                _hover={{color:'primary.100', bg:'primary.60'}}
              >
                Create
              </Button>
            }
          >
            <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                pt={7}
                px={10}
              >
                <Text
                  alignItems={"center"}
                  justifyContent={"center"}
                  fontWeight={"bold"}
                  color={"text.primary"}
                  mb={10}
                  mr={2}
                >
                  Name:
                </Text>
                <FormControl isInvalid={isNameError && nameInputFocus}>
                  <Input
                    value={name}
                    placeholder="Name"
                    onFocus={handleFocus}
                    onChange={(e) => setName(e.target.value)}
                    bg={"primary.80"}
                    color={"text.primary"}
                    borderRadius={0}
                    border={0}
                    height={45}
                    width={330}
                    borderBottom={4}
                    borderStyle={"solid"}
                    borderColor={"action.100"}
                    boxShadow={
                      themeCtx.darkMode
                        ? "5px 10px 15px 1px rgba(0,0,0,1)"
                        : "5px 8px 15px 1px rgba(0,0,0,0.2)"
                    }
                    _autofill={{
                      textFillColor: "text.primary",
                      boxShadow: `0 0 0px 1000px ${
                        themeCtx.darkMode ? "#171821" : "#Primary.80"
                      } inset`,
                      textFillColor: themeCtx.darkMode ? "#FFFFFF" : "#000000",
                    }}
                    _focus={{
                      border: 0,
                      borderBottom: 5,
                      borderStyle: "solid",
                      borderColor: "action.100",
                    }}
                    _hover={{
                      border: 0,
                      borderBottom: 4,
                      borderStyle: "solid",
                      borderColor: "action.100",
                    }}
                  />
                  {isNameError && nameInputFocus ? (
                    <FormErrorMessage fontWeight={'bold'} alignItems={'flex-start'} pt={2} marginTop={0} minH={10}>{nameError}</FormErrorMessage>
                  ) : (
                    <Box minH={10}></Box>
                  )}
                </FormControl>
              </Box>
          </FunctionalModal>
        </>
      )}
    </Flex>
  );
}

export default CreateDeviceGroup;
