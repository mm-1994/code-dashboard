import React, { useState, useEffect, useContext } from "react";
import {
  Flex,
  Box,
  Input,
  Button,
  Text,
  FormControl,
  FormErrorMessage,
  Spinner
} from "@chakra-ui/react";
import FunctionalModal from "../../../ui/functional-modal/functional-modal";
import SpinnerLoader from "../../../ui/loader/spinner-loader";
import { getMyUser } from "../../../../api/user-management";
import { createSuperRole } from "../../../../api/roles-management";
import { showsuccess } from "../../../../helpers/toast-emitter";
import { useNavigate } from "react-router";
import RolesAccordion from "../../../ui/roles-accordion/roles-accordion";
import "./create-role.css";
import { ThemeContext } from "../../../../context/theme";

function CreateRole() {
  const [rolesSelected, setRolesSelected] = useState([]);
  const [name, setName] = useState("");
  const [isNameError, setIsNameError] = useState(true);
  const [nameError, setNameError] = useState("");
  const [nameInputFocus, setNameInputFocus] = useState(false);
  const [loading, setLoading] = useState(true);
  const themeCtx = useContext(ThemeContext);
  const navigate = useNavigate();

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

  const [RolesGroups, setRolesGroupes] = useState([]);

  useEffect(() => {
    getMyUser().then((res) => {
      setRolesGroupes(res.data.grouped_roles);
      setLoading(false);
    });
  }, []);

  const handleFocus = (e) => {
    if (!nameInputFocus) {
      setNameInputFocus(true);
    }
  };

  const handleSwitchClick = (e) => {
    if (e.target.checked) {
      rolesSelected.push(parseInt(e.target.id));
      setRolesSelected([...rolesSelected]);
    } else {
      const index = rolesSelected.indexOf(parseInt(e.target.id));
      if (index !== -1) {
        rolesSelected.splice(index, 1);
        setRolesSelected([...rolesSelected]);
      }
    }
  };

  const handleCreateSuperRole = () => {
    createSuperRole(name, rolesSelected).then((res) => {
      showsuccess("Successfully created super role");
      navigate("/view-roles");
    });
  };

  return (
    <>
      <Flex
        p={2}
        pt={6}
        flexWrap={"wrap"}
        w={"100%"}
        justifyContent={"center"}
        gap={2}
      >
        {loading ? (
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            height={"550px"}
          >
            <Spinner
              thickness="6px"
              speed="0.85s"
              emptyColor="text.primary"
              color="primary.60"
              size="xl"
            />
          </Box>
        ) : (
          <>
            <RolesAccordion
              RolesGroups={RolesGroups}
              rolesSelected={rolesSelected}
              handleSwitchClick={handleSwitchClick}
            />
            <FunctionalModal
              modalTitle={"Create New Role"}
              btnTitle={"Create New Role"}
              btnColor={"primary.60"}
              isDisabled={rolesSelected.length === 0}
              btnSize={"lg"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              modalMinH={"300px"}
              modalMinW={'100px'}
              btnAction={
                <Button
                  onClick={handleCreateSuperRole}
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
    </>
  );
}

export default CreateRole;
