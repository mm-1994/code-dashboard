import React, { useState, useEffect, useContext } from "react";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  HStack,
  Tag,
  TagLabel,
  Fade,
  Button,
  Text,
} from "@chakra-ui/react";
import useScreenSize from "../../../hooks/screen-size";
import { SCREEN_SIZE } from "../../../types/screen";
import StyledSelect from "../../ui/styled-select/styled-select";
import { PERMISSIONS } from "../../../types/devices";
import { hasPermission } from "../../../helpers/permissions-helper";
import FunctionalModal from "../../ui/functional-modal/functional-modal";
import { assignRoles } from "../../../api/user-management";
import { showsuccess } from "../../../helpers/toast-emitter";
import { EditIcon } from "@chakra-ui/icons";
import { ThemeContext } from "../../../context/theme";

function BundleCard({
  user,
  title,
  subtitle,
  role,
  device,
  index,
  //   setUsers,
  gettingAllUsers,
  allRoles,
  allDeviceGroups,
  id,
  description,
  mrc,
}) {
  const size = useScreenSize();
  //   const [deviceGroups, setDeviceGroups] = useState([]);
  const [deviceGroup, setDeviceGroup] = useState("");
  const [userRole, setUserRole] = useState("");
  //   const [allRoles, setRoles] = useState([]);
  const [isSelectError, setIsSelectError] = useState(true);
const themeCtx=useContext(ThemeContext)
  const editUser = () => {
    assignRoles(user.id, parseInt(userRole), parseInt(deviceGroup)).then(
      (res) => {
        showsuccess("Successfully updated user roles");
        gettingAllUsers();
      }
    );
  };

  useEffect(() => {
    setDeviceGroup(user.device_group ? user.device_group.id : "");
    setUserRole(user.super_role ? user.super_role.id : "");
  }, []);

  useEffect(() => {
    if (userRole === "-1" || userRole === "") {
      setIsSelectError(true);
    } else {
      setIsSelectError(false);
    }
  }, [userRole]);

  return (
    <Box width={"30%"} minWidth={"350px"}>
      <Fade in delay={(index + 1) / 10}>
        <Box
         boxShadow={
          themeCtx.darkMode
            ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
            : "3px 2px 7px 1px rgba(0,0,0,0.2)"
        }
          flexWrap={size === SCREEN_SIZE.LG ? "nowrap" : "wrap"}
          w={"100%"}
          minWidth={"350px"}
          as={Flex}
          alignItems={"center"}
          justifyContent={"space-evenly"}
          p={4}
          gap={5}
          borderRadius={"10px"}
          color={"text.primary"}
          bg={"primary.80"}
          flexDir={"column"}
          _hover={{
            transition: "0.4s ease-in",
            transform: " translateY(-5%)",
            borderColor: "action.100",
          }}
          sx={{
            transition: "0.4s ease-in",
            borderWidth: "0.15vw",
            borderStyle: "solid",
            borderColor: "transparent",
          }}
        >
          <Box top={2} right={2} borderRadius={"10px"} position={"absolute"}>
            {hasPermission(PERMISSIONS.EDIT_USERS) && (
              <FunctionalModal
              modalMinW={"100px"}
                modalMinH={"300px"}
                modalTitle={"Edit " + user.name}
                btnColor={"primary.60"}
                btnTitle={"Edit " + user.name}
                btnSize={"md"}
                iconBtn={EditIcon}
                btnAction={
                  <Button
                  bg={'primary.80'} color={'text.primary'}              w={"fit-content"}
                  boxShadow={
                    themeCtx.darkMode
                      ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                      : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                  }
                  p={5}
                  mr={2}
                  _hover={{color:'primary.100', bg:'primary.60'}} 
                    isDisabled={isSelectError}
                    onClick={editUser}
                  >
                    Edit User
                  </Button>
                }
              >
                <Box as={Flex} flexWrap={"wrap"} gap={5} pt={5} pb={5}>
                  <Box w={"100%"} gap={5} as={Flex} alignItems={"center"}>
                    <Text w={"35%"} color={"text.primary"} fontWeight={"bold"}>Name </Text>
                    <Text maxW={"65%"} color={"text.primary"} fontWeight={"bold"}>{user.name}</Text>
                  </Box>
                  <Box w={"100%"} gap={5} as={Flex} alignItems={"center"}>
                    <Text w={"35%"} color={"text.primary"} fontWeight={"bold"}>Roles</Text>
                    <Box w={"65%"}>
                      <StyledSelect
                      general={true}
                        value={userRole}
                        selectErrorMessage={"Please choose a role"}
                        selectError={isSelectError}
                        onchange={setUserRole}
                        options={allRoles.map((role) => {
                          return { label: role.name, value: role.id };
                        })}
                        size={"md"}
                      />
                    </Box>
                  </Box>
                  <Box w={"100%"} gap={5} as={Flex} alignItems={"center"}>
                    <Text w={"35%"} color={"text.primary"} fontWeight={"bold"}>Devices</Text>
                    <Box w={"65%"}>
                      <StyledSelect
                         general={true}
                        value={deviceGroup}
                        onchange={setDeviceGroup}
                        options={allDeviceGroups.map((deviceGroup) => {
                          return {
                            label: deviceGroup.name,
                            value: deviceGroup.id,
                          };
                        })}
                        size={"md"}
                      />
                    </Box>
                  </Box>
                </Box>
              </FunctionalModal>
            )}
          </Box>
          <Avatar size={"xl"} name={title}  boxShadow={
          themeCtx.darkMode
            ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
            : "3px 2px 7px 1px rgba(0,0,0,0.2)"
        } bg={"primary.60"} color={"text.primary"}/>
          <Box
            minW={"20%"}
            alignItems={"center"}
            justifyContent={"center"}
            textAlign={"center"}
          >
            <Heading fontSize={"2xl"} mb={5}>
              {title}
            </Heading>
            {subtitle}
          </Box>
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            textAlign={"center"}
          >
            <Heading fontSize={"sm"} mb={1} mr={2}>
              Role:
            </Heading>
            <HStack>
              <Tag borderRadius={"20px"} variant="solid" bg={"action.100"}>
                <TagLabel>{role ? role.name : "No role assigned"}</TagLabel>
              </Tag>
            </HStack>
          </Box>
          {!device && (
            <Box
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent={"center"}
              textAlign={"center"}
            >
              <Heading fontSize={"sm"} mb={1} mr={2}>
                Device Group:
              </Heading>
              <HStack>
                <Tag borderRadius={"20px"} variant="solid" bg={"primary.60"}>
                  <TagLabel>
                    {user.device_group
                      ? user.device_group.name
                      : "No device group assigned"}
                  </TagLabel>
                </Tag>
              </HStack>
            </Box>
          )}
        </Box>
      </Fade>
    </Box>
  );
}

export default BundleCard;
