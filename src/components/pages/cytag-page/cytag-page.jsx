import React, { useState, useEffect, useRef, useContext } from "react";
import { Icon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Image,
  Stack,
  Heading,
  Spinner,
  Text,
  IconButton,
  Center,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { ThemeContext } from "../../../context/theme";
import StatCard from "../../ui/card-device/stat-card-device";
import { GiBatteryPack } from "react-icons/gi";
import { FiThermometer } from "react-icons/fi";
import "./cytag-page.css";
import HistoryPicker from "../../ui/history-picker/history-picker";
import { WiHumidity } from "react-icons/wi";
import CytagImg from "../../../assets/images/devices/cytag.webp";
import { useParams } from "react-router-dom";
import { BsLightning } from "react-icons/bs";
import {
  getDeviceTypesById,
  getTelemetry,
  getLatestValues,
} from "../../../api/devices";
import {
  extractContainerHeaders,
  formatDate,
} from "../../../helpers/array-map";
import DeviceChart from "../device/device-chart/device-chart";
import { FcOvertime } from "react-icons/fc";
import TableV2 from "../../ui/table-v2/table-v2";
// import { io } from "socket.io-client";
import AlarmsTable from "../../ui/alarms-table/alarms-table";
import { useMediaQuery } from "@chakra-ui/react";
import serverEvent from "../../../helpers/sse-helper";
import { getUserInfo } from "../../../../src/api/user";

function CytagPage() {
  const themeCtx = useContext(ThemeContext);
  const { Id, identifier } = useParams();
  // const [socket, setSocket] = useState(undefined);
  const [messageTypes, setMessageTypes] = useState([]);
  const [latest_values, setLastestValues] = useState([]);
  const [loadingTelemetry, setLoadingTelemetry] = useState(false);
  const [isNonMobile] = useMediaQuery("(min-width: 1000px)");
  const [sse, setSse] = useState(serverEvent);
  const [reloadSSE, setReloadSSE] = useState(false);
  const URL = process.env.REACT_APP_SERVER_URL + "stream?channel=";
  const user = getUserInfo();
  useEffect(() => {
    getLatestValues(identifier).then((res) => {
      let mappedMessages = {};
      res.data.data.messages.forEach((message) => {
        mappedMessages[message.message_type.name] = message.value;
        mappedMessages[message.message_type.name + "_last_update_at"] =
          message.last_update_at;
      });
      setLastestValues(mappedMessages);
    });
  }, []);

  const getMessageTypes = () => {
    getDeviceTypesById(identifier).then((res) => {
      setMessageTypes(res.data.data);
    });
  };

  const [paginationData, setPaginationData] = useState({
    data: undefined,
    numberOfPages: 0,
    pageNum: 0,
    numberPerPage: 25,
  });

  useEffect(() => {
    getTelemetryPagination(
      paginationData.pageNum,
      paginationData.numberPerPage
    );

    getMessageTypes();
  }, []);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tableStartDate, setTableStartDate] = useState("");
  const [tableEndDate, setTableEndDate] = useState("");

  const pageNumber = useRef(0);
  const numberPerPageRef = useRef(25);

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

  const refreshedTelePagination = () => {
    getTelemetryPagination(pageNumber.current, numberPerPageRef.current);
  };

  useEffect(() => {
    if (!tableStartDate !== "" && !tableEndDate !== "") {
      refreshedTelePagination();
    }
  }, []);

  const getLabel = () => {
    if (tableStartDate !== "" && tableEndDate !== "") {
      return `${formatDate(tableStartDate)} - ${formatDate(tableEndDate)}`;
    } else {
      return "Latest Messages";
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
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
  //       if (reason === "io server disconnect") {
  //         setTimeout(() => {
  //           socket.connect();
  //         }, 1000);
  //         console.log("Disconnected trying to connect");
  //       }
  //     }
  //     if (reason === "transport close") {
  //       console.log("Disconnected transport close");
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

  // useEffect(() => {
  //   function newMessageHandler(value) {
  //     if (
  //       tableStartDate === '' &&
  //       tableEndDate === '' &&
  //       pageNumber.current === 0 &&
  //       paginationData.data
  //     ) {
  //       const updatedPaginationData = paginationData.data;
  //       if (
  //         updatedPaginationData.length > 0 &&
  //         updatedPaginationData[0].message_time === value.message_time
  //       ) {
  //         for (var key of Object.keys(value)) {
  //           updatedPaginationData[0][key] = value[key];
  //         }
  //       } else {
  //         if (updatedPaginationData.length === paginationData.numberPerPage) {
  //           updatedPaginationData.pop();
  //         }
  //         updatedPaginationData.unshift(value);
  //       }
  //       setPaginationData({ ...paginationData, data: updatedPaginationData });
  //     }
  //   }
  //   if (socket) {
  //     socket.removeAllListeners(`${identifier}/message`);
  //     socket.on(`${identifier}/message`, newMessageHandler);
  //   }
  // }, [socket, paginationData]);
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
    // const message = JSON.parse(e.data);
    // console.log("message= ", message);
    // console.log("conditon", message["IMEI"] == identifier);
    // if (message["IMEI"] == identifier) {
    //   message["last_status"] == "true" ? setLocked(true) : setLocked(false);
    //   message["last_status"] == "true"
    //     ? setPreviousStatus("Locked")
    //     : setPreviousStatus("Unlocked");
    //   message["last_requested_status"] == "true"
    //     ? setStatus("Locked")
    //     : setStatus("Unlocked");
    //   setStatusUpdatedTime(message["last_updated"]);
    //   setStatusRequestedAt(message["requested_at"]);
    // }
  };
  useEffect(() => {
    const user = getUserInfo();
    /*Lock Status Server Sent Event*/
    console.log(
      "readyState inside device tag= ",
      sse.readyState,
      user.device_group
    );
    // sse.removeEventListener("messages", console.log("REMOVED LS 0"));
    var serverEvent = new EventSource(URL + user.device_group, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    console.log("CONNECTINGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG TAAAAAAAAG");

    serverEvent.addEventListener("messages", (e) => MessageHandler(e));
    setSse(serverEvent);

    return () => {
      sse.removeEventListener("error", console.log("REMOVED ERROR"));
      sse.removeEventListener("messages", console.log("removed 1"));
      sse.removeEventListener(
        "lock_status",
        console.log("removed Lock status")
      );
      sse.removeEventListener("alarms", console.log("alarms removed"));
      serverEvent.close();

      console.log("Component Unmounted");
    };
  }, []);

  useEffect(() => {
    //------------------------------ON ERROR--------------------------------------------
    sse.onerror = () => {
      console.log("Server Sent Event Connection TimedOut");
      sse.close();

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
      serverEvent.close();
    };
  }, [reloadSSE, sse.readyState]);

  useEffect(() => {
    return () => {
      sse.close();
      serverEvent.close();
      sse.removeEventListener("lock_status", console.log("REMOVED LS"));
      sse.removeEventListener("messages", console.log("messages removed"));
      sse.removeEventListener("error", console.log("error listener removed"));
      sse.close();
    };
  }, []);

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
            <Image
              borderRadius="full"
              bg={"primary.100"}
              p={2}
              objectFit={"scale-down"}
              w={"100px"}
              h={"100px"}
              alt="device"
              boxShadow={
                themeCtx.darkMode
                  ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                  : "5px 4px 15px 1px rgba(0,0,0,0.2)"
              }
              src={CytagImg}
            />
            <Box width={"100%"}>
              <Heading fontSize={"2xl"} color={"text.primary"} marginBottom={2}>
                {Id && Id}
              </Heading>
              <Box
                display={"flex"}
                flexDir={"row"}
                w={isNonMobile ? "49.5%" : "fit-content"}
                pr={1}
              >
                <Text minW={"fit-content"} color={"primary.60"}>
                  {isNonMobile ? "Bluetooth ID:" : "ID:"} &nbsp;
                </Text>
                <Text flexWrap={"wrap"} color={"text.primary"}>
                  {identifier}
                </Text>
              </Box>
            </Box>
          </Box>
          <Stack p={4} spacing="3">
            <StatCard
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
                latest_values.Battery
                  ? `${parseFloat(latest_values.Battery)} V`
                  : "-"
              }
              subText={
                latest_values.Battery_last_update_at
                  ? `Last updated at: ${formatDate(
                      latest_values.Battery_last_update_at
                    )}`
                  : "`Last updated at: -"
              }
              bgColor={"primary.100"}
              textColor={"secondary.100"}
              maxH={"400px"}
              maxW={"100%"}
              width={"100%"}
              minH={"fit-content"}
            />
            <StatCard
              icon={
                <WiHumidity
                  size={"30px"}
                  h={"100%"}
                  display={"block"}
                  margin={"auto"}
                  p={"20%"}
                  color="secondary.60"
                />
              }
              title="Humidity"
              subTitle={
                latest_values.Humidity
                  ? `${parseFloat(latest_values.Humidity)} %RH`
                  : "-"
              }
              subText={
                latest_values.Humidity_last_update_at
                  ? `Last updated at: ${formatDate(
                      latest_values.Humidity_last_update_at
                    )}`
                  : "Last updated at: -"
              }
              bgColor={"primary.100"}
              textColor={"secondary.100"}
              maxH={"400px"}
              maxW={"100%"}
              width={"100%"}
              minH={"fit-content"}
            />
            <StatCard
              icon={
                <FiThermometer
                  size={"30px"}
                  h={"100%"}
                  display={"block"}
                  margin={"auto"}
                  p={"20%"}
                  color="secondary.60"
                />
              }
              title="Tempreture"
              subTitle={
                latest_values.Temperature
                  ? `${parseFloat(latest_values.Temperature)} C`
                  : "-"
              }
              subText={
                latest_values.Temperature_last_update_at
                  ? `Last updated at: ${formatDate(
                      latest_values.Temperature_last_update_at
                    )}`
                  : "Last updated at: -"
              }
              bgColor={"primary.100"}
              textColor={"secondary.100"}
              maxH={"400px"}
              maxW={"100%"}
              width={"100%"}
              minH={"fit-content"}
            />
            <StatCard
              icon={
                <BsLightning
                  size={"30px"}
                  h={"100%"}
                  display={"block"}
                  margin={"auto"}
                  p={"20%"}
                  color="secondary.60"
                />
              }
              title="Light Intensity"
              subTitle={
                latest_values["Light Intensity"]
                  ? `${parseFloat(latest_values["Light Intensity"])} hlx`
                  : "-"
              }
              subText={
                latest_values["Light Intensity_last_update_at"]
                  ? `Last updated at: ${formatDate(
                      latest_values["Light Intensity_last_update_at"]
                    )}`
                  : "Last updated at: -"
              }
              bgColor={"primary.100"}
              textColor={"secondary.100"}
              maxH={"400px"}
              maxW={"100%"}
              width={"100%"}
              minH={"fit-content"}
            />
          </Stack>
        </Box>
        <Box as={Flex} w={"100%"}>
          <DeviceChart
            startType={"Temperature"}
            mb={"0"}
            mt={"0"}
            id={identifier}
            setStartDate={setStartDate}
            options={messageTypes
              .filter((t) => t.graph_type !== null)
              .map((op) => {
                return { label: op.name, value: op.id, ...op };
              })}
            startDate={startDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </Box>
      </Box>
      <Box ml={5} mr={5}>
        <AlarmsTable
          filters={{ entity_id: identifier }}
          id={identifier}
          name={Id}
          cyTags={undefined}
          cyLocks={undefined}
          serverEvents={sse}
          OptionalId={identifier}
        />
      </Box>
      <Box ml={5} mr={5}>
        <TableV2
          title={"Time series data"}
          icon={<Icon as={FcOvertime} boxSize={"30px"} color={"action.100"} />}
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
          hiddenCols={["id", "device"]}
          defaultPageSize={25}
          firstCol={"message_time"}
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
                      thickness="6px"
                      speed="0.85s"
                      emptyColor="text.primary"
                      color="primary.60"
                      size="xl"
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
                disabled={!tableStartDate || !tableEndDate}
                startDate={tableStartDate}
                endDate={tableEndDate}
                endDateRequired={false}
              />
            </Box>
          </Box>
        </TableV2>
      </Box>
    </>
  );
}

export default CytagPage;
