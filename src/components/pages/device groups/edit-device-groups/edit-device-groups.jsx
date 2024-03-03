import React, { useState, useEffect, useContext } from "react";
import {
  Flex,
  Box,
  Heading,
  Button,
  IconButton,
  Icon,
  Switch,
  InputGroup,
  Input,
  InputLeftElement,
  Circle,
  Fade,
  Spinner,
  Text,
  Center
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { ThemeContext } from "../../../../context/theme";
import { EditIcon, DeleteIcon, CloseIcon, CheckIcon } from "@chakra-ui/icons";
import {
  getDeviceGroup,
  editDeviceGroup,
  deleteDeviceGroup,
} from "../../../../api/device-groups";
import { useParams } from "react-router-dom";
import { showsuccess } from "../../../../helpers/toast-emitter";
import FunctionalModal from "../../../ui/functional-modal/functional-modal";
import { useNavigate } from "react-router";
import { PERMISSIONS } from "../../../../types/devices";
import { hasPermission } from "../../../../helpers/permissions-helper";
import { UsersContext } from "../../../../context/users";
import CyLockIcon from "../../../ui/icon/cylock-icon";
import CyTagIcon from "../../../ui/icon/cytag-icon";
import { useMediaQuery } from "@chakra-ui/react";
import "./edit-device-groups.css";

function EditDeviceGroup() {
  const { id } = useParams();
  const [isDisabled, setIsDisabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const usersCtx = useContext(UsersContext);
  const [currentUserDevices, setCurrentUserDevices] = useState(undefined);
  const [deviceGroupDevices, setDeviceGroupDevices] = useState([]);
  const [devicesSelected, setDevicesSelected] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const [isNonMobile] = useMediaQuery("(min-width: 500px)");
  const themeCtx = useContext(ThemeContext);


  useEffect(() => {
    getDeviceGroup(id).then((res) => {
      const devices = [];
      res.data.data.devices.forEach((device) => {
        devices.push(device.id);
      });
      setDeviceGroupDevices(devices);
      setDevicesSelected(devices);
      setLoading(false);
    }).catch(()=>{      setLoading(false);
    });
  }, []);

  useEffect(() => {
    usersCtx.getDevicesCall();
  }, []);

  useEffect(() => {
    setCurrentUserDevices(usersCtx.devices);
    setFilteredData(usersCtx.devices);
  }, [usersCtx.devices]);

  const handleEditDeviceGroup = () => {
    setLoading(true);
    editDeviceGroup(parseInt(id), devicesSelected).then((res) => {
      setIsDisabled(true);
      showsuccess("Successfully edited Device Group");
      getDeviceGroup(id).then((res) => {
        const devices = [];
        res.data.data.devices.forEach((device) => {
          devices.push(device.id);
        });
        setDeviceGroupDevices(devices);
        setDevicesSelected(devices);
        setLoading(false);
      });
    }).catch(()=>{ setLoading(false);
    });
  };

  const handleDeleteDeviceGroup = () => {
    deleteDeviceGroup(parseInt(id)).then((res) => {
      setIsDisabled(true);
      showsuccess("Successfully deleted group");
      setLoading(true);
      navigate("/view-device-groups");
    });
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
            justifyContent={"space-between"}
            mb={4}
            display={"flex"}
            flexWrap={'wrap'}
            gap={4}
          >
            <InputGroup  width={250} >
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="action.100" />
              </InputLeftElement>
              <Input
                placeholder={
                  currentUserDevices
                    ? `search in ${currentUserDevices.length} devices`
                    : "Loading ... "
                }
                boxShadow={
                  themeCtx.darkMode
                    ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                    : "3px 2px 7px 1px rgba(0,0,0,0.2)"
                }
                color={"text.primary"}
                htmlSize={10}

                bgColor={"primary.80"}
                borderRadius={"20px"}
                variant={"outline"}
                onChange={handleSearch}
                me={2}
                width={250}
                borderWidth={0}
              />
            </InputGroup>
          <Box display={'flex'} flexDir={'row'} alignItems={'center'}>
            {hasPermission(PERMISSIONS.DELETE_DEVICE_GROUP) && (
              <FunctionalModal
                modalTitle={"Delete Device Group"}
                btnTitle={"Delete Group"}
                btnColor={"primary.60"}
                isDisabled={devicesSelected.length === 0}
                btnSize={"lg"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                cancelable={true}
                modalMinH={"300px"}
                iconBtn={DeleteIcon}
                btnAction={
                  <Button
                    onClick={handleDeleteDeviceGroup}
              w={"fit-content"}
                backgroundColor={"primary.80"}
                boxShadow={
                  themeCtx.darkMode
                    ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                    : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                }
                color={"danger.100"}
                _hover={{ color: "primary.100", bg: "primary.60" }}
                  >
                    Delete
                  </Button>
                }
              >
                   <Text
        color={"text.primary"}
        textAlign={"center"}
        fontWeight={"bold"}
        py={20}
      >
        Are you sure you want to delete this device group?
      </Text>
              </FunctionalModal>
            )}

            {hasPermission(PERMISSIONS.EDIT_DEVICE_GROUP) && (
              <IconButton
                onClick={() => {
                  setDevicesSelected([...deviceGroupDevices]);
                  setIsDisabled(!isDisabled);
                }}
                size={'lg'} 
                boxShadow={
                  themeCtx.darkMode
                    ? "5px 4px 15px 1px rgba(0,0,0,1)"
                    : "5px 7px 15px 1px rgba(0,0,0,0.3)"
                }
                 rounded={'full'} bg={"primary.60"} marginLeft={2}
                icon={
                  <Icon
                    boxSize={"20px"}
                    as={isDisabled ? EditIcon : CloseIcon}
                    color={"primary.80"}
                  />
                }
              />
            )}
            {!isDisabled && (
              <IconButton
                onClick={handleEditDeviceGroup}
                size={'lg'} 
                boxShadow={
                  themeCtx.darkMode
                    ? "5px 4px 15px 1px rgba(0,0,0,1)"
                    : "5px 7px 15px 1px rgba(0,0,0,0.3)"
                }
                 rounded={'full'} bg={"primary.60"} marginLeft={2}
                isDisabled={isDisabled}
                icon={
                  <Icon
                    boxSize={"20px"}
                    as={CheckIcon}
                    color={"primary.80"}
                  />
                }
              />
            )}
            </Box>
          </Box>
          <Box
            width={"100%"}
            display={"flex"}
            flexWrap={"wrap"}
            alignItems={"center"}
            justifyContent={"space-evenly"}
            flexDir={"row"}
          >
            {filteredData &&
              filteredData.map((device, index) => (
                <Box width={"30%"} minWidth={"350px"}>
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
                          isDisabled={isDisabled}
                          isChecked={devicesSelected.includes(device.id)}
                          onChange={handleSwitchClick}
                          id={device.id}
                        />
                      </Box>
                    </Box>
                  </Fade>
                </Box>
              ))}
            {filteredData &&
              Array(3 - (filteredData.length % 3))
                .fill(true)
                .map(() => {
                  return <Box width={"30%"} minWidth={"350px"}></Box>;
                })}
          </Box>
        </>
      )}
    </Flex>
  );
}

export default EditDeviceGroup;
