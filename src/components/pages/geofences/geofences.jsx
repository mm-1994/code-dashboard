import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { createGeofence } from "../../../api/geofences";
import { showsuccess } from "../../../helpers/toast-emitter";
import Map from "../../ui/map/map";
import ComplexTable from "../../ui/table/complex-table";
import { FaMapMarkedAlt } from "react-icons/fa";
import { extractGeoHeaders } from "../../../helpers/array-map";
import { Icon } from "@chakra-ui/icons";
import FunctionalModal from "../../ui/functional-modal/functional-modal";
import "./geofences.css";
import { DevicesContext } from "../../../context/devices";
import { hasPermission } from "../../../helpers/permissions-helper";
import { PERMISSIONS } from "../../../types/devices";
import { ThemeContext } from "../../../context/theme";

function Geofences() {
  const [geoFences, setGeofences] = useState(undefined);
  const [update, setUpdate] = useState(false);
  const [center, setCenter] = useState(undefined);
  const [markers, setMarkers] = useState([]);
  const { darkMode } = useContext(ThemeContext);
  const deviceCtx = useContext(DevicesContext);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  
  useEffect(() => {
    deviceCtx.getGeofencesCall();
  }, []);

  useEffect(() => {
    deviceCtx.getDevicesCall();
  }, []);

  useEffect(() => {
    if (deviceCtx && deviceCtx.devicesObj.devices) {
      if (deviceCtx.devicesObj.devices.cycollector) {
        let markers_setup = [];
        deviceCtx.devicesObj.devices.cycollector.map((dev) => {
          markers_setup.push({
            position: { lat: dev.lat, lng: dev.lng },
            name: dev.name,
          });
        });
        setMarkers(markers_setup);
      }
    }
  }, [deviceCtx.devicesObj.devices]);

  useEffect(() => {
    if (update) {
      deviceCtx && deviceCtx.getGeofencesCall() && deviceCtx.getRoutesCall();
      setUpdate(false);
    }

    if (deviceCtx.geofences) {
      if (deviceCtx.geofences.length > 0) {
        setCenter(deviceCtx.geofences[0].center);
      }
      setGeofences(
        deviceCtx.geofences.map((geo) => {
          return {
            ...geo,
            callBack: setUpdate,
          };
        })
      );
    }
  }, [deviceCtx, update]);

  const onPolygonComplete = (polygon) => {
    const pointList = polygon.getPath().getArray();
    const resPolygon = [];
    pointList.forEach((element) => {
      resPolygon.push({ lat: element.lat(), lng: element.lng() });
    });
    setNewGeoPolygon(resPolygon);
  };
  const [newGeoName, setNewGeoName] = useState("");
  const [newGeoPolygon, setNewGeoPolygon] = useState([]);
  const createNewGeo = () => {
    createGeofence(
      newGeoName,
      newGeoPolygon.map((point) => [point.lat, point.lng])
    ).then(() => {
      showsuccess("Successfully created new geofence");
      setUpdate(true);
    });
  };
  return (
    <>
      <Box px={5} pb={5} className={"grid"} w={"100%"}>
        <ComplexTable
          customPageSize={10}
          title={"GeoFences"}
          onClick={setCenter}
          loading={deviceCtx.geofencesCallLoading}
          extractFn={extractGeoHeaders}
          data={
            hasPermission(PERMISSIONS.DELETE_GEOFENCES) ||
            hasPermission(PERMISSIONS.EDIT_GEOFENCES)
              ? geoFences
                ? geoFences.map((geo) => {
                    return {
                      val: geo.name,
                      id: geo.id,
                      Geofence_Actions: { geofence: geo, geofences: geoFences },
                    };
                  })
                : undefined
              : geoFences
              ? geoFences.map((geo) => {
                  return {
                    val: geo.name,
                    id: geo.id,
                  };
                })
              : undefined
          }
          icon={
            <Icon as={FaMapMarkedAlt} boxSize={"30px"} color={"action.100"} />
          }
        >
          <Box my={3}>
            {hasPermission(PERMISSIONS.CREATE_GEOFENCES) && (
              <FunctionalModal
                modalTitle={"Create Geofence"}
                btnTitle={"Create Geofence"}
                btnSize={"sm"}
                modalMinH={"700px"}
                modalMinW={"80%"}
                iconSize={"20px"}
                btnColor={"primary.60"}
                btnAction={
                  <Button
                    isDisabled={
                      newGeoName.trim().length === 0 ||
                      newGeoPolygon.length === 0
                    }
                    onClick={createNewGeo}
                    bg={"primary.80"}
                    color={"text.primary"}
                    w={"fit-content"}
                    boxShadow={
                      darkMode
                        ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                        : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                    }
                    p={5}
                    mr={2}
                    _hover={{ color: "primary.100", bg: "primary.60" }}
                  >
                    Create Geofence
                  </Button>
                }
              >
                <Box
                  gap={2}
                  alignItems={"flex-start"}
                  justifyContent={"flex-start"}
                  flexDir={"column"}
                  as={Flex}
                  mb={4}
                  w={"100%"}
                  borderRadius={"5px"}
                >
                  <Text color={"text.primary"} fontWeight={"bold"} mt={2}>
                    Geofence Name:
                  </Text>
                  <Input
                    bg={"primary.80"}
                    color={"text.primary"}
                    borderRadius={0}
                    border={0}
                    height={45}
                    width={350}
                    borderBottom={4}
                    borderStyle={"solid"}
                    borderColor={"action.100"}
                    boxShadow={
                      darkMode
                        ? "5px 10px 15px 1px rgba(0,0,0,1)"
                        : "5px 8px 15px 1px rgba(0,0,0,0.2)"
                    }
                    _autofill={{
                      textFillColor: "text.primary",
                      boxShadow: `0 0 0px 1000px ${
                        darkMode ? "#171821" : "#Primary.80"
                      } inset`,
                      textFillColor: darkMode ? "#FFFFFF" : "#000000",
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
                    id="Name"
                    placeholder="Name"
                    value={newGeoName}
                    onChange={(e) => setNewGeoName(e.target.value)}
                  />
                </Box>
                <Box
                  w={"100%"}
                  h={"80%"}
                  bg={"primary.80"}
                  borderRadius={"5px"}
                  marginBottom={3}
                >
                  <Map
                    draw={true}
                    drawingComplete={onPolygonComplete}
                    zoom={2}
                    trips={false}
                    geofences={geoFences}
                    markers={markers}
                  />
                </Box>
              </FunctionalModal>
            )}
          </Box>
        </ComplexTable>
        <Box
          w={"100%"}
          p={4}
          h={"513.1px"}
          bg={"primary.80"}
          borderRadius={"10px"}
          boxShadow={
            darkMode
              ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
              : "5px 4px 15px 1px rgba(0,0,0,0.2)"
          }
        >
          <Map
            zoom={12}
            oldCenter={center}
            trips={false}
            markers={markers}
            geofences={geoFences}
          />
        </Box>
      </Box>
    </>
  );
}

export default Geofences;
   