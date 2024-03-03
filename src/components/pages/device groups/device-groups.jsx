import React, { useState, useEffect, useContext } from "react";
import { Flex, Box, Button, Spinner, Center } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import "./device-groups.css";
import { getAllDeviceGroups } from "../../../api/device-groups";
import { PERMISSIONS } from "../../../types/devices";
import { hasPermission } from "../../../helpers/permissions-helper";
import AvatarCard from "../../ui/avatar-card-2/avatar-card-2";
import { ThemeContext } from "../../../context/theme";
import Empty from "../../../assets/images/logo/no data.png";


function DeviceGroups() {
  const navigate = useNavigate();
  const themeCtx = useContext(ThemeContext)
  const [deviceGroups, setDeviceGroups] = useState([]);
  const [laoding, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true)
    getAllDeviceGroups().then((res) => {
      setLoading(false)
      setDeviceGroups(res.data.data);
    }).catch(()=> {
      setLoading(false)
    })
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
        <Box
          width={"100%"}
          display={
            hasPermission(PERMISSIONS.CREATE_DEVICE_GROUP) ? "flex" : "NONE"
          }
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
            onClick={() => navigate("/view-device-groups/create-device-group")}
          >
            Create Device Group
          </Button>
        </Box>

        {laoding ? (
  <Center w={"100%"} h={"70vh"}>
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
          {deviceGroups.length === 0 ?      <Box
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
          {deviceGroups.map((deviceGroup, index) => (
          <AvatarCard
            name={deviceGroup.name}
            index={index}
            id={deviceGroup.id}
            buttonText={"View Group"}
            onClick={() =>
              navigate(
                `/view-device-groups/edit-device-group/${deviceGroup.id}/${deviceGroup.name}`
              )
            }
          />
        ))}
        {Array(3 - (deviceGroups.length % 3))
          .fill(true)
          .map(() => {
            return <Box width={"30%"} minWidth={"200px"}></Box>;
          })}   
              </>}
       
          </>
        )}


      </Flex>
    </>
  );
}

export default DeviceGroups;
