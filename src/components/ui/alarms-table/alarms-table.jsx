import { Button, IconButton } from "@chakra-ui/button";
import {
  Box,
  Collapse,
  Flex,
  Text,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { BiFilter, BiX } from "react-icons/bi";
import { getAlarms, getAlarmsTypes } from "../../../api/alarms";
import { DevicesContext } from "../../../context/devices";
import { ThemeContext } from "../../../context/theme";
import { ALARM_STATUS, SEVERITY } from "../../../data/alarms";
import {
  extractAlarmHeaders,
  formatLocalToISOUTC,
} from "../../../helpers/array-map";
import ExcelExport from "../excel-export/excel-export";
import HistoryPicker from "../history-picker/history-picker";
import PdfExport from "../pdf-export/pdf-export";
import SchedulingReports from "../scheduling-reports/scheduling-reports";
import StyledSelect from "../styled-select/styled-select";
import ComplexTable from "../table/complex-table";
import FunctionalModalV2 from "../functional-modal-v2/functional-modal-v2";
import alarm from "../../../assets/images/logo/warning.png";

function AlarmsTable({
  filters,
  id,
  name,
  cyLocks,
  cyTags,
  setParentAlarms,
  serverEvents,
  OptionalId,
}) {
  const [alarms, setAlarms] = useState(undefined);
  const [alarmsData, setAlarmsData] = useState([]);
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const deviceCtx = useContext(DevicesContext);
  const [alarmType, setAlarmType] = useState("-1");
  const [entity, setEntity] = useState("-1");
  const [notified, setNotified] = useState("-1");
  const [severity, setSeverity] = useState("-1");
  const [status, setStatus] = useState("-1");
  const [alarmTablePage, setAlarmTablePage] = useState(0);
  const [alarmsFilters, setAlarmsFilters] = useState(filters);
  const [loadingAlarms, setLoadingAlarms] = useState(true);
  const [alarmTypes, setAlarmTypes] = useState([]);
  const theme = useContext(ThemeContext);
  const { isOpen, onToggle } = useDisclosure();
  const [alarm_prev_res, setAlarmPrevRes] = useState([]);
  const [setUpAlarmsFlag, setSetUpAlarmsFlag] = useState(false);
  const [eventAdded, seteventAdded] = useState(false);
  const [alarmsCalled, setAlarmsCalled] = useState(false);

  const [state1, setstate1] = useState("");
  useEffect(() => {
    console.log("@@@@@@@@@@@@@22");
    setstate1("aaa");
    return () => {
      console.log("MMMMMMMMMMMM");
    };
  }, [state1]);

  useEffect(() => {
    getAlarmsTypes().then((res) => {
      setAlarmTypes(res.data);
    });
  }, []);

  useEffect(() => {
    if (setParentAlarms) {
      setParentAlarms(alarms);
    }
  }, [alarms]);

  useEffect(() => {
    console.log(
      "DEVICE IN AARMS IS",
      deviceCtx.devicesObj.devices.cycollector,
      alarmsCalled,
      OptionalId
    );
    console.log(
      "ready state code inside alarms-table=",
      serverEvents.readyState
    );
    if (serverEvents.readyState == 0) {
      serverEvents.removeEventListener(
        "alarms",
        console.log("alarms event listener removed before adding")
      );
      console.log("enter condition");
      seteventAdded(true);
      serverEvents.addEventListener("alarms", (e) => {
        const message = JSON.parse(e.data);
        if (OptionalId != null || OptionalId != undefined) {
          if (message["entity_id"] == OptionalId) {
            console.log(
              "ALARMS====================================  ",
              message
            );
            alarm_prev_res
              ? alarm_prev_res.map((Item) => {
                  Item["newly"] = false;
                })
              : "";
            if (alarm_prev_res) {
              console.log(
                '!alarm_prev_res.filter((item)=>{return item["id"]==message["id"]})' +
                  !alarm_prev_res.find((item) => {
                    item.id === message.id;
                  })
              );
              if (
                message["created"] == true &&
                !alarm_prev_res.find((item) => item.id === message.id)
              ) {
                console.log("NEW");
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
                console.log("OLD");
                setupAlarms(new_alarm_prev_res);
                setAlarmPrevRes(new_alarm_prev_res);
              }
            }
          }
        } else {
          console.log("ALARMS====================================  ", message);
          alarm_prev_res
            ? alarm_prev_res.map((Item) => {
                Item["newly"] = false;
              })
            : "";
          if (alarm_prev_res) {
            console.log(
              '!alarm_prev_res.filter((item)=>{return item["id"]==message["id"]})' +
                !alarm_prev_res.find((item) => {
                  item.id === message.id;
                })
            );
            if (
              message["created"] == true &&
              !alarm_prev_res.find((item) => item.id === message.id)
            ) {
              console.log("NEW");
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
              console.log("OLD");
              setupAlarms(new_alarm_prev_res);
              setAlarmPrevRes(new_alarm_prev_res);
            }
          }
        }
      });
    }
  }, [alarm_prev_res, serverEvents]);

  useEffect(() => {
    console.log("clear case");
    // setupAlarms(alarm_prev_res)
  }, [deviceCtx, alarm_prev_res]);

  useEffect(() => {
    console.log("ALARMS TABLE USEEFFECT");
    return () =>
      serverEvents &&
      serverEvents.removeEventListener(
        "alarms",
        console.log("Removed alarms in alarms")
      );
  }, []);

  const onAnimationHandler = () => {
    const trElement = document.querySelectorAll(".tableBgcolor");
    trElement.forEach((item) => {
      item.classList.remove("tableBgcolor");
    });
    console.log(
      "==================================Animation Ended======================================="
    );
  };

  useEffect(() => {
    if (id) {
      getAlarmsCall(filters);
    }
  }, []);

  useEffect(() => {
    if (!id && !alarms) {
      getAlarmsCall(filters);
    }
  }, [deviceCtx.devicesObj.devices]);

  const getAlarmsCall = (filters) => {
    setLoadingAlarms(true);
    getAlarms(filters)
      .then((res) => {
        setupAlarms(res.data);
        setAlarmPrevRes(res.data);
        setAlarmsData(
          setupAlarms(res.data).map((oneAlarm) => {
            delete oneAlarm.Acknowledge;
            delete oneAlarm.Clear;
            return oneAlarm;
          })
        );
        setLoadingAlarms(false);
        setAlarmsCalled(true);
      })
      .catch(() => {
        setParentAlarms && setParentAlarms(0);
        setLoadingAlarms(false);
      });
  };

  const setupAlarms = (alarms) => {
    const alarmss = [];
    setSetUpAlarmsFlag(true);
    alarms.forEach((alarm) => {
      let newObj = {};
      const entity = deviceCtx.getDeviceById(alarm.entity_id, "");
      newObj.severity = alarm.alarm_settings.severity;
      if (entity) {
        newObj.entity = entity ? entity.name : "";
      } else if (name) {
        newObj.entity = name ? name : "";
      } else {
        console.log("RETURNING ELSE");
        return;
      }
      if (!alarm.alarm_settings.configurations) {
        alarm.alarm_settings.configurations = {};
      }
      if (alarm.alarm_settings.configurations.telemetry_type) {
        newObj.type =
          alarm.alarm_settings.alarm_type.name +
          " : " +
          alarm.alarm_settings.configurations.telemetry_type;
      } else {
        newObj.type = alarm.alarm_settings.alarm_type.name;
      }
      if (alarm.alarm_settings.configurations.max) {
        alarm.details.max = alarm.alarm_settings.configurations.max;
      }
      if (alarm.alarm_settings.configurations.min) {
        alarm.details.min = alarm.alarm_settings.configurations.min;
      }
      newObj.alarm_details = alarm.details;
      newObj.start_time = alarm.start_time;
      newObj.updated_time = alarm.updated_time;
      if (alarm.current_status === ALARM_STATUS.ACTIVE) {
        newObj.Acknowledge = { alarm: alarm.id, callback: getAlarmsCall };
      } else {
        newObj.Acknowledge = { actionPerformed: true };
      }
      if (alarm.current_status !== ALARM_STATUS.CLEARED) {
        newObj.Clear = { alarm: alarm.id, callback: getAlarmsCall };
      } else {
        newObj.Clear = { actionPerformed: true };
      }
      alarm["newly"] == true
        ? (newObj["newly"] = true)
        : (newObj["newly"] = false);
      newObj.current_status = alarm.current_status;
      delete newObj.alarm_settings;
      alarmss.push(newObj);
    });
    if (alarms.length === 0) {
      setAlarms(alarmss);
    } else if (alarmss.length > 0) {
      setAlarms(alarmss);
    }
  };

  const handleFilter = (reset) => {
    const newFilters = id ? { entity_id: id } : {};
    if (reset) {
      getAlarmsCall(newFilters);
      setStartDate("");
      setEndDate("");
      setNotified("-1");
      setAlarmType("-1");
      setSeverity("-1");
      setStatus("-1");
      setEntity("-1");
    } else {
      if (startDate !== "" && startDate !== undefined && startDate !== "-1") {
        const startDateISO = formatLocalToISOUTC(startDate);
        newFilters.from_date = startDateISO;
      }
      if (endDate !== "" && endDate !== undefined && endDate !== "-1") {
        const endDateISO = formatLocalToISOUTC(endDate);
        newFilters.to_date = endDateISO;
      }
      if (notified !== "" && notified !== undefined && notified !== "-1") {
        newFilters.notified = notified;
      }
      if (alarmType !== "" && alarmType !== undefined && alarmType !== "-1") {
        newFilters.alarm_type = alarmType;
      }
      if (severity !== "" && severity !== undefined && severity !== "-1") {
        newFilters.severity = severity;
      }
      if (status !== "" && status !== undefined && status !== "-1") {
        newFilters.status = status;
      }
      if (entity !== "" && entity !== undefined && entity !== "-1") {
        newFilters.entity_id = entity;
      }
      setAlarmsFilters(newFilters);
      getAlarmsCall(newFilters);
    }
  };

  const prepareExportDataAlarms = (data) => {
    data.map((alarm) => {
      delete alarm.Acknowledge;
      delete alarm.Clear;
      delete alarm.description;
      delete alarm.id;
      Object.keys(alarm).forEach((key) => {
        if (alarm[key]) {
          alarm[key] = String(alarm[key]) + "";
        } else {
          delete alarm[key];
        }
      });
      return alarm;
    });
    return data;
  };

  const FilterModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
      <>
        <IconButton
          cursor={"pointer"}
          as={BiFilter}
          size={"sm"}
          fontSize={"xs"}
          rounded={"full"}
          color={"primary.100"}
          bg={"primary.60"}
          onClick={onOpen}
          boxShadow={
            theme.darkMode
              ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
              : "5px 4px 15px 1px rgba(0,0,0,0.2)"
          }
        />
        <FunctionalModalV2
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
                theme.darkMode
                  ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                  : "5px 4px 15px 1px rgba(0,0,0,0.2)"
              }
            />
          }
          isOpen={isOpen}
          modalTitle={"Set Filters"}
          modalMinH={"550px"}
          modalMinW={"70%"}
          transparent
          btnAction={
            <Flex gap={2}>
              <Button
                bg={"primary.80"}
                color={"text.warning"}
                width={120}
                _hover={{ bg: "primary.60" }}
                boxShadow={
                  theme.darkMode
                    ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                    : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                }
                onClick={() => {
                  handleFilter(true);
                  onClose();
                }}
              >
                Reset filters
              </Button>
              <Button
                bg={"primary.80"}
                width={120}
                _hover={{ bg: "primary.60" }}
                color={"text.primary"}
                boxShadow={
                  theme.darkMode
                    ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
                    : "5px 4px 15px 1px rgba(0,0,0,0.2)"
                }
                onClick={() => {
                  handleFilter(false);
                  onClose();
                }}
              >
                Set filters
              </Button>
            </Flex>
          }
        >
          <Box
            width={"100%"}
            display={"flex"}
            flexWrap={"wrap"}
            flexDir={"row"}
            justifyContent={"space-between"}
          >
            <HistoryPicker
              showBtn={false}
              selectStartDate={(date) => setStartDate(date)}
              selectEndDate={(date) => setEndDate(date)}
              disabled={!startDate || !endDate}
              startDate={startDate}
              endDate={endDate}
              endDateRequired={false}
              width={"45%"}
              minW={"350px"}
            />
          </Box>
          <Box
            width={"100%"}
            display={"flex"}
            flexWrap={"wrap"}
            flexDir={"row"}
            justifyContent={"space-between"}
          >
            <Box
              display={"flex"}
              flexDir={"column"}
              width={"45%"}
              minW={"350px"}
              mt={4}
            >
              <Text p={1} fontWeight={"bold"} color="text.primary">
                Alarm Type:
              </Text>
              <StyledSelect
                value={alarmType}
                onchange={setAlarmType}
                general={true}
                required={false}
                options={alarmTypes.map((type) => {
                  return { label: type.name, value: type.id };
                })}
              />
            </Box>
            <Box
              display={"flex"}
              flexDir={"column"}
              width={"45%"}
              minW={"350px"}
              mt={4}
            >
              <Text p={1} fontWeight={"bold"} color="text.primary">
                Severity:
              </Text>
              <StyledSelect
                value={severity}
                onchange={setSeverity}
                general={true}
                required={false}
                options={Object.values(SEVERITY).map((type) => {
                  return { label: type, value: type };
                })}
              />
            </Box>
            <Box
              display={"flex"}
              flexDir={"column"}
              width={"45%"}
              minW={"350px"}
              mt={4}
            >
              <Text p={1} fontWeight={"bold"} color="text.primary">
                Status:
              </Text>
              <StyledSelect
                value={status}
                onchange={setStatus}
                general={true}
                required={false}
                options={Object.values(ALARM_STATUS).map((type) => {
                  return { label: type, value: type };
                })}
              />
            </Box>
            <Box
              display={"flex"}
              flexDir={"column"}
              width={"45%"}
              minW={"350px"}
              mt={4}
            >
              <Text p={1} fontWeight={"bold"} color="text.primary">
                Notified:
              </Text>
              <StyledSelect
                value={notified}
                onchange={setNotified}
                general={true}
                required={false}
                options={[
                  { label: "Yes", value: 1 },
                  { label: "No", value: 0 },
                ]}
              />
            </Box>

            {cyLocks != undefined && cyTags != undefined && (
              <Box
                display={"flex"}
                flexDir={"column"}
                width={"45%"}
                minW={"350px"}
                mt={4}
              >
                <Text p={1} fontWeight={"bold"} color="text.primary">
                  Entity:
                </Text>
                <StyledSelect
                  value={entity}
                  onchange={setEntity}
                  general={true}
                  required={false}
                  options={[...cyLocks, ...cyTags].map((dev) => {
                    return { label: dev.name, value: dev.id };
                  })}
                />
              </Box>
            )}
          </Box>

          <SchedulingModal />
        </FunctionalModalV2>
      </>
    );
  };

  const getFilters = () => {
    return alarmsFilters;
  };

  const SchedulingModal = () => {
    return (
      <>
        <Button
          bg={"primary.80"}
          mt={10}
          width={120}
          _hover={{ bg: "primary.60" }}
          color={"text.primary"}
          boxShadow={
            theme.darkMode
              ? "5px 4px 15px 1px rgba(0,0,0,0.6)"
              : "5px 4px 15px 1px rgba(0,0,0,0.2)"
          }
          mb={4}
          onClick={onToggle}
          borderRadius={20}
          w={"100%"}
        >
          Set Scheduling Reports
        </Button>
        <Box p={1} w={"100%"}>
          <Collapse in={isOpen} animateOpacity>
            <Box
              p={2}
              color="text.primary"
              mt="4"
              rounded="md"
              shadow="md"
              w={"100%"}
              h={"100%"}
            >
              <SchedulingReports reportQueryParams={getFilters} />
            </Box>
          </Collapse>
        </Box>
      </>
    );
  };

  return (
    <>
      <ComplexTable
        hiddenCols={[
          "id",
          "alarm_settings",
          "description",
          "resolved_time",
          "notified",
          "entity_id",
          "newly",
        ]}
        loading={loadingAlarms}
        pageNumber={alarmTablePage}
        setPageNumber={setAlarmTablePage}
        extractFn={extractAlarmHeaders}
        title={"Alarms"}
        icon={<Image position={"relative"} src={alarm} h={8}></Image>}
        data={
          alarms &&
          [...alarms].sort((a, b) => {
            const timeA = new Date(a.updated_time);
            const timeB = new Date(b.updated_time);
            return timeB - timeA;
          })
        }
      >
        <Box as={Flex} gap={1}>
          {FilterModal()}
          <PdfExport
            title={"Alarms"}
            data={prepareExportDataAlarms([...alarmsData])}
          />
          <ExcelExport
            title={"Alarms"}
            data={prepareExportDataAlarms([...alarmsData])}
          />
        </Box>
      </ComplexTable>
    </>
  );
}

export default AlarmsTable;
