import React, { useState, useEffect, useContext } from "react";
import { Flex, Box, Spinner, Button, Heading, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import "./roles.css";
import { getAllSuperRoles } from "../../../api/roles-management";
import { ThemeContext } from "../../../context/theme";
import { PERMISSIONS } from "../../../types/devices";
import { hasPermission } from "../../../helpers/permissions-helper";
import AvatarCard from "../../ui/avatar-card-2/avatar-card-2";
import Empty from "../../../assets/images/logo/no data.png";

function Roles() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const themeCtx = useContext(ThemeContext);
  const [laoding, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllSuperRoles()
      .then((res) => {
        setLoading(false);
        setRoles(res.data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Flex
        px={2}
        pb={2}
        flexWrap={"wrap"}
        w={"100%"}
        justifyContent={"center"}
        gap={5}
      >
        {hasPermission(PERMISSIONS.CREATE_SUPER_ROLES) && (
          <Box
            width={"100%"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"flex-end"}
          >
            <Button
              mb={4}
              boxShadow={
                themeCtx.darkMode
                  ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                  : "3px 5px 7px 1px rgba(0,0,0,0.2)"
              }
              color={"text.primary"}
              bg={"primary.60"}
              _hover={{ color: "primary.100", bg: "primary.60" }}
              onClick={() => navigate("/view-roles/create-role")}
            >
              Create Role
            </Button>
          </Box>
        )}
        {laoding ? (
          <Box
            minH={"500px"}
            w={"100%"}
            alignItems={"center"}
            display={"flex"}
            justifyContent={"center"}
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
          {roles.length === 0 ?      <Box
           minH={"500px"}
           w={"100%"}
            display={"flex"}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Image position={"relative"} src={Empty} h={40} mb={5} />
            <Heading
              w={"100%"}
              color={"text.primary"}
              fontWeight={"semibold"}
              fontSize={"xl"}
              textAlign={"center"}
            >
              There is no data to display.
            </Heading>
          </Box>:<>
          {roles.map((role, index) => (
              <AvatarCard
                name={role.name}
                index={index}
                id={role.id}
                buttonText={"View Role"}
                onClick={() => navigate(`/view-roles/edit-role/${role.id}/${role.name}`)}
              />
            ))}
            {Array(3 - (roles.length % 3))
              .fill(true)
              .map(() => {
                return <Box width={"30%"} minWidth={"200px"}></Box>;
              })}</>}
       
          </>
        )}
      </Flex>
    </>
  );
}

export default Roles;
