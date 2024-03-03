import { CopyIcon, Icon } from "@chakra-ui/icons";
import moment from "moment-timezone";
import {
  Box,
  Center,
  Flex,
  Image,
  Heading,
  Button,
  Tag,
  ButtonGroup,
  IconButton,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  Text,
  Spinner,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import React, { useEffect, useContext, useState, useRef } from "react";
import StatCard from "../../ui/card-device/stat-card-device";
import { GiBatteryPack, GiSattelite } from "react-icons/gi";
import "./device.css";
import HistoryPicker from "../../ui/history-picker/history-picker";
import { FcOvertime } from "react-icons/fc";
import CycollectImg from "../../../assets/images/devices/cycollector.webp";
import { DevicesContext } from "../../../context/devices";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillLock, AiFillUnlock } from "react-icons/ai";
import { TbAntenna, TbRoute } from "react-icons/tb";
import { HiOutlineLocationMarker } from "react-icons/hi";
import excel from "../../../assets/images/logo/excel.png";
import container from "../../../assets/images/logo/container.png";
import {
  getTelemetry,
  changeLockStatus,
  getDeviceTypesById,
  getLatestValues,
  exportTelemetry,
} from "../../../api/devices";
import { ThemeContext } from "../../../context/theme";
import { getMarineTrafficLogs } from "../../../api/marine-traffic";
import { FaShip } from "react-icons/fa";
import DeviceFunctions from "./device-functions/device-functions";
import {
  editDeviceConfigurations,
  editDeviceThresholds,
  changeWifiConfigrations,
  editDeviceMode,
  uploadFirmWareFile,
  getDeviceModes,
  editDeviceAlarmInterval,
} from "../../../api/configurations";
import { showinfo, showsuccess } from "../../../helpers/toast-emitter";
import { DEVICES, PERMISSIONS } from "../../../types/devices";
import {
  addGeofenceToDevice,
  addTrip,
  changeTripStatus,
  deleteDeviceGeofence,
  editDeviceGeofence,
  getDeviceGeofences,
  getTripsByDevice,
} from "../../../api/geofences";
import {
  extractContainerHeaders,
  formatDate,
} from "../../../helpers/array-map";
import StyledSelect from "../../ui/styled-select/styled-select";
import RoutesMap from "../../ui/routes-map/routes-map";
import { TripStatus } from "../../../data/trips";
import DeviceChart from "./device-chart/device-chart";
import { FaSimCard } from "react-icons/fa";
import { MdGpsOff } from "react-icons/md";
import { hasPermission } from "../../../helpers/permissions-helper";
import TableV2 from "../../ui/table-v2/table-v2";
// import { io } from "socket.io-client";
import AlarmsTable from "../../ui/alarms-table/alarms-table";
import ShipTrackingCard from "../../ui/ship-tracking-card/ship-tracking-card";
import LocationReplay from "./location-replay/location-replay";
import map from "../../../assets/images/logo/map.png";
import { useMediaQuery } from "@chakra-ui/react";
import serverEvent from "../../../helpers/sse-helper";
const URL = process.env.REACT_APP_SERVER_URL;
import { getUserInfo } from "../../../../src/api/user";

const FileDownload = require("js-file-download");

function Device() {
  const themeCtx = useContext(ThemeContext);
  const navigate = useNavigate();
  const { containerId, Id, identifier } = useParams();
  const deviceCtx = useContext(DevicesContext);
  const [messageTypes, setMessageTypes] = useState([]);
  const [requestedMode, setRequestedMode] = useState(null);
  const [currentMode, setCurrentMode] = useState(null);
  const [modeRequestedAt, setModeRequestedAt] = useState(null);
  const [deviceGeofences, setDeviceGeofences] = useState([]);
  // const [socket, setSocket] = useState(undefined);
  const [latest_values, setLastestValues] = useState([]);
  const [cytags, setCytags] = useState([]);
  const [loadingExportReport, setLoadingExportRepord] = useState(false);
  const [loadingTelemetry, setLoadingTelemetry] = useState(false);
  const [loadingMarineTrafficData, setLoadingMarineTrafficData] =
    useState(false);
  const [marineTrafficData, setMarinTrafficData] = useState(undefined);
  const [route, setRoute] = useState();
  const [tripDate, setTripDate] = useState();
  const [trip, setTrip] = useState("-1");
  const [trips, setTrips] = useState([]);
  const [inProgressTrip, setInProgressTrip] = useState();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tableStartDate, setTableStartDate] = useState("");
  const [tableEndDate, setTableEndDate] = useState("");
  const [markers, setMarkers] = useState([]);
  const [locked, setLocked] = useState(false);
  const [sse, setSse] = useState(serverEvent);
  const [reloadSSE, setReloadSSE] = useState(false);
  const [isNonMobile] = useMediaQuery("(min-width: 1170px)");
  const URL = process.env.REACT_APP_SERVER_URL + "stream?channel=";
  const user = getUserInfo();
  const [paginationData, setPaginationData] = useState({
    data: undefined,
    numberOfPages: 0,
    pageNum: 0,
    numberPerPage: 25,
  });
  const [currentTrip, setCurrentTrip] = useState([]);
  const [status, setStatus] = useState();
  const [previousStatus, setPreviousStatus] = useState();
  const [statusUpdatedTime, setStatusUpdatedTime] = useState();
  const [statusRequestedAt, setStatusRequestedAt] = useState();
  const pageNumber = useRef(0);
  const numberPerPageRef = useRef(25);

  useEffect(() => {
    if (!deviceCtx.devicesObj.devices.cycollector) deviceCtx.getDevicesCall();
  }, []);

  const MessageHandler = (e) => {
    const messages = JSON.parse(e.data);
    console.log("messages event message=  ", messages);
    if (messages.device.id == identifier) {
      setPaginationData((prevData) => ({
        ...prevData,
        data: [...prevData.data, messages].sort((a, b) => {
          const timeA = new Date(a.message_time);
          const timeB = new Date(b.message_time);
          return timeB - timeA;
        }),
      }));
    }
  };
  const LockStatusHandler = (e) => {
    const message = JSON.parse(e.data);
    console.log("message= ", message);
    console.log("conditon", message["IMEI"] == identifier);
    if (message["IMEI"] == identifier) {
      message["last_status"] == "true" ? setLocked(true) : setLocked(false);
      message["last_status"] == "true"
        ? setPreviousStatus("Locked")
        : setPreviousStatus("Unlocked");
      message["last_requested_status"] == "true"
        ? setStatus("Locked")
        : setStatus("Unlocked");
      setStatusUpdatedTime(message["last_updated"]);
      setStatusRequestedAt(message["requested_at"]);
    }
  };

  const removeListeners = (close) => {
    sse.close();
    sse.removeEventListener("lock_status", console.log("REMOVED LS"));
    sse.removeEventListener("messages", console.log("REMOVED LS"));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    getMessageTypes();
    getLatestValues(identifier).then((res) => {
      let mappedMessages = {};
      res.data.data.messages.forEach((message) => {
        mappedMessages[message.message_type.name] = message.value;
        mappedMessages[message.message_type.name + "_last_update_at"] =
          message.last_update_at;
      });
      setCytags(res.data.data.cytags);
      if (
        mappedMessages["Latitude Triangulation_last_update_at"] &&
        mappedMessages["Latitude_last_update_at"]
      ) {
        if (
          moment(
            mappedMessages["Latitude Triangulation_last_update_at"] + "Z"
          ) >= moment(mappedMessages["Latitude_last_update_at"] + "Z")
        ) {
          mappedMessages.LatestLat = mappedMessages["Latitude Triangulation"];
          mappedMessages.LatestLng = mappedMessages["Longitude Tringulation"];
          mappedMessages.LastLocationAt =
            mappedMessages["Latitude Triangulation_last_update_at"];
          mappedMessages["Location Type"] = "Triangulation";
        } else {
          mappedMessages.LatestLat = mappedMessages["Latitude"];
          mappedMessages.LatestLng = mappedMessages["Longitude"];
          mappedMessages.LastLocationAt =
            mappedMessages["Latitude_last_update_at"];
          mappedMessages["Location Type"] = "GPS";
        }
      } else if (mappedMessages["Latitude Triangulation_last_update_at"]) {
        mappedMessages.LatestLat = mappedMessages["Latitude Triangulation"];
        mappedMessages.LatestLng = mappedMessages["Longitude Tringulation"];
        mappedMessages.LastLocationAt =
          mappedMessages["Latitude Triangulation_last_update_at"];
        mappedMessages["Location Type"] = "Triangulation";
      } else if (mappedMessages["Latitude_last_update_at"]) {
        mappedMessages.LatestLat = mappedMessages["Latitude"];
        mappedMessages.LatestLng = mappedMessages["Longitude"];
        mappedMessages.LastLocationAt =
          mappedMessages["Latitude_last_update_at"];
        mappedMessages["Location Type"] = "GPS";
      }
      if (mappedMessages.LatestLat && mappedMessages.LatestLng) {
        setMarkers([
          {
            position: {
              lat: mappedMessages.LatestLat,
              lng: mappedMessages.LatestLng,
            },
            name: Id,
          },
        ]);
      }
      setLastestValues(mappedMessages);
    });
  }, []);

  useEffect(() => {
    getDeviceMode();
    getDeviceGeofences(identifier).then((res) => {
      setDeviceGeofences(
        res.data.device_geofences
          .map((geo) => geo.geofence)
          .map((geonewo) => {
            return {
              ...geonewo,
              center: { lat: geonewo.center[0], lng: geonewo.center[1] },
              polygon: geonewo.polygon.map((latLng) => {
                return { lat: latLng[0], lng: latLng[1] };
              }),
            };
          })
      );
    });

    getTelemetryPagination(
      paginationData.pageNum,
      paginationData.numberPerPage
    );
    getTripsCall();
  }, []);

  // useEffect(() => {
  //   let socket = io(URL + "devices", {
  //     secure: true,
  //     upgrade: false,
  //     autoConnect: false,
  //   }).connect();

  //   setSocket(socket);
  //   console.log("is connected ?", socket.connected);

  //   function onConnect() {
  //     socket.emit("join_room", identifier);
  //     console.log("Connected");
  //   }
  //   socket.on("connect_error", () => {
  //     socket.close();
  //   });

  //   socket.on("disconnect", (reason) => {
  //     if (reason === "io server disconnect") {
  //       setTimeout(() => {
  //         socket.connect();
  //       }, 1000);
  //       console.log("Disconnected trying to connect");
  //     }
  //     if (reason === "transport close") {
  //       console.log("Disconnected transport closed");
  //       socket.close();
  //     }
  //     if (reason === "transport error") {
  //       console.log("Disconnected transport error trying to reconnect");
  //       setTimeout(() => {
  //         socket.connect();
  //       }, 2000);
  //     }
  //     if (reason === "ping timeout") {
  //       console.log("Disconnected ping timeout");
  //       socket.close();
  //     }
  //   });
  //   function onClose() {
  //     console.log("Disconnected");
  //   }

  //   socket.on("connect", onConnect);
  //   socket.on("disconnect", onClose);

  //   return () => {
  //     socket.close();
  //   };
  // }, []);

  useEffect(() => {
    function newMessageHandler(value) {
      if (
        tableStartDate === "" &&
        tableEndDate === "" &&
        pageNumber.current === 0 &&
        paginationData.data
      ) {
        const updatedPaginationData = paginationData.data;
        if (
          updatedPaginationData.length > 0 &&
          updatedPaginationData[0].message_time === value.message_time
        ) {
          for (var key of Object.keys(value)) {
            updatedPaginationData[0][key] = value[key];
          }
        } else {
          if (updatedPaginationData.length === paginationData.numberPerPage) {
            updatedPaginationData.pop();
          }
          updatedPaginationData.unshift(value);
        }
        setPaginationData({ ...paginationData, data: updatedPaginationData });
      }
    }
  }, [paginationData]);

  const connectAddListeners = () => {
    const URL = process.env.REACT_APP_SERVER_URL + "stream?channel=";
    const user = getUserInfo();
    // sse.close();

    var serverEvent = new EventSource(URL + user.device_group, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    console.log("CONNECTINGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
    serverEvent.addEventListener("lock_status", (e) => LockStatusHandler(e));

    paginationData &&
      serverEvent.addEventListener("messages", (e) => MessageHandler(e));
    setSse(serverEvent);
  };

  useEffect(() => {
    /*Lock Status Server Sent Event*/
    serverEvent && serverEvent.close();
    sse.close();
    console.log("readyState inside device page= ", sse.readyState);
    sse.removeEventListener("lock_status", console.log("REMOVED LS 0"));
    sse.removeEventListener("messages", console.log("REMOVED LS 0"));
    const user = getUserInfo();
    var serverEvent = new EventSource(URL + user.device_group, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    console.log("CONNECTINGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
    serverEvent.addEventListener("lock_status", (e) => LockStatusHandler(e));
    paginationData &&
      serverEvent.addEventListener("messages", (e) => MessageHandler(e));
    setSse(serverEvent);

    return () => {
      serverEvent.close();
      sse.close();
      sse.removeEventListener("error", console.log("REMOVED ERROR"));
      sse.removeEventListener("messages", console.log("removed 1"));
      sse.removeEventListener(
        "lock_status",
        console.log("removed Lock status")
      );
      sse.removeEventListener("alarms", console.log("alarms removed"));

      console.log("Component Unmounted");
    };
  }, []);

  useEffect(() => {
    //------------------------------ON ERROR--------------------------------------------
    sse.onerror = () => {
      console.log("Server Sent Event Connection TimedOut");
      sse.close();
      serverEvent && serverEvent.close();
      sse.removeEventListener("lock_status", console.log("REMOVED LS"));
      sse.removeEventListener("messages", console.log("REMOVED LS"));
      sse.removeEventListener("error", console.log("REMOVED ERROR"));
      var serverEvent = new EventSource(URL + user.device_group, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
      serverEvent.addEventListener("lock_status", (e) => LockStatusHandler(e));

      paginationData &&
        serverEvent.addEventListener("messages", (e) => MessageHandler(e));

      setSse(serverEvent);
      setReloadSSE((prevStat) => !prevStat);
    };
    return () => {
      sse.close();
      serverEvent.close();
      console.log("on Error Returned");
      serverEvent.removeEventListener("lock_status", console.log("REMOVED LS"));
      serverEvent.removeEventListener(
        "messages",
        console.log("messages removed")
      );
      serverEvent.removeEventListener(
        "error",
        console.log("error listener removed")
      );
    };
  }, [reloadSSE, sse.readyState]);

  useEffect(() => {
    return () => {
      console.log("RETURNING AND CLOSING ALL ");
      sse.close();
      serverEvent.close();
      sse.removeEventListener("lock_status", console.log("REMOVED LS"));
      sse.removeEventListener("messages", console.log("messages removed"));
      sse.removeEventListener("error", console.log("error listener removed"));
      sse.close();
    };
  }, []);

  const alarmHandler = (e) => {
    const message = JSON.parse(e.data);
    console.log("messages=  ", message);
    //clear all animation flags
    alarm_prev_res
      ? alarm_prev_res.map((Item) => {
          Item["newly"] = false;
        })
      : "";
    if (message["created"] == true) {
      alarm_prev_res.push(message);
      setupAlarms(alarm_prev_res);
    } else {
      const new_alarm_prev_res = alarm_prev_res.map((item) => {
        if (item["id"] == message["id"]) {
          return message;
        } else {
          return item;
        }
      });
      setupAlarms(new_alarm_prev_res);
      setAlarmPrevRes(new_alarm_prev_res);
    }
  };

  const getMessageTypes = () => {
    getDeviceTypesById(identifier).then((res) => {
      setMessageTypes(res.data.data);
    });
  };

  const getTripsCall = () => {
    getTripsByDevice(identifier).then((res) => {
      setTrips(res.data.trips);
      res.data.trips.forEach((trip) => {
        if (trip.status === TripStatus.IN_PROGRESS) {
          setInProgressTrip(trip);
        }
      });
    });
  };

  const getDeviceMode = () => {
    getDeviceModes(identifier).then((res) => {
      setStatus(res.data.Status);
      setPreviousStatus(res.data.previous_Status);
      if (res.data.Status == "Locked") {
        setLocked(true);
      } else {
        setLocked(false);
      }
      setStatusUpdatedTime(res.data.Status_updated_time);
      setStatusRequestedAt(res.data.Status_requested_at);
      setRequestedMode(res.data.Mode);
      setCurrentMode(res.data.previous_Mode);
      setModeRequestedAt(res.data.Mode_requested_at);
    });
  };

  const handleTelemetryExport = () => {
    setLoadingExportRepord(true);
    exportTelemetry(identifier, tableStartDate, tableEndDate)
      .then((res) => {
        FileDownload(res.data, "report.csv");
        setLoadingExportRepord(false);
      })
      .catch(() => {
        setLoadingExportRepord(false);
      });
  };

  const setConfigurations = ({
    deviceMode,
    gpsInterval,
    cytagScan,
    callback,
  }) => {
    editDeviceConfigurations(
      identifier,
      gpsInterval,
      cytagScan,
      deviceMode
    ).then(() => {
      callback();
      showsuccess("Successfully updated configurations");
    });
  };

  const setThresholds = ({
    maxT,
    maxH,
    minLight,
    minH,
    maxLight,
    minT,
    minProx,
    maxProx,
    thresholdEnabled,
    callback,
  }) => {
    editDeviceThresholds(
      identifier,
      minT,
      maxT,
      minH,
      maxH,
      minLight,
      maxLight,
      minProx,
      maxProx,
      thresholdEnabled
    ).then(() => {
      callback();
      showsuccess("Successfully updated thresholds");
    });
  };

  const setWifi = ({ wifiName, wifiPassword, callback }) => {
    changeWifiConfigrations(identifier, wifiName, wifiPassword).then(() => {
      callback();
      showsuccess("Successfully updated wifi credentials");
    });
  };

  const setDeviceMode = ({ mode, callback }) => {
    editDeviceMode(identifier, mode).then(() => {
      callback();
      getDeviceMode();
      showsuccess("Successfully updated device mode");
    });
  };

  const sendFirmwareUpdate = ({ file, version, callback }) => {
    uploadFirmWareFile(identifier, file, version).then(() => {
      callback();
      showsuccess(`Successfully sent device firmware v${version}`);
    });
  };

  const editDeviceAlarmIntervalCall = ({ alarmInterval, callback }) => {
    editDeviceAlarmInterval(identifier, alarmInterval).then(() => {
      callback();
      showsuccess("Successfully updated device alarm interval");
    });
  };

  const handleLockToggle = (status) => {
    changeLockStatus(identifier, !status ? "Unlock" : "Lock").then(() => {
      showsuccess(`Successfully ${!status ? "Unlocked" : "Locked"} the device`);
      setLocked(status);
    });
  };

  const updateDeviceGeofenceList = (geofenceId, geofenceType) => {
    addGeofenceToDevice(
      geofenceId,
      identifier,
      DEVICES.CYCOLLECTOR,
      geofenceType
    ).then(() => {
      deviceCtx.getDevicesCall();
      showsuccess("Successfully updated geofence for this device");
    });
  };

  const removeDeviceGeofence = (geofenceId) => {
    deleteDeviceGeofence(identifier, geofenceId).then((res) => {
      deviceCtx.getDevicesCall();
      showsuccess("Successfully removed geofence for this device");
    });
  };

  const updateDeviceGeofence = (geofenceId, active) => {
    editDeviceGeofence(identifier, geofenceId, active).then((res) => {
      deviceCtx.getDevicesCall();
      showsuccess("Successfully activated geofence for this device");
    });
  };

  const createTrip = () => {
    addTrip(route, identifier, tripDate).then((res) => {
      showsuccess("successfully added trip");
      getTripsCall();
    });
  };

  const getTelemetryPagination = (pageNum, numberPerPage, reset) => {
    setLoadingTelemetry(true);
    pageNumber.current = pageNum;
    numberPerPageRef.current = numberPerPage;
    getTelemetry(
      identifier,
      reset ? "" : tableStartDate,
      reset ? "" : tableEndDate,
      pageNum,
      numberPerPage
    )
      .then((res) => {
        setPaginationData({
          data: res.data.data.grouped_messages,
          numberOfPages: res.data.data.pages_number,
          pageNum: pageNum,
          numberPerPage: numberPerPage,
        });
        setLoadingTelemetry(false);
      })
      .catch(() => {
        setLoadingTelemetry(false);
      });
  };

  const getTripField = (tripId, field) => {
    try {
      const trip = trips.find((t) => t.id === parseInt(tripId));
      return (
        trip[field][0].toUpperCase() +
        trip[field].replaceAll("_", " ").slice(1, trip[field].length)
      );
    } catch (error) {
      return "";
    }
  };

  const copyLocationLink = () => {
    navigator.clipboard.writeText(
      `https://www.google.com/maps/?q=${latest_values.LatestLat},${latest_values.LatestLng}`
    );
    showinfo("copied google maps link to clipboard");
  };

  const switchTripMsg = (status) => {
    switch (status) {
      case TripStatus.IN_PROGRESS:
        return "Started";
      case TripStatus.COMPLETED:
        return "Completed";
      case TripStatus.PENDING:
        return "Stoped";
      default:
        break;
    }
  };

  const changeTripStatusCall = (trip, status) => {
    changeTripStatus(trip, status).then((res) => {
      showsuccess(`Successfully ${switchTripMsg(status)} the trip`);
      getTripsCall();
    });
  };

  const setTripInMap = (trip) => {
    setTrip(trip);
    const route = trips.find((t) => t.id === parseInt(trip)).route;
    Object.assign(route, {
      points: route.points.map((point) => {
        return {
          lat: point[0],
          lng: point[1],
        };
      }),
    });
    setCurrentTrip([route]);
  };

  const getLabel = () => {
    if (tableStartDate !== "" && tableEndDate !== "") {
      return `${formatDate(tableStartDate)} - ${formatDate(tableEndDate)}`;
    } else {
      return "Latest Messages";
    }
  };

  const redirectToCytag = (name, id) => {
    return navigate("/device/Cytag/" + name + "/" + id);
  };

  const getContainerData = () => {
    if (containerId !== "-" && !marineTrafficData) {
      setLoadingMarineTrafficData(true);
      getMarineTrafficLogs(containerId)
        .then((res) => {
          setLoadingMarineTrafficData(false);
          setMarinTrafficData(res.data.data);
        })
        .catch((e) => {
          setLoadingMarineTrafficData(false);
          setMarinTrafficData([]);
        });
    }
  };

  return (
    <>
      <Box className={"grid"} pl={5} pr={5} mb={5}>
        <Box
          w="100%"
          borderRadius={"10px"}
          bg={"primary.80"}
          minH={"500px"}
          h={"100%"}
          boxShadow={
            themeCtx.darkMode
              ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
              : "5px 4px 15px 1px rgba(0,0,0,0.2)"
          }
        >
          <Box
            borderTopRadius={"10px"}
            gap={2}
            p={3}
            alignItems={"center"}
            as={Flex}
            boxShadow={
              themeCtx.darkMode
                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
            }
          >
            <Box minW={"100px"}>
              <Image
                borderRadius="full"
                bg={"primary.100"}
                p={2}
                objectFit={"scale-down"}
                w={"100%"}
                h={"100px"}
                alt="device"
                src={CycollectImg}
                boxShadow={
                  themeCtx.darkMode
                    ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                    : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                }
              />
            </Box>
            <Box w={"100%"}>
              <Box
                w={"100%"}
                flexWrap={"wrap"}
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                pl={2}
                mb={2}
                display={"flex"}
              >
                <Box
                  width={isNonMobile ? "60%" : "100%"}
                  pl={0}
                  pr={2}
                  pb={2}
                  pt={2}
                >
                  <Heading
                    flexWrap={"wrap"}
                    flexDir={"row"}
                    fontSize={"2xl"}
                    color={"text.primary"}
                    marginBottom={2}
                  >
                    {Id}
                  </Heading>
                </Box>

                <Box mt={-2}>
                  {hasPermission(PERMISSIONS.LOCK_UNLOCK_DEVICE) && (
                    <Box
                      w={"100px"}
                      as={Flex}
                      borderRadius={20}
                      boxShadow={
                        themeCtx.darkMode
                          ? "5px 2px 15px 1px rgba(0,0,0,0.9)"
                          : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                      }
                    >
                      <Center
                        zIndex={1}
                        className={!locked ? "leftTranslate" : "rightTranslate"}
                        color={"text.primary"}
                        borderRadius={"20px"}
                        bg={locked ? "text.success" : "text.warning"}
                        h={"35px"}
                        w={"50px"}
                        borderStyle={"solid"}
                        borderWidth={locked ? 0 : 0}
                        borderColor={"action.100"}
                      >
                        {locked ? (
                          <Icon
                            color={"text.primary"}
                            as={AiFillLock}
                            boxSize={"20px"}
                          />
                        ) : (
                          <Icon
                            color={"text.primary"}
                            as={AiFillUnlock}
                            boxSize={"20px"}
                          />
                        )}
                      </Center>
                      <Center
                        as={Button}
                        zIndex={0}
                        borderLeftRadius={"20px"}
                        cursor={"pointer"}
                        color={"text.primary"}
                        fontWeight={"bold"}
                        onClick={() => handleLockToggle(true)}
                        borderRightRadius={"0px"}
                        bg={"primary.100"}
                        h={"35px"}
                        w={"50px"}
                        fontSize={11}
                      >
                        {!locked ? "Lock" : ""}
                      </Center>
                      <Center
                        as={Button}
                        zIndex={0}
                        borderRightRadius={"20px"}
                        cursor={"pointer"}
                        color={"text.primary"}
                        fontWeight={"bold"}
                        onClick={() => handleLockToggle(false)}
                        borderLeftRadius={"0px"}
                        bg={"primary.100"}
                        h={"35px"}
                        w={"50px"}
                        fontSize={11}
                      >
                        {!locked ? "" : "UnLock"}
                      </Center>
                    </Box>
                  )}
                </Box>
              </Box>
              <Box
                flexWrap={"wrap"}
                flexDir={"row"}
                gap={"1%"}
                pl={2}
                display={"flex"}
              >
                <Box
                  display={"flex"}
                  flexDir={"row"}
                  w={isNonMobile ? "49.5%" : "fit-content"}
                  pr={1}
                >
                  <Text
                    flexWrap={"wrap"}
                    flexDir={"row"}
                    color={"text.primary"}
                  >
                    <span
                      style={{
                        color:
                          themeCtx.theme.colors &&
                          themeCtx.theme.colors.primary[60],
                      }}
                    >
                      IMEI:&nbsp;
                    </span>

                    {identifier}
                  </Text>
                </Box>

                {currentMode === requestedMode ? (
                  <Box
                    display={"flex"}
                    flexDir={"row"}
                    w={isNonMobile ? "49.5%" : "fit-content"}
                    pr={2}
                  >
                    <Text
                      flexWrap={"wrap"}
                      flexDir={"row"}
                      color={"text.primary"}
                    >
                      <span
                        style={{
                          color:
                            themeCtx.theme.colors &&
                            themeCtx.theme.colors.primary[60],
                        }}
                      >
                        Mode:&nbsp;
                      </span>

                      {currentMode === null ? "None" : `${currentMode}`}
                    </Text>
                  </Box>
                ) : (
                  <Popover isLazy>
                    <PopoverTrigger>
                      <Box
                        display={"flex"}
                        flexDir={"row"}
                        cursor={"pointer"}
                        w={isNonMobile ? "49.5%" : "fit-content"}
                        pr={2}
                      >
                        <Text
                          flexWrap={"wrap"}
                          flexDir={"row"}
                          color={"text.primary"}
                        >
                          <span
                            style={{
                              color:
                                themeCtx.theme.colors &&
                                themeCtx.theme.colors.primary[60],
                            }}
                          >
                            Mode:&nbsp;
                          </span>
                          {currentMode === null ? "None" : `${currentMode}`}
                        </Text>
                        <Box display={"flex"} alignItems={"center"}>
                          <Box
                            w={2}
                            h={2}
                            borderRadius={"100%"}
                            ml={2}
                            backgroundColor={"danger.100"}
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        </Box>
                      </Box>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverHeader fontWeight="semibold">
                        Updating device Mode
                      </PopoverHeader>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody>
                        {requestedMode} is requested at{" "}
                        {formatDate(modeRequestedAt)} but not taken yet
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )}

                <Box
                  display={"flex"}
                  flexDir={"row"}
                  minW={"200px"}
                  w={isNonMobile ? "49.5%" : "100%"}
                  pr={1}
                >
                  <Text
                    flexWrap={"wrap"}
                    flexDir={"row"}
                    color={"text.primary"}
                  >
                    <span
                      style={{
                        color:
                          themeCtx.theme.colors &&
                          themeCtx.theme.colors.primary[60],
                      }}
                    >
                      Container:&nbsp;
                    </span>
                    {containerId === "-" || containerId === null
                      ? `None`
                      : containerId}
                  </Text>
                </Box>
                {cytags.map((cytag) => {
                  return (
                    <Box
                      display={"flex"}
                      flexDir={"row"}
                      w={isNonMobile ? "49.5%" : "100%"}
                      pr={1}
                    >
                      <Text
                        color={"text.primary"}
                        onClick={(e) => redirectToCytag(cytag.name, cytag.id)}
                        _hover={{ textDecoration: "underline" }}
                        cursor={"pointer"}
                        flexWrap={"wrap"}
                        flexDir={"row"}
                      >
                        <span
                          style={{
                            color:
                              themeCtx.theme.colors &&
                              themeCtx.theme.colors.primary[60],
                          }}
                        >
                          CyTag:&nbsp;
                        </span>

                        {cytag.name}
                      </Text>
                    </Box>
                  );
                })}
              </Box>
            </Box>
            <Box></Box>
          </Box>

          <Flex flexWrap={"wrap"} w={"100%"} gap={4} p={4}>
            <StatCard
              themeCtx={themeCtx}
              minH={"130px"}
              width={"100%"}
              icon={
                <AiFillLock
                  size={"30px"}
                  h={"100%"}
                  display={"block"}
                  margin={"auto"}
                  p={"20%"}
                  color="secondary.60"
                />
              }
              subTitle={`Last requested status: ${status || "-"}`}
              subText={`Last Status: ${previousStatus || "-"}`}
              subText2={`last updated: ${
                statusUpdatedTime ? formatDate(statusUpdatedTime) : "-"
              }`}
              subText3={`Requested at: ${
                statusRequestedAt ? formatDate(statusRequestedAt) : "-"
              }`}
              bgColor={"primary.100"}
              textColor={"secondary.100"}
              maxH={"400px"}
              maxW={"100%"}
            />
            <StatCard
              themeCtx={themeCtx}
              icon={
                <TbRoute
                  size={"25px"}
                  h={"100%"}
                  display={"block"}
                  margin={"auto"}
                  p={"20%"}
                  color="secondary.60"
                />
              }
              title="In progress trips"
              subTitle={
                inProgressTrip && inProgressTrip.route
                  ? inProgressTrip.route.name
                  : "No trip is currently in progress"
              }
              subText={`Trip started at: ${
                inProgressTrip ? formatDate(inProgressTrip.start_date) : "-"
              }`}
              bgColor={"primary.100"}
              textColor={"secondary.100"}
              maxH={"400px"}
              maxW={"100%"}
              width={"100%"}
              minH={"fit-content"}
            />
            <StatCard
              themeCtx={themeCtx}
              icon={
                <GiBatteryPack
                  size={"25px"}
                  h={"100%"}
                  display={"block"}
                  margin={"auto"}
                  p={"20%"}
                  color="secondary.60"
                />
              }
              title="Battery"
              subTitle={
                latest_values["Cylock Battery"]
                  ? latest_values["Cylock Battery"] + " V"
                  : "-"
              }
              subText={`Last updated at: ${
                latest_values["Cylock Battery_last_update_at"]
                  ? formatDate(latest_values["Cylock Battery_last_update_at"])
                  : "-"
              }`}
              bgColor={"primary.100"}
              textColor={"secondary.100"}
              maxH={"400px"}
              maxW={"100%"}
              width={"100%"}
              minH={"fit-content"}
            />
            <StatCard
              themeCtx={themeCtx}
              icon={
                <FaSimCard
                  size={"25px"}
                  h={"100%"}
                  display={"block"}
                  margin={"auto"}
                  p={"20%"}
                  color="secondary.60"
                />
              }
              title="PCCW ICCID"
              subTitle={
                latest_values["PCCW ICCID"] ? latest_values["PCCW ICCID"] : "-"
              }
              subText={""}
              bgColor={"primary.100"}
              textColor={"secondary.100"}
              maxH={"400px"}
              maxW={"100%"}
              width={"100%"}
              minH={"fit-content"}
            />
            <StatCard
              themeCtx={themeCtx}
              icon={
                <GiSattelite
                  size={"25px"}
                  h={"100%"}
                  display={"block"}
                  margin={"auto"}
                  p={"20%"}
                  color="secondary.60"
                />
              }
              title="SATCOM ICCID"
              subTitle={
                latest_values["SATCOM ICCID"]
                  ? latest_values["SATCOM ICCID"]
                  : "-"
              }
              subText={""}
              bgColor={"primary.100"}
              textColor={"secondary.100"}
              maxH={"400px"}
              maxW={"100%"}
              width={"100%"}
              minH={"fit-content"}
            />
            <StatCard
              themeCtx={themeCtx}
              width={"100%"}
              icon={
                <TbAntenna
                  size={"30px"}
                  h={"100%"}
                  display={"block"}
                  margin={"auto"}
                  p={"20%"}
                  color="secondary.60"
                />
              }
              title="Communication type"
              subTitle={latest_values["Communication"] || "-"}
              subText={
                latest_values["Communication"]
                  ? `Last updated at: ${formatDate(
                      latest_values["Communication_last_update_at"]
                    )}`
                  : "-"
              }
              bgColor={"primary.100"}
              textColor={"secondary.100"}
              maxH={"400px"}
              maxW={"100%"}
              minH={"fit-content"}
            />
            <StatCard
              themeCtx={themeCtx}
              width={"100%"}
              icon={
                <HiOutlineLocationMarker
                  size={"30px"}
                  h={"100%"}
                  display={"block"}
                  margin={"auto"}
                  p={"20%"}
                  color="secondary.60"
                />
              }
              title="Location"
              subTitle={`lat: ${
                latest_values.LatestLat ? latest_values.LatestLat : "-"
              }, lng: ${
                latest_values.LatestLng ? latest_values.LatestLng : "-"
              }`}
              subText={
                latest_values.LastLocationAt
                  ? `Last updated at: ${formatDate(
                      latest_values.LastLocationAt
                    )}`
                  : "-"
              }
              bgColor={"primary.100"}
              textColor={"secondary.100"}
              maxH={"400px"}
              maxW={"100%"}
              minH={"fit-content"}
            />

            {latest_values["Location Type"] ? (
              <StatCard
                themeCtx={themeCtx}
                width={"100%"}
                icon={
                  <MdGpsOff
                    size={"30px"}
                    h={"100%"}
                    display={"block"}
                    margin={"auto"}
                    p={"20%"}
                    color="secondary.60"
                  />
                }
                title="Location Type"
                subTitle={latest_values["Location Type"]}
                bgColor={"primary.100"}
                textColor={"secondary.100"}
                maxH={"400px"}
                maxW={"100%"}
                minH={"fit-content"}
              />
            ) : null}
          </Flex>
          {hasPermission(PERMISSIONS.POST_DEVICE_MODE) &&
            hasPermission(PERMISSIONS.EDIT_DEVICE_GEOFENCES) && (
              <Box
                p={4}
                gap={2}
                display={"flex"}
                width={"100%"}
                alignItems={"center"}
                justifyContent={"center"}
                flexDir={"row"}
              >
                <DeviceFunctions
                  removeDeviceGeofence={removeDeviceGeofence}
                  updateDeviceGeofenceList={updateDeviceGeofenceList}
                  updateDeviceGeofence={updateDeviceGeofence}
                  imei={identifier}
                  setConfig={setConfigurations}
                  changeMode={setDeviceMode}
                  changeThres={setThresholds}
                  changeWifi={setWifi}
                  updateFirmware={sendFirmwareUpdate}
                  createTrip={createTrip}
                  route={route}
                  setRoute={setRoute}
                  setTripDate={setTripDate}
                  tripDate={tripDate}
                  editDeviceAlarmInterval={editDeviceAlarmIntervalCall}
                />
              </Box>
            )}
        </Box>
        <Box
          w="100%"
          borderRadius={"10px"}
          backgroundColor={"primary.80"}
          h={"100%"}
          boxShadow={
            themeCtx.darkMode
              ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
              : "5px 4px 15px 1px rgba(0,0,0,0.2)"
          }
        >
          <Box w={"100%"} h={"100%"}>
            <Box
              m={1}
              w={"100%"}
              p={"2%"}
              alignContent={"baseline"}
              as={Flex}
              paddingBottom={2}
              display={"flex"}
              flexDir={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Box display={"flex"} flexDir={"row"} gap={2}>
                <Image position={"relative"} src={map} h={"30px"}></Image>
                <Heading w={"70%"} color={"text.primary"} fontSize={"2xl"}>
                  Map
                </Heading>
              </Box>
              <Box display={"flex"} flexDir={"row"} gap={1}>
                <LocationReplay name={Id} id={identifier} />
                <IconButton
                  size={"sm"}
                  title="get historical data"
                  aria-label="get historical data"
                  rounded={"full"}
                  icon={
                    <CopyIcon
                      color={themeCtx.darkMode ? "#000000" : "#FFFFFF"}
                    />
                  }
                  bg={"primary.60"}
                  onClick={() => copyLocationLink()}
                  boxShadow={
                    themeCtx.darkMode
                      ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                      : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                  }
                />
              </Box>
            </Box>
            <RoutesMap
              zoom={16}
              geofences={deviceGeofences}
              markers={markers}
              routes={currentTrip}
              tripChoices={
                trips.length !== 0 ? (
                  <Accordion
                    m={1}
                    w={"100%"}
                    borderColor={"action.100"}
                    boxShadow={
                      themeCtx.darkMode
                        ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                        : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                    }
                    allowMultiple
                  >
                    <AccordionItem>
                      <AccordionButton
                        bg={themeCtx.darkMode ? "primary.100" : "primary.60"}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                      >
                        <Box
                          color={"text.primary"}
                          fontSize={"xl"}
                          textAlign="left"
                        >
                          Trips
                        </Box>
                        <AccordionIcon color={"action.100"} />
                      </AccordionButton>
                      <AccordionPanel pl={4} pr={4} pb={4}>
                        <Box
                          w={"100%"}
                          alignItems={"center"}
                          flexWrap={"wrap"}
                          display={"flex"}
                        >
                          <Box
                            gap={1}
                            alignItems={"flex-start"}
                            mb={1}
                            display={"flex"}
                            width={"100%"}
                            flexDir={"column"}
                            justifyContent={"space-between"}
                          >
                            <Box
                              width={"100%"}
                              display={"flex"}
                              mb={4}
                              flexWrap={"wrap"}
                              flexDir={"row"}
                              justifyContent={"space-between"}
                            >
                              <Box width={"80%"} mt={4}>
                                <StyledSelect
                                  value={trip}
                                  onchange={setTripInMap}
                                  required={false}
                                  general={true}
                                  options={trips.map((trip) => {
                                    return {
                                      label: trip.route
                                        ? trip.route.name
                                        : "--",
                                      value: trip.id,
                                    };
                                  })}
                                />
                              </Box>
                              <Tag
                                size={"md"}
                                color={"text.primary"}
                                fontWeight={"bold"}
                                bgColor={"primary.60"}
                                borderRadius={"20px"}
                                mt={4}
                                display={
                                  trip && trip !== "-1" ? "flex" : "none"
                                }
                                pl={3}
                                pr={3}
                              >
                                {trip &&
                                  trip !== -1 &&
                                  getTripField(trip, "status")}
                              </Tag>
                            </Box>
                            <ButtonGroup
                              borderRadius={"20px"}
                              color={"text.primary"}
                              isAttached
                              variant="outline"
                              boxShadow={
                                themeCtx.darkMode
                                  ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                                  : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                              }
                            >
                              <Button
                                onClick={() =>
                                  changeTripStatusCall(
                                    trip,
                                    TripStatus.IN_PROGRESS
                                  )
                                }
                                bg={"primary.100"}
                                _hover={{ bg: "primary.60" }}
                                color={"tex.primary"}
                                borderRadius={"20px"}
                                borderColor={"primary.60"}
                                isDisabled={
                                  trip &&
                                  getTripField(trip, "status") !==
                                    TripStatus.PENDING[0].toUpperCase() +
                                      TripStatus.PENDING.replaceAll(
                                        "_",
                                        " "
                                      ).slice(1, TripStatus.PENDING.length)
                                }
                              >
                                Start Trip
                              </Button>
                              <Button
                                onClick={() =>
                                  changeTripStatusCall(
                                    trip,
                                    TripStatus.COMPLETED
                                  )
                                }
                                bg={"primary.100"}
                                _hover={{ bg: "primary.60" }}
                                borderColor={"primary.60"}
                                color={"tex.primary"}
                                borderRadius={"20px"}
                                isDisabled={
                                  trip &&
                                  getTripField(trip, "status") !==
                                    TripStatus.IN_PROGRESS[0].toUpperCase() +
                                      TripStatus.IN_PROGRESS.replaceAll(
                                        "_",
                                        " "
                                      ).slice(1, TripStatus.IN_PROGRESS.length)
                                }
                              >
                                Complete Trip
                              </Button>
                              <Button
                                onClick={() =>
                                  changeTripStatusCall(trip, TripStatus.PENDING)
                                }
                                bg={"primary.100"}
                                color={"text.warning"}
                                borderRadius={"20px"}
                                borderColor={"primary.60"}
                                _hover={{ bg: "primary.60" }}
                                isDisabled={
                                  trip &&
                                  getTripField(trip, "status") !==
                                    TripStatus.IN_PROGRESS[0].toUpperCase() +
                                      TripStatus.IN_PROGRESS.replaceAll(
                                        "_",
                                        " "
                                      ).slice(1, TripStatus.IN_PROGRESS.length)
                                }
                              >
                                Stop Trip
                              </Button>
                            </ButtonGroup>
                          </Box>
                        </Box>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                ) : null
              }
            />
          </Box>
        </Box>
      </Box>
      <Box mr={5} ml={5}>
        <DeviceChart
          mb={5}
          mt={"0.5%"}
          id={identifier}
          options={messageTypes
            .filter((t) => t.graph_type !== null)
            .map((op) => {
              return { label: op.name, value: op.id, ...op };
            })}
          setStartDate={setStartDate}
          startDate={startDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      </Box>
      <Box mr={5} ml={5} mb={5}>
        <AlarmsTable
          filters={{ entity_id: identifier }}
          id={identifier}
          cyLocks={undefined}
          cyTags={undefined}
          name={Id}
          serverEvents={sse}
          OptionalId={identifier}
        />
      </Box>
      <Box mt={"0.5%"} ml={5} mr={5} mb={5}>
        <TableV2
          title={"Time series data"}
          icon={<Icon as={FcOvertime} boxSize={"40px"} color={"action.100"} />}
          fetchData={getTelemetryPagination}
          data={
            paginationData.data === undefined
              ? {
                  ...paginationData,
                  data: [],
                }
              : paginationData
          }
          extractFn={extractContainerHeaders}
          hiddenCols={["id", "device", "newly"]}
          defaultPageSize={25}
          firstCol={"message_time"}
          loading={loadingTelemetry}
          label={getLabel()}
        >
          <Box as={Flex} justifyContent={"flex-end"}>
            <Box
              as={Flex}
              flexWrap={"wrap"}
              gap={1}
              justifyContent={"end"}
              alignContent={"flex-start"}
            >
              <IconButton
                size={"sm"}
                rounded={"full"}
                bg={"primary.60"}
                onClick={() =>
                  getTelemetryPagination(
                    paginationData.pageNum,
                    paginationData.numberPerPage
                  )
                }
                boxShadow={
                  themeCtx.darkMode
                    ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                    : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                }
              >
                {!loadingTelemetry ? (
                  <RepeatIcon
                    color={themeCtx.darkMode ? "#000000" : "#FFFFFF"}
                  />
                ) : (
                  <Center minH={"250px"} w={"100%"}>
                    <Spinner
                      thickness="2px"
                      speed="0.85s"
                      emptyColor="text.primary"
                      color="primary.60"
                      size="xs"
                    />
                  </Center>
                )}
              </IconButton>
              <HistoryPicker
                selectStartDate={(date) => setTableStartDate(date)}
                handleClick={() =>
                  getTelemetryPagination(0, paginationData.numberPerPage, false)
                }
                reset={() =>
                  getTelemetryPagination(0, paginationData.numberPerPage, true)
                }
                selectEndDate={(date) => setTableEndDate(date)}
                disabled={tableStartDate !== "" || !tableEndDate !== ""}
                startDate={tableStartDate}
                endDate={tableEndDate}
                loading={loadingTelemetry}
                endDateRequired={false}
              />
              {hasPermission(PERMISSIONS.EXPORT_DEVICE_TELEMETRY) && (
                <>
                  <IconButton
                    size={"sm"}
                    p={1}
                    color={"text.primary"}
                    bg={"primary.60"}
                    rounded={"full"}
                    boxShadow={
                      themeCtx.darkMode
                        ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                        : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                    }
                    onClick={handleTelemetryExport}
                  >
                    {!loadingExportReport ? (
                      <Image position={"relative"} src={excel} h={5}></Image>
                    ) : (
                      <Spinner
                        thickness="2px"
                        speed="0.85s"
                        emptyColor="text.primary"
                        color="primary.60"
                        size="xs"
                      />
                    )}
                  </IconButton>
                </>
              )}
            </Box>
          </Box>
        </TableV2>
        <Box w="100%">
          <Accordion
            borderColor={"primary.80"}
            allowToggle
            boxShadow={
              themeCtx.darkMode
                ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                : "5px 4px 15px 1px rgba(0,0,0,0.2)"
            }
            borderRadius={"10px"}
          >
            <AccordionItem borderRadius={"10px"}>
              {({ isExpanded }) => (
                <>
                  <AccordionButton
                    h={"70px"}
                    borderTopRadius={"10px"}
                    borderBottomRadius={!isExpanded ? "10px" : 0}
                    _hover={{ cursor: "pointer" }}
                    as={Flex}
                    bg={"primary.80"}
                    color={"action.100"}
                    onClick={() => {
                      if (!isExpanded) {
                        getContainerData();
                      }
                    }}
                  >
                    <Box p={"1%"} w={"100%"} gap={3} as={Flex}>
                      <Icon as={FaShip} fontSize={30} color={"action.100"} />
                      <Heading
                        w={"100%"}
                        color={"text.primary"}
                        fontSize={"xl"}
                      >
                        Marine traffic tracking
                      </Heading>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel bg={"primary.80"} borderBottomRadius={"10px"}>
                    <>
                      {!loadingMarineTrafficData && containerId !== "-" ? (
                        <Box
                          backgroundColor={"primary.80"}
                          w={"100%"}
                          minH={"200px"}
                          borderRadius={"10px"}
                          paddingTop={10}
                        >
                          {!marineTrafficData ||
                          (marineTrafficData &&
                            marineTrafficData.length === 0) ? (
                            <Heading
                              w={"100%"}
                              color={"text.primary"}
                              fontSize={"xl"}
                              textAlign={"center"}
                            >
                              No data available
                            </Heading>
                          ) : (
                            <>
                              {(marineTrafficData ? marineTrafficData : []).map(
                                (event, index) => (
                                  <ShipTrackingCard
                                    left={event.vesselPosition ? true : false}
                                    right={event.vesselPosition ? false : true}
                                    event={event}
                                    index={index}
                                    length={marineTrafficData.length}
                                    events={marineTrafficData}
                                  />
                                )
                              )}
                            </>
                          )}
                        </Box>
                      ) : (
                        <Box
                          backgroundColor={"primary.80"}
                          w={"100%"}
                          minH={"250px"}
                          mt={1}
                          borderRadius={"10px"}
                          display={"flex"}
                          alignItems={"flex-start"}
                          justifyContent={"center"}
                        >
                          {containerId === "-" ? (
                            <Center
                              display={"flex"}
                              flexDir={"column"}
                              minH={"350px"}
                              w={"100%"}
                            >
                              <Image
                                position={"relative"}
                                src={container}
                                h={150}
                                mb={5}
                              ></Image>
                              <Heading
                                w={"100%"}
                                color={"text.warning"}
                                fontWeight={"semibold"}
                                fontSize={"xl"}
                                textAlign={"center"}
                              >
                                No Attached Container !
                              </Heading>
                            </Center>
                          ) : (
                            <Center minH={"350px"} w={"100%"}>
                              <Spinner
                                thickness="6px"
                                speed="0.85s"
                                emptyColor="text.primary"
                                color="primary.60"
                                size="xl"
                              />
                            </Center>
                          )}
                        </Box>
                      )}
                    </>
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          </Accordion>
        </Box>
      </Box>
    </>
  );
}
export default Device;
