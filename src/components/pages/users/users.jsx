import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  FormControl,
  FormErrorMessage,
  Spinner,
  Center,
} from "@chakra-ui/react";
import React, { useEffect, useState, useContext } from "react";
import { createUser, getAllUsers } from "../../../api/user-management";
import { showsuccess } from "../../../helpers/toast-emitter";
import AvatarCard from "../../ui/avatar-card/avatar-card";
import FunctionalModal from "../../ui/functional-modal/functional-modal";
import StyledSelect from "../../ui/styled-select/styled-select";
import { hasPermission } from "../../../helpers/permissions-helper";
import { getAllSuperRoles } from "../../../api/roles-management";
import { getAllDeviceGroups } from "../../../api/device-groups";
import { PERMISSIONS } from "../../../types/devices";
import { ThemeContext } from "../../../context/theme";

function Users() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [allRoles, setRoles] = useState([]);
  const [userRole, setUserRole] = useState(-1);
  const [userDeviceGroup, setUserDeviceGroup] = useState("");
  const [deviceGroups, setDeviceGroups] = useState([]);
  const [isNameError, setIsNameError] = useState(true);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isUsernameError, setIsUsernameError] = useState(true);
  const [isUserNameFocused, setIsUserNameFocused] = useState(false);
  const [isPasswordError, setIsPassworError] = useState(true);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailError, setIsEmailError] = useState(true);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isSelectError, setIsSelectError] = useState(true);
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const [nameError, setNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPassworError] = useState("");
  const [emailError, setEmailError] = useState("");
  const themeCtx = useContext(ThemeContext);
  const emailRegex = /^\S+@\S+\.\S+$/;

  useEffect(() => {
    getAllUsersV2();
  }, []);

  useEffect(() => {
    if (userRole === -1 || userRole === "") {
      setIsSelectError(true);
    } else {
      setIsSelectError(false);
    }
  }, [userRole]);

  useEffect(() => {
    if (name === "") {
      setIsNameError(true);
      setNameError("Name is required.");
    } else if (name.length <= 3) {
      setIsNameError(true);
      setNameError("must be at least 4 characters.");
    } else {
      setIsNameError(false);
    }
  }, [name]);

  useEffect(() => {
    if (username === "") {
      setIsUsernameError(true);
      setUsernameError("Username is required.");
    } else if (username.length <= 3) {
      setIsUsernameError(true);
      setUsernameError("must be at least 4 characters.");
    } else {
      setIsUsernameError(false);
    }
  }, [username]);

  useEffect(() => {
    if (email === "") {
      setIsEmailError(true);
      setEmailError("Email is required.");
    } else if (!emailRegex.test(email)) {
      setIsEmailError(true);
      setEmailError("Email must be valid.");
    } else {
      setIsEmailError(false);
    }
  }, [email]);

  useEffect(() => {
    if (password === "") {
      setIsPassworError(true);
      setPassworError("Password is required.");
    } else if (password.length <= 3) {
      setIsPassworError(true);
      setPassworError("must be at least 4 characters.");
    } else {
      setIsPassworError(false);
    }
  }, [password]);

  useEffect(() => {
    getAllDeviceGroups().then((res) => {
      setDeviceGroups(res.data.data);
    });
  }, []);

  useEffect(() => {
    getAllSuperRoles().then((res) => {
      setRoles(res.data.data);
    });
  }, []);

  const getAllUsersV2 = () => {
    setLoading(true);
    getAllUsers()
      .then((res) => {
        setUsers(res.data.users);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const createNewUser = () => {
    createUser(
      username,
      password,
      name,
      email,
      parseInt(userRole),
      parseInt(userDeviceGroup)
    ).then((res) => {
      showsuccess("Successfully created user");
      setName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setUserRole("");
      setUserDeviceGroup("");
      getAllUsers().then((res) => setUsers(res.data.users));
    });
  };

  return (
    <>
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
        <Flex
          pb={2}
          flexWrap={"wrap"}
          alignItems={"center"}
          justifyContent={"center"}
          width={"100%"}
          gap={6}
        >
          <Box w={"100%"} justifyContent={"end"} as={Flex}>
            {hasPermission(PERMISSIONS.CREATE_USERS) && (
              <FunctionalModal
                modalTitle={"Create new user"}
                btnTitle={"Create User"}
                btnColor={"primary.60"}
                btnSize={"lg"}
                modalMinW={"100px"}
                modalMinH={"600px"}
                reset={() => {
                  setIsNameFocused(false);
                  setIsUserNameFocused(false);
                  setIsEmailFocused(false);
                  setIsPasswordFocused(false);
                  setIsSelectFocused(false);
                  setName("");
                  setUsername("");
                  setEmail("");
                  setPassword("");
                  setUserRole(-1);
                }}
                btnAction={
                  <Button
                    onClick={createNewUser}
                    isDisabled={
                      isNameError ||
                      isUsernameError ||
                      isEmailError ||
                      isPasswordError ||
                      isSelectError
                    }
                    bg={"primary.80"}
                    color={"text.primary"}
                    w={"fit-content"}
                    boxShadow={
                      themeCtx.darkMode
                        ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                        : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                    }
                    p={5}
                    mr={2}
                    _hover={{ color: "primary.100", bg: "primary.60" }}
                  >
                    Create User
                  </Button>
                }
              >
                <Box as={Flex} flexWrap={"wrap"}>
                  <Box
                    w={"100%"}
                    gap={5}
                    as={Flex}
                    alignItems={"center"}
                    mt={2}
                  >
                    <Text
                      fontWeight={"bold"}
                      color={"text.primary"}
                      mb={10}
                      w={"30%"}
                    >
                      Name
                    </Text>
                    <Box
                      as={Flex}
                      w={"70%"}
                      alignItems={"flex-start"}
                      flexDirection={"column"}
                    >
                      <FormControl isInvalid={isNameError && isNameFocused}>
                        <Input
                          type="text"
                          placeholder="Name"
                          bg={"primary.80"}
                          color={"text.primary"}
                          borderRadius={0}
                          border={0}
                          height={45}
                          w={"100%"}
                          onBlur={() => setIsNameFocused(true)}
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
                              themeCtx.darkMode ? "#171821" : "#FFFFFF"
                            } inset`,
                            textFillColor: themeCtx.darkMode
                              ? "#FFFFFF"
                              : "#000000",
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
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                        {isNameError && isNameFocused ? (
                          <FormErrorMessage
                            fontWeight={"bold"}
                            alignItems={"flex-start"}
                            pt={2}
                            marginTop={0}
                            minH={10}
                          >
                            {nameError}
                          </FormErrorMessage>
                        ) : (
                          <Box minH={10}></Box>
                        )}
                      </FormControl>
                    </Box>
                  </Box>
                  <Box
                    w={"100%"}
                    gap={5}
                    fontWeight={"bold"}
                    color={"text.primary"}
                    as={Flex}
                    alignItems={"center"}
                  >
                    <Text w={"30%"} mb={10}>
                      Username
                    </Text>
                    <Box
                      as={Flex}
                      w={"70%"}
                      alignItems={"flex-start"}
                      flexDirection={"column"}
                    >
                      <FormControl
                        isInvalid={isUsernameError && isUserNameFocused}
                      >
                        <Input
                          placeholder="Username"
                          value={username}
                          bg={"primary.80"}
                          color={"text.primary"}
                          borderRadius={0}
                          border={0}
                          height={45}
                          width={"100%"}
                          borderBottom={4}
                          onBlur={() => setIsUserNameFocused(true)}
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
                              themeCtx.darkMode ? "#171821" : "#FFFFFF"
                            } inset`,
                            textFillColor: themeCtx.darkMode
                              ? "#FFFFFF"
                              : "#000000",
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
                          onChange={(e) => setUsername(e.target.value)}
                        />

                        {isUsernameError && isUserNameFocused ? (
                          <FormErrorMessage
                            fontWeight={"bold"}
                            alignItems={"flex-start"}
                            pt={2}
                            marginTop={0}
                            minH={10}
                          >
                            {usernameError}
                          </FormErrorMessage>
                        ) : (
                          <Box minH={10}></Box>
                        )}
                      </FormControl>
                    </Box>
                  </Box>
                  <Box
                    w={"100%"}
                    fontWeight={"bold"}
                    color={"text.primary"}
                    gap={5}
                    as={Flex}
                    alignItems={"center"}
                  >
                    <Text w={"30%"} mb={10}>
                      Email
                    </Text>
                    <Box
                      as={Flex}
                      w={"70%"}
                      alignItems={"flex-start"}
                      flexDirection={"column"}
                    >
                      <FormControl isInvalid={isEmailError && isEmailFocused}>
                        <Input
                          maxW={"100%"}
                          value={email}
                          bg={"primary.80"}
                          color={"text.primary"}
                          onBlur={() => setIsEmailFocused(true)}
                          borderRadius={0}
                          border={0}
                          height={45}
                          width={"100%"}
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
                              themeCtx.darkMode ? "#171821" : "#FFFFFF"
                            } inset`,
                            textFillColor: themeCtx.darkMode
                              ? "#FFFFFF"
                              : "#000000",
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
                          type={"email"}
                          placeholder="Email"
                          onChange={(e) => setEmail(e.target.value)}
                        />

                        {isEmailError && isEmailFocused ? (
                          <FormErrorMessage
                            fontWeight={"bold"}
                            alignItems={"flex-start"}
                            pt={2}
                            marginTop={0}
                            minH={10}
                          >
                            {emailError}
                          </FormErrorMessage>
                        ) : (
                          <Box minH={10}></Box>
                        )}
                      </FormControl>
                    </Box>
                  </Box>
                  <Box
                    w={"100%"}
                    fontWeight={"bold"}
                    color={"text.primary"}
                    gap={5}
                    as={Flex}
                    alignItems={"center"}
                  >
                    <Text w={"30%"} mb={10}>
                      Password
                    </Text>
                    <Box
                      as={Flex}
                      w={"70%"}
                      alignItems={"flex-start"}
                      flexDirection={"column"}
                    >
                      <FormControl
                        isInvalid={isPasswordError && isPasswordFocused}
                      >
                        <Input
                          maxW={"100%"}
                          bg={"primary.80"}
                          color={"text.primary"}
                          borderRadius={0}
                          border={0}
                          height={45}
                          width={"100%"}
                          onBlur={() => setIsPasswordFocused(true)}
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
                              themeCtx.darkMode ? "#171821" : "#FFFFFF"
                            } inset`,
                            textFillColor: themeCtx.darkMode
                              ? "#FFFFFF"
                              : "#000000",
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
                          value={password}
                          type={"password"}
                          placeholder="Password"
                          onChange={(e) => setPassword(e.target.value)}
                        />

                        {isPasswordError && isPasswordFocused ? (
                          <FormErrorMessage
                            fontWeight={"bold"}
                            alignItems={"flex-start"}
                            pt={2}
                            marginTop={0}
                            minH={10}
                          >
                            {passwordError}
                          </FormErrorMessage>
                        ) : (
                          <Box minH={10}></Box>
                        )}
                      </FormControl>
                    </Box>
                  </Box>
                  <Box
                    w={"100%"}
                    fontWeight={"bold"}
                    color={"text.primary"}
                    gap={5}
                    as={Flex}
                    alignItems={"center"}
                  >
                    <Text w={"30%"} mb={10}>
                      User Roles
                    </Text>
                    <Box w={"70%"}>
                      <StyledSelect
                        value={userRole}
                        onchange={setUserRole}
                        general={true}
                        onBlur={() => setIsSelectFocused(true)}
                        required={true}
                        options={allRoles.map((role) => {
                          return { label: role.name, value: role.id };
                        })}
                        size={"md"}
                      />

                      {isSelectError && isSelectFocused ? (
                        <Text
                          fontWeight={"bold"}
                          fontSize={14}
                          color={"danger.100"}
                          alignItems={"flex-start"}
                          pt={2}
                          marginTop={0}
                          minH={10}
                        >
                          Role is required
                        </Text>
                      ) : (
                        <Box minH={10}> </Box>
                      )}
                    </Box>
                  </Box>
                  <Box
                    w={"100%"}
                    mb={2}
                    fontWeight={"bold"}
                    color={"text.primary"}
                    gap={5}
                    as={Flex}
                    alignItems={"center"}
                  >
                    <Text w={"30%"}>Device Group</Text>
                    <Box w={"70%"}>
                      <StyledSelect
                        value={userDeviceGroup}
                        onchange={setUserDeviceGroup}
                        general={true}
                        options={deviceGroups.map((deviceGroup) => {
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

          {users.map((user, index) => {
            return (
              <AvatarCard
                user={user}
                key={user.id}
                title={user.user_name}
                subtitle={user.name}
                role={user.super_role}
                deviceGroup={user.device_group}
                index={index}
                gettingAllUsers={getAllUsersV2}
                allRoles={allRoles}
                allDeviceGroups={deviceGroups}
              />
            );
          })}

          {Array(3 - (users.length % 3))
            .fill(true)
            .map(() => {
              return <Box width={"30%"} minWidth={"350px"}></Box>;
            })}
        </Flex>
      )}
    </>
  );
}

export default Users;
