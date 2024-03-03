import React, { useState, useEffect, useContext } from "react";
import { GoogleMap, PolylineF, DrawingManagerF } from "@react-google-maps/api";
import {
  Box,
  ButtonGroup,
  IconButton,
  Flex,
  Text,
  HStack,
  useRadioGroup,
  SkeletonText,
} from "@chakra-ui/react";
import { RadioCard } from "../radio-card/radio-card";
import ComplexMarker from "./marker/complex-marker";
import { BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import { MdReplay } from "react-icons/md";
import Polygon from "./polygon/polygon";
import { DevicesContext } from "../../../context/devices";
import { formatDate } from "../../../helpers/array-map";
import CylockImg from "../../../assets/images/devices/CyLock-sm.png";
import { ThemeContext } from "../../../context/theme";

function Map({
  deviceName,
  tripChoice = [],
  minH = "485px",
  draw = false,
  oldCenter,
  zoom = 1,
  trips,
  markers = [],
  geofences = [],
  drawingComplete,
  clear,
  setClear,
}) {
  const deviceCtx = useContext(DevicesContext);
  const { darkMode } = useContext(ThemeContext);
  var idInterval;
  const [speed, setSpeed] = useState("500");
  const speedChoices = ["500", "300", "200"];
  const speedChoicesLabels = ["1x", "1.5x", "2x"];
  const { getRootProps, getRadioProps } = useRadioGroup({
    datetime: "Speed",
    defaultValue: speed,
    onChange: (spd) => {
      setSpeed(spd);
      stopTrip();
    },
  });
  const group = getRootProps();
  const containerStyle = {
    width: "100%",
    minHeight: minH,
    borderRadius: "10px",
    boxShadow: darkMode
      ? "5px 4px 5px 1px rgba(0,0,0,0.9)"
      : "5px 4px 5px 1px rgba(0,0,0,0.2)",
  };
  const [center, setCenter] = useState();
  useEffect(() => {
    if (!trips && deviceCtx && deviceCtx.location) {
      setCenter(deviceCtx.location);
    }
    if (trips && tripChoice.length !== 0) {
      setCenter({
        lat: tripChoice[parseInt(tripChoice.length / 2)].lat,
        lng: tripChoice[parseInt(tripChoice.length / 2)].lng,
      });
    }
  }, [deviceCtx, tripChoice]);
  const options = {
    strokeColor: "#039BE5",
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: "#039BE5",
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    zIndex: 1,
    icons: [
      {
        icon: {
          path: "M 0,0 2,6 -2,6 0,0 Z",
          fillColor: "red",
          fillOpacity: 1.0,
          strokeColor: "red",
          strokeWeight: 0.1,
        },
        offset: "100%",
        repeat: "300px",
      },
    ],
  };
  const [mainMarker, setMainMarker] = useState();
  let [counter, setCounter] = useState(0);
  const [pause, setPause] = useState(true);

  const [timeOutId, setId] = useState(idInterval);

  function callBack() {
    if (counter < tripChoice.length) {
      setMainMarker({
        position: {
          lat: tripChoice[counter].lat,
          lng: tripChoice[counter].lng,
        },
        datetime: formatDate(tripChoice[counter].message_time),
        name: deviceName,
        type: tripChoice[counter].type,
      });
      setCounter(counter++);
    } else {
      clearAll();
    }
  }

  function travelPath(speed) {
    idInterval = setInterval(callBack, speed);
    setId(idInterval);
  }

  const clearAll = () => {
    setPause(false);
    setCounter(0);
    stopTrip();
    if (tripChoice.length !== 0) {
      setMainMarker({
        position: { lat: tripChoice[0].lat, lng: tripChoice[0].lng },
        datetime: formatDate(tripChoice[0].message_time),
        name: deviceName,
        type: tripChoice[0].type,
      });
    }
  };
  useEffect(() => {
    if (clear) {
      console.log("Clear UseEffect");
      clearAll();
      setClear(false);
    }
  }, [clear]);

  const playTrip = (speed) => {
    setPause(false);
    travelPath(speed);
  };

  const stopTrip = () => {
    setPause(true);
    clearInterval(timeOutId);
    clearInterval(idInterval);
  };

  useEffect(() => {
    setCounter(0);
    if (tripChoice.length !== 0) {
      setMainMarker({
        position: { lat: tripChoice[0].lat, lng: tripChoice[0].lng },
        datetime: formatDate(tripChoice[counter].message_time),
        name: deviceName,
        type: tripChoice[counter].type,
      });
    }
  }, [tripChoice]);
  if (!deviceCtx | !deviceCtx.isLoaded) {
    return <SkeletonText />;
  }
  const lineSymbol = {
    path: "M 0,0 0,0",
    strokeOpacity: 1,
    scale: 5,
    strokeColor: "black",
  };

  return (
    <>
      {deviceCtx && deviceCtx.isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={oldCenter || center}
          zoom={trips ? 7 : zoom}
        >
          {draw && (
            <DrawingManagerF
              drawingMode={"polygon"}
              onPolygonComplete={(e) => drawingComplete(e)}
              options={{
                polygonOptions: {
                  editable: true,
                  draggable: true,
                  clickable: true,
                },
              }}
            />
          )}
          {trips && (
            <>
              {tripChoice &&
                tripChoice.map((point) => {
                  return (
                    <ComplexMarker
                      icon={lineSymbol}
                      marker={{
                        position: { lat: point.lat, lng: point.lng },
                        name: formatDate(point.message_time),
                      }}
                    />
                  );
                })}
              <PolylineF
                path={tripChoice ? tripChoice : []}
                options={options}
              />
              <ComplexMarker marker={mainMarker} icon={CylockImg} />
            </>
          )}
          {markers.map((marker, index) => {
            return (
              <>
                <ComplexMarker icon={CylockImg} key={index} marker={marker} />
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
        </GoogleMap>
      )}
      {trips && (
        <Box
          m={3}
          as={Flex}
          width={"100%"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <ButtonGroup m={2}>
            <IconButton
              aria-label="start trip"
              bg="primary.60"
              rounded="full"
              size={"sm"}
              onClick={clearAll}
              icon={<MdReplay />}
              isDisabled={!pause}
            />
            <IconButton
              aria-label="start trip"
              bg="primary.60"
              rounded="full"
              size={"sm"}
              onClick={() => playTrip(speed)}
              icon={<BsFillPlayFill />}
              isDisabled={!pause}
            />
            <IconButton
              aria-label="pause trip"
              bg="primary.60"
              rounded="full"
              size={"sm"}
              onClick={stopTrip}
              icon={<BsFillPauseFill />}
              isDisabled={pause}
            />
          </ButtonGroup>
          <HStack m={2} ml={"120px"} {...group}>
            {speedChoices.map((value, index) => {
              const radio = getRadioProps({ value });
              return (
                <RadioCard key={value} value={value} {...radio}>
                  {speedChoicesLabels[index]}
                </RadioCard>
              );
            })}
          </HStack>
          <Box
            borderRadius={"25px"}
            bg={"primary.60"}
            px={5}
            borderStyle={"solid"}
            borderWidth={2}
            borderColor={"action.100"}
            w={"220px"}
          >
            <Text color={"text.primary"}>
              {mainMarker && mainMarker.datetime}
            </Text>
            <Text color={"text.primary"}>{mainMarker && mainMarker.type}</Text>
          </Box>
        </Box>
      )}
    </>
  );
}

export default Map;
