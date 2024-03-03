import { Icon, CheckCircleIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Center,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState, useContext, useRef } from "react";
import StatCard from "../../ui/card/stat-card";
import ComplexTable from "../../ui/table/complex-table";
import Map from "../../ui/map/map";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import { showsuccess } from "../../../helpers/toast-emitter";
import {
  extractUniqueKeys,
  sortAlpabitcally,
} from "../../../helpers/array-map";
import { actionAlarm } from "../../../api/alarms";
import FunctionalModal from "../../ui/functional-modal/functional-modal";
import { ALARM_STATUS } from "../../../data/alarms";
import { DevicesContext } from "../../../context/devices";
import { ThemeContext } from "../../../context/theme";
import PdfExport from "../../ui/pdf-export/pdf-export";
import ExcelExport from "../../ui/excel-export/excel-export";
import GeneralAccordion from "../../ui/general-accordion/general-accordion";
import { hasPermission } from "../../../helpers/permissions-helper";
import { PERMISSIONS } from "../../../types/devices";
import AlarmsTable from "../../ui/alarms-table/alarms-table";
import cycollector from "../../../assets/images/logo/cycollector.png";
import cytag from "../../../assets/images/logo/cytag.png";
import alarm from "../../../assets/images/logo/warning.png";
import map from "../../../assets/images/logo/map.png";
import container from "../../../assets/images/logo/container.png";
import { useMediaQuery } from "@chakra-ui/react";
import serverEvent from "./../../../helpers/sse-helper";
import { getUserInfo } from "../../../../src/api/user";
const URL = process.env.REACT_APP_SERVER_URL + "stream?channel=";
const user = getUserInfo();

export function AlarmAction({
  actionPerformed,
  alarm,
  callback,
  acknowldgeAction,
  useAlarmId,
}) {
  const themeCtx = useContext(ThemeContext);
  const actionAlarmCall = () => {
    actionAlarm(
      alarm,
      acknowldgeAction ? ALARM_STATUS.ACKNOWLEDGED : ALARM_STATUS.CLEARED
    ).then(() => {
      showsuccess(`Alarm ${acknowldgeAction ? "acknowledged" : "cleared"}`);
      callback(useAlarmId ? alarm : {});
    });
  };

  return (
    <Box
      as={Flex}
      width={"100%"}
      justifyContent={"start"}
      pl={acknowldgeAction ? 2 : 2}
    >
      {!actionPerformed ? (
        <FunctionalModal
          modalTitle={acknowldgeAction ? "Acknowledge alarm" : "Clear alarm"}
          iconBtn={CheckCircleIcon}
          modalMinW={"100px"}
          modalMinH={"200px"}
          btnColor={"primary.60"}
          btnAction={
            <Button
              w={"fit-content"}
              backgroundColor={"primary.80"}
              boxShadow={
                themeCtx.darkMode
                  ? "3px 2px 7px 1px rgba(0,0,0,0.9)"
                  : "3px 5px 7px 1px rgba(0,0,0,0.2)"
              }
              color={"text.primary"}
              _hover={{ color: "primary.100", bg: "primary.60" }}
              onClick={actionAlarmCall}
            >
              {acknowldgeAction ? "Acknowledge" : "Clear"}
            </Button>
          }
        >
          <Text p={10} color={"text.primary"} fontWeight={"bold"}>
            Are You Sure you want to{" "}
            {acknowldgeAction ? "acknowledge" : "clear"} this alarm?
          </Text>
        </FunctionalModal>
      ) : (
        <Icon
          borderRadius={"20px"}
          as={CheckCircleIcon}
          boxSize={"30px"}
          color={"text.success"}
          boxShadow={
            themeCtx.darkMode
              ? "5px 4px 15px 1px rgba(0,0,0,1)"
              : "5px 7px 15px 1px rgba(0,0,0,0.3)"
          }
        />
      )}
    </Box>
  );
}

function Dashboard() {
  const deviceCtx = useContext(DevicesContext);
  const themeCtx = useContext(ThemeContext);
  const [markers, setMarkers] = useState([]);
  const navigate = useNavigate();
  const [cycollects, setCycollects] = useState(undefined);
  const [cytags, setCytags] = useState(undefined);
  const [alarms, setAlarms] = useState(undefined);
  const [containers, setContainers] = useState(undefined);
  const [isNonMobile] = useMediaQuery("(min-width: 1000px)");
  const [deviceTablePage, setDeviceTablePage] = useState(0);
  const [tagsTablePage, setTagsTablePage] = useState(0);
  const [cycollectorData, setCycollectorData] = useState(undefined);
  const [sse, setSse] = useState(serverEvent);
  const refAlarm = useRef(null);
  const refDevices = useRef(null);
  const refTags = useRef(null);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);
  const [reloadSSE, setReloadSSE] = useState(false);

  const serverEventHandler = (e) => {
    const message = JSON.parse(e.data);
    console.log("message=  ", message);
    setCycollects((prevCyCollects) => {
      return prevCyCollects
        ? prevCyCollects.map((item) => {
            if (item.id === message["IMEI"]) {
              return { ...item, lock_status: message["last_status"] };
            }
            return item;
          })
        : undefined;
    });
  };

  useEffect(() => {
    console.log("lock_status first listener added");
    sse.addEventListener("lock_status", (e) => {
      serverEventHandler(e);
    });
    return () => {
      console.log("lock_status first listener removed");
    };
  }, []);

  useEffect(() => {
    deviceCtx.getDevicesCall();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    console.log("ready state", sse.readyState);
    if (sse.readyState == 2) {
      sse.close();
      serverEvent && serverEvent.close();
      var serverEvent = new EventSource(URL + user.device_group, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
      console.log("------------CONNECTED IN DASHBOARD---------");
      serverEvent.addEventListener("lock_status", (e) => serverEventHandler(e));
      setSse(serverEvent);
    }

    return () => {
      console.log("-----------CLOSING IN DASHBOARD---------");
      sse.close();
      serverEvent.close();
      sse.removeEventListener("lock_status", console.log("REMOVED LS"));
      // sse.removeEventListener('alarms',console.log('alarms event listener removed before adding'))
    };
  }, [sse.readyState]);

  useEffect(() => {
    console.log("----------on error handling attached to sse----------");
    sse.onerror = () => {
      console.log("on error dashboard");
      sse.removeEventListener("lock_status", console.log("REMOVED LS"));
      sse.close();
      serverEvent && serverEvent.close();
      var serverEvent = new EventSource(URL + user.device_group, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
      serverEvent.addEventListener("lock_status", (e) => {
        serverEventHandler(e);
      });
      setSse(serverEvent);
      setReloadSSE((prevStat) => !prevStat);
      console.log("CONNECTED IN ON ERROR");
    };
    return () => {
      sse.close();
      serverEvent.close();
      sse.removeEventListener("lock_status", console.log("REMOVED LS"));
    };
  }, [reloadSSE, sse.readyState]);

  useEffect(() => {
    if (cycollects) {
      setMarkers(
        cycollects.map((dev) => {
          return { position: { lat: dev.lat, lng: dev.lng }, name: dev.name };
        })
      );
      setCycollectorData(
        cycollects
          .sort((a, b) => (a, b, "name", false))
          .map((lock) => {
            return {
              ...lock,
              imei: lock.id,
              cytags: { cytags: lock.cytags, showOnly: true },
            };
          })
      );
    }
  }, [cycollects]);

  useEffect(() => {
    if (deviceCtx && deviceCtx.devicesObj.devices) {
      setCycollects(
        deviceCtx.devicesObj.devices.cycollector
          ? deviceCtx.devicesObj.devices.cycollector
          : undefined
      );
      var containersCount = 0;
      deviceCtx.devicesObj.devices.cycollector &&
        deviceCtx.devicesObj.devices.cycollector.forEach((cycollector) => {
          if (
            cycollector.attached_to !== null &&
            cycollector.attached_to !== "-"
          ) {
            containersCount += 1;
          }
        });
      setContainers(containersCount);
      setCytags(
        deviceCtx.devicesObj.devices.cytag
          ? deviceCtx.devicesObj.devices.cytag
          : undefined
      );
    }
  }, [deviceCtx]);

  const redirectToCytag = (row) => {
    return navigate(
      "device/Cytag/" +
        row.find((col) => col.column.Header === "NAME").value +
        "/" +
        row.find((col) => col.column.Header === "ID").value
    );
  };

  const redirectToDevice = (row) => {
    return navigate(
      "device/" +
        row.find((col) => col.column.Header === "ATTACHED TO").value +
        "/" +
        row.find((col) => col.column.Header === "NAME").value +
        "/" +
        row.find((col) => col.column.Header === "IMEI").value
    );
  };

  const prepareExportDataCyLock = (data) => {
    const keys = extractUniqueKeys(data);
    data.map((dev) => {
      let cytagStr = "";
      dev.cytags &&
        typeof dev.cytags !== "string" &&
        dev.cytags.forEach((cytag) => {
          cytagStr += cytag.name + ",";
        });
      dev.cytags = cytagStr;
      delete dev.roles;
      keys.forEach((key) => {
        if (key !== "roles" && key !== "lat" && key !== "lng") {
          if (dev[key]) {
            dev[key] = String(dev[key]) + "";
          } else {
            dev[key] = "-";
          }
        }
      });
      return dev;
    });
    return data;
  };

  const prepareExportDataCyTag = (data) => {
    data.map((dev) => {
      delete dev.roles;
      const keys = Object.keys(dev);
      keys.forEach((key) => {
        if (dev[key]) {
          dev[key] = String(dev[key]) + "";
        } else {
          delete dev[key];
        }
      });
      return dev;
    });
    return data;
  };

  const handleClickToScroll = (refto) => {
    refto.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Box w={"100%"} mb={1} pl={5} pr={5}>
        <Flex
          mb={5}
          gap={1}
          flexWrap={"wrap"}
          flexDirection={"column"}
          bg={"primary.80"}
          p={5}
          borderRadius={"10px"}
          boxShadow={
            themeCtx.darkMode
              ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
              : "5px 4px 15px 1px rgba(0,0,0,0.2)"
          }
        >
          <Box>
            <Heading mb={5} fontSize={"2xl"} color={"text.primary"}>
              Devices' Summary{" "}
            </Heading>
          </Box>

          <Box display={"flex"} flexDirection={"row"} gap={"5%"}>
            {cycollects === undefined &&
            cytags === undefined &&
            containers === undefined &&
            alarms === undefined ? (
              <Center w={"100%"}>
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
                <Box
                  width={"50%"}
                  display={"flex"}
                  flexDir={isNonMobile ? "row" : "column"}
                  justifyContent={"space-between"}
                  gap={isNonMobile ? 0 : 5}
                >
                  <StatCard
                    icon={cycollector}
                    title="CyLocks"
                    subTitle={cycollects && cycollects.length}
                    bgColor={"primary.100"}
                    textColor={"secondary.100"}
                    minH={"10px"}
                    maxW={"100%"}
                    width={isNonMobile ? "45%" : "100%"}
                    handleClickScroll={() => handleClickToScroll(refDevices)}
                    imageH={isNonMobile ? 50 : 45}
                    themeCtx={themeCtx}
                    isNoneMobile={isNonMobile}
                    loading={cycollects === undefined}
                  />

                  <StatCard
                    icon={cytag}
                    title="CyTags"
                    subTitle={cytags && cytags.length}
                    bgColor={"primary.100"}
                    textColor={"secondary.100"}
                    minH={"100px"}
                    maxW={"100%"}
                    width={isNonMobile ? "45%" : "100%"}
                    imageH={isNonMobile ? 50 : 45}
                    themeCtx={themeCtx}
                    handleClickScroll={() => handleClickToScroll(refTags)}
                    isNoneisNonMobile={isNonMobile}
                    loading={cytags === undefined}
                  />
                </Box>
                <Box
                  width={"50%"}
                  display={"flex"}
                  flexDir={isNonMobile ? "row" : "column"}
                  justifyContent={"space-between"}
                >
                  <StatCard
                    icon={container}
                    title="Containers"
                    subTitle={containers}
                    bgColor={"primary.100"}
                    textColor={"secondary.100"}
                    minH={"10px"}
                    maxW={"100%"}
                    width={isNonMobile ? "45%" : "100%"}
                    handleClickScroll={() => handleClickToScroll(refDevices)}
                    imageH={isNonMobile ? 45 : 42}
                    themeCtx={themeCtx}
                    isNoneisNonMobile={isNonMobile}
                    loading={
                      containers === undefined || cycollects === undefined
                    }
                  />

                  <StatCard
                    icon={alarm}
                    title="Alarms"
                    subTitle={alarms && alarms.length}
                    bgColor={"primary.100"}
                    textColor={"secondary.100"}
                    minH={"100px"}
                    maxW={"100%"}
                    width={isNonMobile ? "45%" : "100%"}
                    imageH={isNonMobile ? 50 : 45}
                    themeCtx={themeCtx}
                    handleClickScroll={() => handleClickToScroll(refAlarm)}
                    isNoneisNonMobile={isNonMobile}
                    loading={alarms === undefined}
                  />
                </Box>
              </>
            )}
          </Box>
        </Flex>
        <GeneralAccordion
          themeCtx={themeCtx}
          title={
            <Box w={"100%"} gap={1} as={Flex}>
              <Image position={"relative"} src={map} h={"30px"}></Image>
              <Heading w={"100%"} color={"text.primary"} fontSize={"2xl"}>
                CyLocks Map
              </Heading>
            </Box>
          }
        >
          <Box
            backgroundColor={"primary.80"}
            w={"100%"}
            minH={"400px"}
            overflow={"hidden"}
            mt={1}
            mb={2}
            borderRadius={"5px"}
          >
            <Map minH={"400px"} trips={false} markers={markers} />
          </Box>
        </GeneralAccordion>
      </Box>
      <Box mb={1} ref={refAlarm} pl={5} pr={5}>
        <AlarmsTable
          setScheduling={true}
          filters={{}}
          cyLocks={cycollects}
          cyTags={cytags}
          parentAlarms={alarms}
          setParentAlarms={setAlarms}
          serverEvents={sse}
        />
      </Box>
      <Box mt={1} w={"100%"} ref={refDevices} pl={5} pr={5}>
        {/* DEVICES TABLE */}
        <ComplexTable
          pageNumber={deviceTablePage}
          setPageNumber={setDeviceTablePage}
          redirectToDevice={redirectToDevice}
          loading={
            cycollects &&
            cycollects.length === 0 &&
            deviceCtx.devicesCallLoading
          }
          data={
            // hasPermission(PERMISSIONS.GET_DEVICE_DETAILS) &&
            // hasPermission(PERMISSIONS.GET_DEVICE) &&
            // hasPermission(PERMISSIONS.GET_ALL_DEVICES) &&
            // hasPermission(PERMISSIONS.GET_DEVICES_REQUESTS) &&
            // hasPermission(PERMISSIONS.GET_DEVICES_TELEMETRY) &&
            // hasPermission(PERMISSIONS.GET_DEVICES_SPATIAL) &&
            cycollectorData
          }
          hiddenCols={[
            "pccw_iccid",
            "satcom_iccid",
            "id",
            "lat",
            "lng",
            "latest_values",
            "cylock_battery_timestamp",
            "communication_type_timestamp",
            "lat_timestamp",
            "lng_timestamp",
            "location_type_timestamp",
            "cylock_battery",
            "communication_type",
            "lat",
            "lng",
            "location_type",
            "newly",
          ]}
          title={"CyLocks"}
          icon={
            <Image
              position={"relative"}
              src={cycollector}
              h={14}
              mt={-2}
            ></Image>
          }
        >
          <Box as={Flex} gap={1}>
            <PdfExport
              title={"CyLocks"}
              data={prepareExportDataCyLock(cycollects ? [...cycollects] : [])}
            />
            <ExcelExport
              title={"CyLocks"}
              data={prepareExportDataCyLock(cycollects ? [...cycollects] : [])}
            />
          </Box>
        </ComplexTable>
      </Box>
      {cytags && cytags.length !== 0 && (
        <Box mt={1} w={"100%"} ref={refTags} pl={5} pr={5}>
          <ComplexTable
            hiddenCols={[
              "cytag_battery_timestamp",
              "temperature_timestamp",
              "humidity_timestamp",
              "light_intensity_timestamp",
              "cytag_battery",
              "temperature",
              "humidity",
              "light_intensity",
              "latest_values",
              "newly",
            ]}
            loading={cytags.length === 0 && deviceCtx.devicesCallLoading}
            pageNumber={tagsTablePage}
            setPageNumber={setTagsTablePage}
            redirectToDevice={redirectToCytag}
            data={cytags.sort((a, b) => sortAlpabitcally(a, b, "name", false))}
            title={"CyTags"}
            icon={<Image position={"relative"} src={cytag} h={10}></Image>}
          >
            <Box as={Flex} gap={1}>
              <PdfExport
                title={"CyTags"}
                data={prepareExportDataCyTag([...cytags])}
              />
              <ExcelExport
                title={"CyTags"}
                data={prepareExportDataCyTag([...cytags])}
              />
            </Box>
          </ComplexTable>
        </Box>
      )}
    </>
  );
}

export default Dashboard;
