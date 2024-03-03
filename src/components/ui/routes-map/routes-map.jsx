import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  PolylineF,
} from "@react-google-maps/api";
import { ThemeContext } from "../../../context/theme";
import ComplexMarker from "../../ui/map/marker/complex-marker";
import "./routes-map.css";
import { DevicesContext } from "../../../context/devices";
import Polygon from "../map/polygon/polygon";
import CylockImg from "../../../assets/images/devices/CyLock-sm.png";

function RoutesMap({
  markers = [],
  routes = [],
  geofences = [],
  setRoute = false,
  zoom = 14,
  drawingComplete,
  children,
  tripChoices,
}) {
  const deviceCtx = useContext(DevicesContext);
  const [center, setCenter] = useState();
  const themeCtx = useContext(ThemeContext);
  useEffect(() => {
    if (markers.length === 1) {
      setCenter({
        lat: parseFloat(markers[0].position.lat),
        lng: parseFloat(markers[0].position.lng),
      });
    } else if (deviceCtx && deviceCtx.location) {
      setCenter(deviceCtx.location);
    }
  }, [markers, deviceCtx]);

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const originRef = useRef();
  const destiantionRef = useRef();

  if (!deviceCtx | !deviceCtx.isLoaded) {
    return <SkeletonText />;
  }

  async function calculateRoute() {
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      provideRouteAlternatives: true,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
    drawingComplete(
      results.routes[0].overview_path.map((obj) => {
        return [obj.lat(), obj.lng()];
      })
    );
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }
  const options = {
    strokeColor: "#191d25",
    strokeOpacity: 1,
    strokeWeight: 100,
    fillColor: "#191d25",
    fillOpacity: 1,
    clickable: true,
    draggable: false,
    editable: false,
    visible: true,
    radius: 300000,
  };
  return (
    <>
      <Flex
        position="relative"
        flexDirection="column"
        alignItems="center"
        h="100%"
        w="100%"
      >
        {setRoute ? (
          <Box
            p={4}
            borderRadius="lg"
            m={4}
            bg={"primary.80"}
            shadow="base"
            minW="100%"
            boxShadow={
              themeCtx.darkMode
                ? "5px 10px 15px 1px rgba(0,0,0,1)"
                : "5px 8px 15px 1px rgba(0,0,0,0.2)"
            }
          >
            <HStack
              gap={2}
              as={Flex}
              flexWrap={"wrap"}
              flexDir={"row"}
              justifyContent="space-between"
            >
              <Box display={"flex"} flexDir={"column"}>
                <Text color={"text.primary"} fontWeight={"bold"} mt={4} mb={2}>
                  Origin
                </Text>
                <Autocomplete>
                  <Input
                    type="text"
                    bg={"primary.100"}
                    color={"text.primary"}
                    borderRadius={0}
                    border={0}
                    height={45}
                    width={350}
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
                        themeCtx.darkMode ? "#171821" : "#Primary.100"
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
                    placeholder="Origin"
                    ref={originRef}
                  />
                </Autocomplete>
              </Box>
              <Box display={"flex"} flexDir={"column"}>
                <Text color={"text.primary"} fontWeight={"bold"} mt={4} mb={2}>
                  Destination
                </Text>
                <Autocomplete>
                  <Input
                    type="text"
                    bg={"primary.100"}
                    color={"text.primary"}
                    borderRadius={0}
                    border={0}
                    height={45}
                    width={350}
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
                        themeCtx.darkMode ? "#171821" : "#Primary.100"
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
                    placeholder="Destination"
                    ref={destiantionRef}
                  />
                </Autocomplete>
              </Box>
              {children}
              <ButtonGroup display={"flex"} alignItems={"flex-end"} height={93}>
                <Button
                  w={"fit-content"}
                  boxShadow={
                    themeCtx.darkMode
                      ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                      : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                  }
                  color={"text.primary"}
                  bg={"primary.100"}
                  _hover={{ color: "primary.100", bg: "primary.60" }}
                  type="submit"
                  onClick={calculateRoute}
                >
                  Calculate Route
                </Button>
                <IconButton
                  boxShadow={
                    themeCtx.darkMode
                      ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                      : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                  }
                  color={"text.primary"}
                  bg={"primary.100"}
                  _hover={{ color: "primary.100", bg: "primary.60" }}
                  icon={<FaTimes color={"text.primary"} />}
                  onClick={clearRoute}
                />
              </ButtonGroup>
            </HStack>
            <HStack spacing={8} mt={5} justifyContent="space-between">
              <Text color={"text.primary"} fontWeight={"bold"}>
                Distance: {distance}{" "}
              </Text>
              <Text color={"text.primary"} fontWeight={"bold"}>
                Duration: {duration}{" "}
              </Text>
              <IconButton
                bg={"primary.60"}
                _hover={{ bg: "primary.80" }}
                aria-label="center back"
                boxShadow={
                  themeCtx.darkMode
                    ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                    : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                }
                icon={
                  <FaLocationArrow color={themeCtx.theme.colors.text.primary} />
                }
                isRound
                onClick={() => {
                  map.panTo(center);
                  map.setZoom(15);
                }}
              />
            </HStack>
          </Box>
        ) : (
          tripChoices
        )}
        <Box h="100%" w="100%" overflow={"hidden"} p={3} pb={5}>
          {deviceCtx && deviceCtx.isLoaded && (
            <GoogleMap
              center={center}
              zoom={zoom}
              mapContainerStyle={{
                minHeight: "485px",
                width: "100%",
                height: "93.5%",
                borderRadius: "10px",
                boxShadow: themeCtx.darkMode
                  ? "5px 4px 5px 1px rgba(0,0,0,0.9)"
                  : "5px 4px 5px 1px rgba(0,0,0,0.2)",
              }}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
              }}
              onLoad={(map) => setMap(map)}
            >
              {routes &&
                routes.map((route) => {
                  return (
                    <PolylineF
                      key={route.id}
                      path={route.points}
                      options={options}
                    />
                  );
                })}
              {markers.map((marker, index) => {
                return (
                  <>
                    <ComplexMarker
                      icon={CylockImg}
                      key={index}
                      marker={marker}
                    />
                  </>
                );
              })}
              {geofences.map((geofence) => {
                return (
                  <Polygon
                    key={geofence.id}
                    center={geofence.center}
                    name={geofence.name}
                    oldpath={geofence.polygon}
                    editMode={geofence.editMode}
                    editAction={geofence.edit}
                  />
                );
              })}
              <Marker position={center} />
              {directionsResponse && (
                <DirectionsRenderer
                  options={{
                    polylineOptions: options,
                    draggable: true,
                    hideRouteList: false,
                  }}
                  directions={directionsResponse}
                />
              )}
            </GoogleMap>
          )}
        </Box>
      </Flex>
    </>
  );
}

export default RoutesMap;
