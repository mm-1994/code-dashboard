import {
  Box,
  Button,
  Input,
  Text,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import React, { useEffect, useState, useContext } from "react";

import { DevicesContext } from "../../../context/devices";
import {
  extractRouteHeaders,
  extractTripHeaders,
} from "../../../helpers/array-map";
import { EditIcon } from "@chakra-ui/icons";
import { BiX } from "react-icons/bi";
import FunctionalModal from "../../ui/functional-modal/functional-modal";
import FunctionalModalV2 from "../../ui/functional-modal-v2/functional-modal-v2";
import RoutesMap from "../../ui/routes-map/routes-map";
import ComplexTable from "../../ui/table/complex-table";
import { FaMapMarkedAlt, FaRoute } from "react-icons/fa";
import {
  createRoute,
  getTrips,
  addTrip,
  editTrip as editTripCall,
} from "../../../api/geofences";
import { showsuccess } from "../../../helpers/toast-emitter";
import { hasPermission } from "../../../helpers/permissions-helper";
import { PERMISSIONS } from "../../../types/devices";
import StyledSelect from "../../ui/styled-select/styled-select";
import { ThemeContext } from "../../../context/theme";

export function EditTrips({ trip, callBack }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const themeCtx = useContext(ThemeContext);
  const [startDate, setStartDate] = useState(
    trip.start_date ? trip.start_date : ""
  );
  const [endDate, setEndDate] = useState(trip.end_date ? trip.end_date : "");
  const [status, setStatus] = useState(trip.status);

  const editTrip = () => {
    const body = {
      start_date: startDate,
      status: status,
    };
    if (endDate !== "") {
      body.end_date = endDate;
    }
    editTripCall(trip.id, body).then((res) => {
      showsuccess("Successfully edited new trip");
      callBack(true);
      onClose();
    });
  };

  return (
    <Box>
      <IconButton
        onClick={onOpen}
        size={"md"}
        rounded={"full"}
        bg={"primary.60"}
        boxShadow={
          themeCtx.darkMode
            ? "5px 4px 15px 1px rgba(0,0,0,1)"
            : "5px 7px 15px 1px rgba(0,0,0,0.3)"
        }
        icon={<Icon boxSize={"20px"} as={EditIcon} color={"primary.100"} />}
      />

      <FunctionalModalV2
        modalTitle={"Edit Trip"}
        btnSize={"sm"}
        modalMinH={"700px"}
        modalMinW={"50%"}
        iconSize={"20px"}
        btnColor={"primary.60"}
        isOpen={isOpen}
        footer={true}
        btnAction={
          <Button
            onClick={editTrip}
            w={"fit-content"}
            isDisabled={
              startDate === trip.start_date &&
              ((!trip.end_date && endDate === "") ||
                endDate === trip.end_date) &&
              status === trip.status
            }
            color={"text.primary"}
            bg={"primary.60"}
            boxShadow={
              themeCtx.darkMode
                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
            }
          >
            Edit Trip
          </Button>
        }
        closeBtn={
          <IconButton
            cursor={"pointer"}
            as={BiX}
            size={"sm"}
            fontSize={"xs"}
            rounded={"full"}
            color={"primary.100"}
            bg={"primary.60"}
            onClick={() => {
              setStartDate(trip.start_date),
                setStatus(trip.status),
                setEndDate(trip.end_date ? trip.end_date : ""),
                onClose();
            }}
            boxShadow={
              themeCtx.darkMode
                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
            }
          />
        }
      >
        <Box
          display={"flex"}
          flexDir={"column"}
          justifyContent={"center"}
          pt={5}
          pb={7}
        >
          <Box mb={0}>
            <Text fontWeight={"bold"} color={"text.primary"} mb={2}>
              Status
            </Text>
            <StyledSelect
              required={true}
              general={true}
              value={status}
              onchange={setStatus}
              options={[
                { label: "completed", value: "completed" },
                { label: "pending", value: "pending" },
                { label: "in_progress", value: "in_progress" },
                { label: "accepted", value: "accepted" },
                { label: "declined", value: "declined" },
              ]}
            />
          </Box>

          <Text fontWeight={"bold"} color={"text.primary"} mt={8} mb={2}>
            Start Date
          </Text>
          <Input
            bg={"primary.80"}
            borderRadius={0}
            border={0}
            height={45}
            color={"text.primary"}
            width={"100%"}
            borderBottom={4}
            borderStyle={"solid"}
            borderColor={"action.100"}
            _autofill={{
              textFillColor: "text.primary",
              boxShadow: `0 0 0px 1000px ${
                themeCtx.darkMode ? "#171821" : "#primary.80"
              } inset`,
              textFillColor: themeCtx.darkMode ? "#FFFFFF" : "#000000",
            }}
            boxShadow={
              themeCtx.darkMode
                ? "5px 10px 15px 1px rgba(0,0,0,1)"
                : "5px 8px 15px 1px rgba(0,0,0,0.2)"
            }
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
            placeholder="Select start date and time"
            size="md"
            w={"100%"}
            type="datetime-local"
            variant={"outline"}
            onChange={(e) => setStartDate(e.target.value)}
            value={startDate}
          />

          <Text fontWeight={"bold"} color={"text.primary"} mt={8} mb={2}>
            End Date
          </Text>
          <Input
            bg={"primary.80"}
            borderRadius={0}
            border={0}
            height={45}
            color={"text.primary"}
            width={"100%"}
            borderBottom={4}
            borderStyle={"solid"}
            borderColor={"action.100"}
            _autofill={{
              textFillColor: "text.primary",
              boxShadow: `0 0 0px 1000px ${
                themeCtx.darkMode ? "#171821" : "#primary.80"
              } inset`,
              textFillColor: themeCtx.darkMode ? "#FFFFFF" : "#000000",
            }}
            boxShadow={
              themeCtx.darkMode
                ? "5px 10px 15px 1px rgba(0,0,0,1)"
                : "5px 8px 15px 1px rgba(0,0,0,0.2)"
            }
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
            placeholder="Select start date and time"
            size="md"
            w={"100%"}
            type="datetime-local"
            variant={"outline"}
            onChange={(e) => setEndDate(e.target.value)}
            value={endDate}
          />
        </Box>
      </FunctionalModalV2>
    </Box>
  );
}

function RoutesPage() {
  const deviceCtx = useContext(DevicesContext);
  const themeCtx = useContext(ThemeContext);
  const [routes, setRoutes] = useState(undefined);
  const [update, setUpdate] = useState(false);
  const [name, setName] = useState("");
  const [points, setPoints] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [trips, setTrips] = useState(undefined);
  const [cycollectors, setCycollectors] = useState([]);
  const [device, setDevice] = useState(-1);
  const [route, setRoute] = useState(-1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [updateTrips, setUpdateTrips] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    deviceCtx.getRoutesCall();
    getAllTrips();
  }, []);

  useEffect(() => {
    deviceCtx.getDevicesCall();
  }, []);

  useEffect(() => {
    setCycollectors(
      deviceCtx.devicesObj.devices.cycollector
        ? deviceCtx.devicesObj.devices.cycollector
        : []
    );
  }, [deviceCtx]);

  useEffect(() => {
    if (update) {
      deviceCtx.getRoutesCall();
      setUpdate(false);
    }
    deviceCtx &&
      deviceCtx.routes &&
      setRoutes(
        deviceCtx.routes.map((route) => {
          return {
            ...route,
            callBack: setUpdate,
          };
        })
      );
    setMarkers(
      routes &&
        routes
          .map((route) => {
            return route.points.length !== 0
              ? [
                  {
                    msg: `${route.name} origin`,
                    name: "A",
                    position: route.points[0],
                  },
                  {
                    msg: `${route.name} Destination`,
                    name: "B",
                    position: route.points[route.points.length - 1],
                  },
                ]
              : [];
          })
          .flat()
    );
  }, [update, deviceCtx]);

  const createRouteAction = () => {
    createRoute(name, points).then((res) => {
      showsuccess("Successfully created new route");
      setUpdate(true);
    });
  };

  useEffect(() => {
    if (updateTrips) {
      getAllTrips();
      setUpdateTrips(false);
    }
  }, [updateTrips]);

  const getAllTrips = () => {
    getTrips().then((res) => {
      setTrips(
        res.data.trips.map((trip) => {
          return {
            ...trip,
            callBack: setUpdateTrips,
          };
        })
      );
    });
  };

  const createTrip = () => {
    addTrip(route, device, startDate, endDate).then((res) => {
      showsuccess("Successfully created new trip");
      setUpdateTrips(true);
      resetCreatTrip();
      onClose();
    });
  };
  const resetCreatTrip = () => {
    setDevice(-1);
    setRoute(-1);
    setStartDate("");
    setEndDate("");
  };

  return (
    <>
      <Box px={5} className={"grid"} w={"100%"}>
        <ComplexTable
          title={"Routes"}
          loading={!routes}
          customPageSize={10}
          extractFn={extractRouteHeaders}
          data={
            routes
              ? routes.map((geo) => {
                  if (hasPermission(PERMISSIONS.DELETE_ROUTES)) {
                    return {
                      val: geo.name,
                      id: geo.id,
                      Route_Actions: { geofence: geo, geofences: routes },
                    };
                  } else {
                    return {
                      val: geo.name,
                      id: geo.id,
                    };
                  }
                })
              : undefined
          }
          icon={<Icon as={FaRoute} boxSize={"30px"} color={"action.100"} />}
        >
          {hasPermission(PERMISSIONS.CREATE_ROUTES) && (
            <FunctionalModal
              modalTitle={"Create Route"}
              btnTitle={"Create Route"}
              btnSize={"sm"}
              modalMinH={"700px"}
              modalMinW={"80%"}
              iconSize={"20px"}
              btnColor={"primary.60"}
              btnAction={
                <Button
                  onClick={createRouteAction}
                  w={"fit-content"}
                  isDisabled={name === "" || points.length === 0}
                  boxShadow={
                    themeCtx.darkMode
                      ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                      : "3px 5px 7px 1px rgba(0,0,0,0.2)"
                  }
                  color={"text.primary"}
                  bg={"primary.100"}
                  _hover={{ color: "primary.100", bg: "primary.60" }}
                >
                  Create Route
                </Button>
              }
            >
              <Box
                w={"100%"}
                h={"100%"}
                bg={"transparent"}
                borderRadius={"5px"}
              >
                <RoutesMap
                  markers={markers}
                  drawingComplete={setPoints}
                  routes={routes}
                  setRoute
                >
                  <Box display={"flex"} flexDir={"column"}>
                    <Text
                      color={"text.primary"}
                      fontWeight={"bold"}
                      mt={4}
                      mb={2}
                    >
                      Origin
                    </Text>
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
                      placeholder="Route Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Box>
                </RoutesMap>
              </Box>
            </FunctionalModal>
          )}
        </ComplexTable>
        <Box
          h={"513.1px"}
          width={"100%"}
          mb={5}
          bg={"primary.80"}
          borderRadius={"10px"}
          boxShadow={
            themeCtx.darkMode
              ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
              : "5px 4px 15px 1px rgba(0,0,0,0.2)"
          }
        >
          <RoutesMap markers={markers} routes={routes} />
        </Box>
      </Box>
      <Box ml={5} mr={5}>
        <ComplexTable
          title={"Trips"}
          height={314}
          loading={!trips}
          customPageSize={5}
          extractFn={extractTripHeaders}
          data={
            trips
              ? trips.map((trip) => {
                  trip.trip_actions = { trip: trip };
                  return trip;
                })
              : undefined
          }
          hiddenCols={[
            "device_id_column",
            "device_table",
            "route_allowed_buffer_meters",
            "customer",
            "created_by",
            "callBack",
          ]}
          icon={
            <Icon as={FaMapMarkedAlt} boxSize={"30px"} color={"action.100"} />
          }
        >
          <Button
            w={"fit-content"}
            color={"text.primary"}
            bg={"primary.60"}
            h={10}
            boxShadow={
              themeCtx.darkMode
                ? "5px 4px 10px 1px rgba(0,0,0,0.6)"
                : "5px 4px 10px 1px rgba(0,0,0,0.2)"
            }
            onClick={onOpen}
          >
            Create Trip
          </Button>

          <FunctionalModalV2
            modalTitle={"Create Trip"}
            btnSize={"sm"}
            modalMinH={"700px"}
            modalMinW={"50%"}
            iconSize={"20px"}
            btnColor={"primary.60"}
            reset={resetCreatTrip}
            isOpen={isOpen}
            footer={true}
            btnAction={
              <Button
                onClick={createTrip}
                w={"fit-content"}
                isDisabled={device === -1 || route === -1 || startDate === ""}
                color={"text.primary"}
                bg={"primary.60"}
                boxShadow={
                  themeCtx.darkMode
                    ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                    : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                }
              >
                Create Trip
              </Button>
            }
            closeBtn={
              <IconButton
                cursor={"pointer"}
                as={BiX}
                size={"sm"}
                fontSize={"xs"}
                rounded={"full"}
                color={"primary.100"}
                bg={"primary.60"}
                onClick={onClose}
                boxShadow={
                  themeCtx.darkMode
                    ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                    : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                }
              />
            }
          >
            <Box
              display={"flex"}
              flexDir={"column"}
              justifyContent={"center"}
              pt={5}
              pb={7}
            >
              <Text fontWeight={"bold"} color={"text.primary"} mb={2}>
                Device
              </Text>
              <Box mb={4}>
                <StyledSelect
                  required={true}
                  general={true}
                  value={device}
                  onchange={setDevice}
                  options={cycollectors.map((en) => {
                    return { label: en.name, value: en.id };
                  })}
                />
              </Box>
              <Text fontWeight={"bold"} color={"text.primary"} mb={2}>
                Routes
              </Text>

              <StyledSelect
                general={true}
                required={true}
                value={route}
                onchange={setRoute}
                options={
                  routes &&
                  routes.map((route) => {
                    return { label: route.name, value: route.id };
                  })
                }
              />

              <Text fontWeight={"bold"} color={"text.primary"} mt={8} mb={2}>
                Start Date
              </Text>
              <Input
                bg={"primary.80"}
                borderRadius={0}
                border={0}
                height={45}
                color={"text.primary"}
                width={"100%"}
                borderBottom={4}
                borderStyle={"solid"}
                borderColor={"action.100"}
                _autofill={{
                  textFillColor: "text.primary",
                  boxShadow: `0 0 0px 1000px ${
                    themeCtx.darkMode ? "#171821" : "#primary.80"
                  } inset`,
                  textFillColor: themeCtx.darkMode ? "#FFFFFF" : "#000000",
                }}
                boxShadow={
                  themeCtx.darkMode
                    ? "5px 10px 15px 1px rgba(0,0,0,1)"
                    : "5px 8px 15px 1px rgba(0,0,0,0.2)"
                }
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
                placeholder="Select start date and time"
                size="md"
                w={"100%"}
                type="datetime-local"
                variant={"outline"}
                onChange={(e) => setStartDate(e.target.value)}
                min={startDate}
              />

              <Text fontWeight={"bold"} color={"text.primary"} mt={8} mb={2}>
                End Date
              </Text>
              <Input
                bg={"primary.80"}
                borderRadius={0}
                border={0}
                height={45}
                color={"text.primary"}
                width={"100%"}
                borderBottom={4}
                borderStyle={"solid"}
                borderColor={"action.100"}
                _autofill={{
                  textFillColor: "text.primary",
                  boxShadow: `0 0 0px 1000px ${
                    themeCtx.darkMode ? "#171821" : "#primary.80"
                  } inset`,
                  textFillColor: themeCtx.darkMode ? "#FFFFFF" : "#000000",
                }}
                boxShadow={
                  themeCtx.darkMode
                    ? "5px 10px 15px 1px rgba(0,0,0,1)"
                    : "5px 8px 15px 1px rgba(0,0,0,0.2)"
                }
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
                placeholder="Select start date and time"
                size="md"
                w={"100%"}
                type="datetime-local"
                variant={"outline"}
                onChange={(e) => setEndDate(e.target.value)}
                min={endDate}
              />
            </Box>
          </FunctionalModalV2>
        </ComplexTable>
      </Box>
    </>
  );
}

export default RoutesPage;
